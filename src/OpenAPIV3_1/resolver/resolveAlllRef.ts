import type { Context } from "./Context.js";

export const resolveAllRef = async (
  obj: unknown,
  context: Context
): Promise<unknown> => {
  if (obj == null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return await Promise.all(
      obj.map((element) => resolveAllRef(element, context))
    );
  }

  if (typeof obj == "object") {
    if ("$ref" in obj) {
      const resolved = await context.refResolver.resolveRefObject<unknown>(
        obj,
        context.from
      );
      return resolveAllRef(resolved, context);
    }

    const entries = await Promise.all(
      Object.entries(obj).map(async ([key, value]) => [
        key,
        await resolveAllRef(value, context),
      ])
    );
    return Object.fromEntries(entries) as unknown;
  }

  return obj;
};
