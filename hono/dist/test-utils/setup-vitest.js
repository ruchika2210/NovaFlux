// src/test-utils/setup-vitest.ts
import * as nodeCrypto from "node:crypto";
import { vi } from "vitest";
if (!globalThis.crypto) {
  vi.stubGlobal("crypto", nodeCrypto);
  vi.stubGlobal("CryptoKey", nodeCrypto.webcrypto.CryptoKey);
}
var MockCache = class {
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
};
var globalStore = /* @__PURE__ */ new Map();
var caches = {
  open: (name) => {
    return new MockCache(name, globalStore);
  }
};
vi.stubGlobal("caches", caches);
