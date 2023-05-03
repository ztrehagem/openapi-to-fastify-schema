import type { OpenAPIV3_1 } from "openapi-types";
import type { FlattenOperation } from "./FlattenOperation.js";
import { toEntries } from "../utils/object.js";

export const retrieveFlattenOperations = (
  paths: OpenAPIV3_1.PathsObject
): FlattenOperation[] => {
  return toEntries(paths).flatMap<FlattenOperation>(([path, pathItemObject]) =>
    toEntries({
      get: pathItemObject?.get,
      put: pathItemObject?.put,
      post: pathItemObject?.post,
      delete: pathItemObject?.delete,
      options: pathItemObject?.options,
      head: pathItemObject?.head,
      patch: pathItemObject?.patch,
      trace: pathItemObject?.trace,
    }).flatMap<FlattenOperation>(([method, operationItem]) =>
      operationItem
        ? {
            path,
            method,
            ...operationItem,
            parameters: [
              ...(pathItemObject?.parameters ?? []),
              ...(operationItem?.parameters ?? []),
            ],
          }
        : []
    )
  );
};
