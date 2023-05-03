import type { OpenAPIV3_1 } from "openapi-types";
import type { Context } from "./Context.js";
import type { FastifySchema } from "fastify";
import { resolveSchemaObject } from "./resolveSchemaObject.js";

export const resolveRequestBodyObject = async (
  raw: OpenAPIV3_1.ReferenceObject | OpenAPIV3_1.RequestBodyObject | undefined,
  { refResolver, from }: Context
): Promise<FastifySchema["body"]> => {
  if (!raw) return;

  const resolved =
    await refResolver.resolveRefObject<OpenAPIV3_1.RequestBodyObject>(
      raw,
      from
    );

  const rawSchemaObject = resolved.content["application/json"].schema;

  return await resolveSchemaObject(rawSchemaObject, { refResolver, from });
};
