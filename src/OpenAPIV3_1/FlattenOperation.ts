import type { OpenAPIV3_1 } from "openapi-types";

type HttpMethod =
  | "get"
  | "put"
  | "post"
  | "delete"
  | "options"
  | "head"
  | "patch"
  | "trace";

export type FlattenOperation = OpenAPIV3_1.OperationObject & {
  path: string;
  method: HttpMethod;
};
