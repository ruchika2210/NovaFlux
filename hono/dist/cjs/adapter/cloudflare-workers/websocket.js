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
var websocket_exports = {};
__export(websocket_exports, {
  upgradeWebSocket: () => upgradeWebSocket
});
module.exports = __toCommonJS(websocket_exports);
const upgradeWebSocket = (createEvents) => async (c, next) => {
  const events = await createEvents(c);
  const upgradeHeader = c.req.header("Upgrade");
  if (upgradeHeader !== "websocket") {
    return await next();
  }
  const webSocketPair = new WebSocketPair();
  const client = webSocketPair[0];
  const server = webSocketPair[1];
  const wsContext = {
    binaryType: "arraybuffer",
    close: (code, reason) => server.close(code, reason),
    get protocol() {
      return server.protocol;
    },
    raw: server,
    get readyState() {
      return server.readyState;
    },
    url: server.url ? new URL(server.url) : null,
    send: (source) => server.send(source)
  };
  if (events.onOpen) {
    server.addEventListener("open", (evt) => events.onOpen?.(evt, wsContext));
  }
  if (events.onClose) {
    server.addEventListener("close", (evt) => events.onClose?.(evt, wsContext));
  }
  if (events.onMessage) {
    server.addEventListener("message", (evt) => events.onMessage?.(evt, wsContext));
  }
  if (events.onError) {
    server.addEventListener("error", (evt) => events.onError?.(evt, wsContext));
  }
  server.accept?.();
  return new Response(null, {
    status: 101,
    webSocket: client
  });
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  upgradeWebSocket
});
