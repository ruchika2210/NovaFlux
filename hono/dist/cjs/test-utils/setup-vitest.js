"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var nodeCrypto = __toESM(require("node:crypto"), 1);
var import_vitest = require("vitest");
if (!globalThis.crypto) {
  import_vitest.vi.stubGlobal("crypto", nodeCrypto);
  import_vitest.vi.stubGlobal("CryptoKey", nodeCrypto.webcrypto.CryptoKey);
}
class MockCache {
  name;
  store;
  constructor(name, store) {
    this.name = name;
    this.store = store;
  }
  async match(key) {
    return this.store.get(key) || null;
  }
  async keys() {
    return this.store.keys();
  }
  async put(key, response) {
    this.store.set(key, response);
  }
}
const globalStore = /* @__PURE__ */ new Map();
const caches = {
  open: (name) => {
    return new MockCache(name, globalStore);
  }
};
import_vitest.vi.stubGlobal("caches", caches);
