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
var validator_exports = {};
__export(validator_exports, {
  validator: () => validator
});
module.exports = __toCommonJS(validator_exports);
var import_cookie = require("../helper/cookie");
var import_http_exception = require("../http-exception");
var import_buffer = require("../utils/buffer");
const validator = (target, validationFunc) => {
  return async (c, next) => {
    let value = {};
    const contentType = c.req.header("Content-Type");
    switch (target) {
      case "json":
        if (!contentType || !/^application\/([a-z-\.]+\+)?json/.test(contentType)) {
          const message = `Invalid HTTP header: Content-Type=${contentType}`;
          throw new import_http_exception.HTTPException(400, { message });
        }
        try {
          value = await c.req.json();
        } catch {
          const message = "Malformed JSON in request body";
          throw new import_http_exception.HTTPException(400, { message });
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
          const formData = await (0, import_buffer.bufferToFormData)(arrayBuffer, contentType);
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
          throw new import_http_exception.HTTPException(400, { message });
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
        value = (0, import_cookie.getCookie)(c);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  validator
});
