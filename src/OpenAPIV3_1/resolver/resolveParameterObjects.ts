import type { OpenAPIV3_1 } from "openapi-types";
import type { Context } from "./Context.js";
import { resolveSchemaObject } from "./resolveSchemaObject.js";

type Result = {
  params: unknown;
  querystring: unknown;
};

export const resolveParameterObjects = async (
  objs:
    | readonly (OpenAPIV3_1.ParameterObject | OpenAPIV3_1.ReferenceObject)[]
    | undefined,
  context: Context
): Promise<Result> => {
  const resolvedParams = await Promise.all(
    objs?.map((obj) =>
      context.refResolver.resolveRefObject<OpenAPIV3_1.ParameterObject>(
        obj,
        context.from
      )
    ) ?? []
  );

  const pathParams = resolvedParams.filter((param) => param.in == "path");
  const queryParams = resolvedParams.filter((param) => param.in == "query");

  const paramsPropertyEntries = pathParams.map(
    async (param) =>
      [param.name, await resolveSchemaObject(param.schema, context)] as const
  );

  const paramsRequiredPropertyNames = pathParams
    .filter((param) => param.required)
    .map((param) => param.name);

  const paramsSchema = {
    type: "object",
    properties: Object.fromEntries(await Promise.all(paramsPropertyEntries)),
    required: paramsRequiredPropertyNames,
  };

  const queryPropertyEntries = queryParams.map(
    async (param) =>
      [param.name, await resolveSchemaObject(param.schema, context)] as const
  );

  const queryRequiredPropertyNames = queryParams
    .filter((param) => param.required)
    .map((param) => param.name);

  const querySchema = {
    type: "object",
    properties: Object.fromEntries(await Promise.all(queryPropertyEntries)),
    required: queryRequiredPropertyNames,
  };

  return {
    params: paramsSchema,
    querystring: querySchema,
  };
};
