import { Buffer } from "node:buffer";

if (typeof globalThis.btoa !== "function") {
  globalThis.btoa = (data: string) => Buffer.from(data, "binary").toString("base64");
}
if (typeof globalThis.atob !== "function") {
  globalThis.atob = (data: string) => Buffer.from(data, "base64").toString("binary");
}
