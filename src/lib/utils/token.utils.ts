import { randomBytes } from "crypto";

export const generateToken = () =>
  randomBytes(16)
    .toString("base64")
    .replace(/[^a-zA-Z0-9]/g, "")
    .substring(0, 16);

export const compareToken = (tokenOne: string, tokenTwo: string) =>
  tokenOne === tokenTwo;
