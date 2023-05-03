import type { OpenAPIV3_1 } from "openapi-types";
import type { Context } from "./Context.js";
import { resolveAllRef } from "./resolveAlllRef.js";
import { toEntries } from "../../utils/object.js";

export const resolveResponsesObject = async (
  raw: OpenAPIV3_1.ResponsesObject | undefined,
  context: Context
): Promise<Record<string, unknown> | undefined> => {
  if (!raw) return;

  const entries = toEntries(raw);

  const promises = entries.map(async ([status, obj]) => {
    if ("$ref" in obj) {
      const refUrl = new URL(obj.$ref, context.from);
      obj = await context.refResolver.resolve<OpenAPIV3_1.ResponseObject>(
        refUrl
      );
    }

    const resolved = (await resolveAllRef(obj, context)) as Record<
      keyof OpenAPIV3_1.ResponseObject,
      unknown
    >;

    const resolvedResponseObject = {
      ...resolved,
      content: resolved.content ?? {},
    };

    return [status, resolvedResponseObject];
  });

  return Object.fromEntries(await Promise.all(promises)) as Record<
    string,
    unknown
  >;
};
