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
var jwt_exports = {};
__export(jwt_exports, {
  decode: () => decode,
  isTokenHeader: () => isTokenHeader,
  sign: () => sign,
  verify: () => verify
});
module.exports = __toCommonJS(jwt_exports);
var import_encode = require("../../utils/encode");
var import_jwa = require("./jwa");
var import_jws = require("./jws");
var import_types = require("./types");
var import_utf8 = require("./utf8");
const encodeJwtPart = (part) => (0, import_encode.encodeBase64Url)(import_utf8.utf8Encoder.encode(JSON.stringify(part))).replace(/=/g, "");
const encodeSignaturePart = (buf) => (0, import_encode.encodeBase64Url)(buf).replace(/=/g, "");
const decodeJwtPart = (part) => JSON.parse(import_utf8.utf8Decoder.decode((0, import_encode.decodeBase64Url)(part)));
function isTokenHeader(obj) {
  if (typeof obj === "object" && obj !== null) {
    const objWithAlg = obj;
    return "alg" in objWithAlg && Object.values(import_jwa.AlgorithmTypes).includes(objWithAlg.alg) && (!("typ" in objWithAlg) || objWithAlg.typ === "JWT");
  }
  return false;
}
const sign = async (payload, privateKey, alg = "HS256") => {
  const encodedPayload = encodeJwtPart(payload);
  const encodedHeader = encodeJwtPart({ alg, typ: "JWT" });
  const partialToken = `${encodedHeader}.${encodedPayload}`;
  const signaturePart = await (0, import_jws.signing)(privateKey, alg, import_utf8.utf8Encoder.encode(partialToken));
  const signature = encodeSignaturePart(signaturePart);
  return `${partialToken}.${signature}`;
};
const verify = async (token, publicKey, alg = "HS256") => {
  const tokenParts = token.split(".");
  if (tokenParts.length !== 3) {
    throw new import_types.JwtTokenInvalid(token);
  }
  const { header, payload } = decode(token);
  if (!isTokenHeader(header)) {
    throw new import_types.JwtHeaderInvalid(header);
  }
  const now = Math.floor(Date.now() / 1e3);
  if (payload.nbf && payload.nbf > now) {
    throw new import_types.JwtTokenNotBefore(token);
  }
  if (payload.exp && payload.exp <= now) {
    throw new import_types.JwtTokenExpired(token);
  }
  if (payload.iat && now < payload.iat) {
    throw new import_types.JwtTokenIssuedAt(now, payload.iat);
  }
  const headerPayload = token.substring(0, token.lastIndexOf("."));
  const verified = await (0, import_jws.verifying)(
    publicKey,
    alg,
    (0, import_encode.decodeBase64Url)(tokenParts[2]),
    import_utf8.utf8Encoder.encode(headerPayload)
  );
  if (!verified) {
    throw new import_types.JwtTokenSignatureMismatched(token);
  }
  return payload;
};
const decode = (token) => {
  try {
    const [h, p] = token.split(".");
    const header = decodeJwtPart(h);
    const payload = decodeJwtPart(p);
    return {
      header,
      payload
    };
  } catch (e) {
    throw new import_types.JwtTokenInvalid(token);
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  decode,
  isTokenHeader,
  sign,
  verify
});
