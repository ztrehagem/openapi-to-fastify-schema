import type { OpenAPIV3_1 } from "openapi-types";

export type FlattenOperation = OpenAPIV3_1.OperationObject & {
  path: string;
  method: OpenAPIV3_1.HttpMethods;
};
