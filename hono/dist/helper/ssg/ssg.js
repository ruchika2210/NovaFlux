// src/helper/ssg/ssg.ts
import { replaceUrlParam } from "../../client/utils.js";
import { createPool } from "../../utils/concurrent.js";
import { getExtension } from "../../utils/mime.js";
import { SSG_CONTEXT, X_HONO_DISABLE_SSG_HEADER_KEY } from "./middleware.js";
import { dirname, filterStaticGenerateRoutes, joinPaths } from "./utils.js";
var DEFAULT_CONCURRENCY = 2;
var DEFAULT_CONTENT_TYPE = "text/plain";
var generateFilePath = (routePath, outDir, mimeType, extensionMap) => {
  const extension = determineExtension(mimeType, extensionMap);
  if (routePath.endsWith(`.${extension}`)) {
    return joinPaths(outDir, routePath);
  }
  if (routePath === "/") {
    return joinPaths(outDir, `index.${extension}`);
  }
  if (routePath.endsWith("/")) {
    return joinPaths(outDir, routePath, `index.${extension}`);
  }
  return joinPaths(outDir, `${routePath}.${extension}`);
};
var parseResponseContent = async (response) => {
  const contentType = response.headers.get("Content-Type");
  try {
    if (contentType?.includes("text") || contentType?.includes("json")) {
      return await response.text();
    } else {
      return await response.arrayBuffer();
    }
  } catch (error) {
    throw new Error(
      `Error processing response: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
};
var defaultExtensionMap = {
  "text/html": "html",
  "text/xml": "xml",
  "application/xml": "xml",
  "application/yaml": "yaml"
};
var determineExtension = (mimeType, userExtensionMap) => {
  const extensionMap = userExtensionMap || defaultExtensionMap;
  if (mimeType in extensionMap) {
    return extensionMap[mimeType];
  }
  return getExtension(mimeType) || "html";
};
var combineBeforeRequestHooks = (hooks) => {
  if (!Array.isArray(hooks)) {
    return hooks;
  }
  return async (req) => {
    let currentReq = req;
    for (const hook of hooks) {
      const result = await hook(currentReq);
      if (result === false) {
        return false;
      }
      if (result instanceof Request) {
        currentReq = result;
      }
    }
    return currentReq;
  };
};
var combineAfterResponseHooks = (hooks) => {
  if (!Array.isArray(hooks)) {
    return hooks;
  }
  return async (res) => {
    let currentRes = res;
    for (const hook of hooks) {
      const result = await hook(currentRes);
      if (result === false) {
        return false;
      }
      if (result instanceof Response) {
        currentRes = result;
      }
    }
    return currentRes;
  };
};
var combineAfterGenerateHooks = (hooks) => {
  if (!Array.isArray(hooks)) {
    return hooks;
  }
  return async (result) => {
    for (const hook of hooks) {
      await hook(result);
    }
  };
};
var fetchRoutesContent = function* (app, beforeRequestHook, afterResponseHook, concurrency) {
  const baseURL = "http://localhost";
  const pool = createPool({ concurrency });
  for (const route of filterStaticGenerateRoutes(app)) {
    const thisRouteBaseURL = new URL(route.path, baseURL).toString();
    let forGetInfoURLRequest = new Request(thisRouteBaseURL);
    yield new Promise(async (resolveGetInfo, rejectGetInfo) => {
      try {
        if (beforeRequestHook) {
          const maybeRequest = await beforeRequestHook(forGetInfoURLRequest);
          if (!maybeRequest) {
            resolveGetInfo(void 0);
            return;
          }
          forGetInfoURLRequest = maybeRequest;
        }
        await pool.run(() => app.fetch(forGetInfoURLRequest));
        if (!forGetInfoURLRequest.ssgParams) {
          if (isDynamicRoute(route.path)) {
            resolveGetInfo(void 0);
            return;
          }
          forGetInfoURLRequest.ssgParams = [{}];
        }
        const requestInit = {
          method: forGetInfoURLRequest.method,
          headers: forGetInfoURLRequest.headers
        };
        resolveGetInfo(
          function* () {
            for (const param of forGetInfoURLRequest.ssgParams) {
              yield new Promise(async (resolveReq, rejectReq) => {
                try {
                  const replacedUrlParam = replaceUrlParam(route.path, param);
                  let response = await pool.run(
                    () => app.request(replacedUrlParam, requestInit, {
                      [SSG_CONTEXT]: true
                    })
                  );
                  if (response.headers.get(X_HONO_DISABLE_SSG_HEADER_KEY)) {
                    resolveReq(void 0);
                    return;
                  }
                  if (afterResponseHook) {
                    const maybeResponse = await afterResponseHook(response);
                    if (!maybeResponse) {
                      resolveReq(void 0);
                      return;
                    }
                    response = maybeResponse;
                  }
                  const mimeType = response.headers.get("Content-Type")?.split(";")[0] || DEFAULT_CONTENT_TYPE;
                  const content = await parseResponseContent(response);
                  resolveReq({
                    routePath: replacedUrlParam,
                    mimeType,
                    content
                  });
                } catch (error) {
                  rejectReq(error);
                }
              });
            }
          }()
        );
      } catch (error) {
        rejectGetInfo(error);
      }
    });
  }
};
var isDynamicRoute = (path) => {
  return path.split("/").some((segment) => segment.startsWith(":") || segment.includes("*"));
};
var createdDirs = /* @__PURE__ */ new Set();
var saveContentToFile = async (data, fsModule, outDir, extensionMap) => {
  const awaitedData = await data;
  if (!awaitedData) {
    return;
  }
  const { routePath, content, mimeType } = awaitedData;
  const filePath = generateFilePath(routePath, outDir, mimeType, extensionMap);
  const dirPath = dirname(filePath);
  if (!createdDirs.has(dirPath)) {
    await fsModule.mkdir(dirPath, { recursive: true });
    createdDirs.add(dirPath);
  }
  if (typeof content === "string") {
    await fsModule.writeFile(filePath, content);
  } else if (content instanceof ArrayBuffer) {
    await fsModule.writeFile(filePath, new Uint8Array(content));
  }
  return filePath;
};
var toSSG = async (app, fs, options) => {
  let result;
  const getInfoPromises = [];
  const savePromises = [];
  try {
    const outputDir = options?.dir ?? "./static";
    const concurrency = options?.concurrency ?? DEFAULT_CONCURRENCY;
    const combinedBeforeRequestHook = combineBeforeRequestHooks(
      options?.beforeRequestHook || ((req) => req)
    );
    const combinedAfterResponseHook = combineAfterResponseHooks(
      options?.afterResponseHook || ((req) => req)
    );
    const getInfoGen = fetchRoutesContent(
      app,
      combinedBeforeRequestHook,
      combinedAfterResponseHook,
      concurrency
    );
    for (const getInfo of getInfoGen) {
      getInfoPromises.push(
        getInfo.then((getContentGen) => {
          if (!getContentGen) {
            return;
          }
          for (const content of getContentGen) {
            savePromises.push(saveContentToFile(content, fs, outputDir).catch((e) => e));
          }
        })
      );
    }
    await Promise.all(getInfoPromises);
    const files = [];
    for (const savePromise of savePromises) {
      const fileOrError = await savePromise;
      if (typeof fileOrError === "string") {
        files.push(fileOrError);
      } else if (fileOrError) {
        throw fileOrError;
      }
    }
    result = { success: true, files };
  } catch (error) {
    const errorObj = error instanceof Error ? error : new Error(String(error));
    result = { success: false, files: [], error: errorObj };
  }
  if (options?.afterGenerateHook) {
    const conbinedAfterGenerateHooks = combineAfterGenerateHooks(options?.afterGenerateHook);
    await conbinedAfterGenerateHooks(result);
  }
  return result;
};
export {
  combineAfterGenerateHooks,
  combineAfterResponseHooks,
  combineBeforeRequestHooks,
  defaultExtensionMap,
  fetchRoutesContent,
  saveContentToFile,
  toSSG
};
