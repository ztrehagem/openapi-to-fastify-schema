import type { OpenAPIV3_1 } from "openapi-types";
import type { Context } from "./Context.js";
import { resolveAllRef } from "./resolveAlllRef.js";

export const resolveSchemaObject = async (
  obj: OpenAPIV3_1.SchemaObject | OpenAPIV3_1.ReferenceObject | undefined,
  context: Context
): Promise<unknown> => {
  return resolveAllRef(obj, context);
};
