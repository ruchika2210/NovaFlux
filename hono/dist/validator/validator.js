// src/validator/validator.ts
import { getCookie } from "../helper/cookie/index.js";
import { HTTPException } from "../http-exception.js";
import { bufferToFormData } from "../utils/buffer.js";
var validator = (target, validationFunc) => {
  return async (c, next) => {
    let value = {};
    const contentType = c.req.header("Content-Type");
    switch (target) {
      case "json":
        if (!contentType || !/^application\/([a-z-\.]+\+)?json/.test(contentType)) {
          const message = `Invalid HTTP header: Content-Type=${contentType}`;
          throw new HTTPException(400, { message });
        }
        try {
          value = await c.req.json();
        } catch {
          const message = "Malformed JSON in request body";
          throw new HTTPException(400, { message });
        }
        break;
      case "form": {
        if (!contentType) {
          break;
        }
        if (c.req.bodyCache.formData) {
          value = await c.req.bodyCache.formData;
          break;
        }
        try {
          const arrayBuffer = await c.req.arrayBuffer();
          const formData = await bufferToFormData(arrayBuffer, contentType);
          const form = {};
          formData.forEach((value2, key) => {
            if (key.endsWith("[]")) {
              if (form[key] === void 0) {
                form[key] = [value2];
              } else if (Array.isArray(form[key])) {
                ;
                form[key].push(value2);
              }
            } else {
              form[key] = value2;
            }
          });
          value = form;
          c.req.bodyCache.formData = formData;
        } catch (e) {
          let message = "Malformed FormData request.";
          message += e instanceof Error ? ` ${e.message}` : ` ${String(e)}`;
          throw new HTTPException(400, { message });
        }
        break;
      }
      case "query":
        value = Object.fromEntries(
          Object.entries(c.req.queries()).map(([k, v]) => {
            return v.length === 1 ? [k, v[0]] : [k, v];
          })
        );
        break;
      case "param":
        value = c.req.param();
        break;
      case "header":
        value = c.req.header();
        break;
      case "cookie":
        value = getCookie(c);
        break;
    }
    const res = await validationFunc(value, c);
    if (res instanceof Response) {
      return res;
    }
    c.req.addValidatedData(target, res);
    await next();
  };
};
export {
  validator
};
