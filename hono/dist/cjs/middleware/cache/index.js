"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var cache_exports = {};
__export(cache_exports, {
  cache: () => cache
});
module.exports = __toCommonJS(cache_exports);
const cache = (options) => {
  if (!globalThis.caches) {
    console.log("Cache Middleware is not enabled because caches is not defined.");
    return async (_c, next) => await next();
  }
  if (options.wait === void 0) {
    options.wait = false;
  }
  const cacheControlDirectives = options.cacheControl?.split(",").map((directive) => directive.toLowerCase());
  const varyDirectives = Array.isArray(options.vary) ? options.vary : options.vary?.split(",").map((directive) => directive.trim());
  if (options.vary?.includes("*")) {
    throw new Error(
      'Middleware vary configuration cannot include "*", as it disallows effective caching.'
    );
  }
  const addHeader = (c) => {
    if (cacheControlDirectives) {
      const existingDirectives = c.res.headers.get("Cache-Control")?.split(",").map((d) => d.trim().split("=", 1)[0]) ?? [];
      for (const directive of cacheControlDirectives) {
        let [name, value] = directive.trim().split("=", 2);
        name = name.toLowerCase();
        if (!existingDirectives.includes(name)) {
          c.header("Cache-Control", `${name}${value ? `=${value}` : ""}`, { append: true });
        }
      }
    }
    if (varyDirectives) {
      const existingDirectives = c.res.headers.get("Vary")?.split(",").map((d) => d.trim()) ?? [];
      const vary = Array.from(
        new Set(
          [...existingDirectives, ...varyDirectives].map((directive) => directive.toLowerCase())
        )
      ).sort();
      if (vary.includes("*")) {
        c.header("Vary", "*");
      } else {
        c.header("Vary", vary.join(", "));
      }
    }
  };
  return async function cache2(c, next) {
    let key = c.req.url;
    if (options.keyGenerator) {
      key = await options.keyGenerator(c);
    }
    const cacheName = typeof options.cacheName === "function" ? await options.cacheName(c) : options.cacheName;
    const cache3 = await caches.open(cacheName);
    const response = await cache3.match(key);
    if (response) {
      return new Response(response.body, response);
    }
    await next();
    if (!c.res.ok) {
      return;
    }
    addHeader(c);
    const res = c.res.clone();
    if (options.wait) {
      await cache3.put(key, res);
    } else {
      c.executionCtx.waitUntil(cache3.put(key, res));
    }
  };
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  cache
});
