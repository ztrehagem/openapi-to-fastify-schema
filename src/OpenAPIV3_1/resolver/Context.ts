import type { RefResolver } from "../../RefResolver/RefResolver.js";

export type Context = {
  readonly refResolver: RefResolver;
  readonly from: URL;
};
