import { OpenAPIV3, type OpenAPIV3_1 } from "openapi-types";
import type { FlattenOperation } from "./FlattenOperation.js";
import { toEntries } from "../utils/object.js";

export const retrieveFlattenOperations = (
  paths: OpenAPIV3_1.PathsObject
): FlattenOperation[] => {
  return toEntries(paths).flatMap<FlattenOperation>(([path, pathItemObject]) =>
    toEntries({
      [OpenAPIV3.HttpMethods.GET]: pathItemObject?.get,
      [OpenAPIV3.HttpMethods.PUT]: pathItemObject?.put,
      [OpenAPIV3.HttpMethods.POST]: pathItemObject?.post,
      [OpenAPIV3.HttpMethods.DELETE]: pathItemObject?.delete,
      [OpenAPIV3.HttpMethods.OPTIONS]: pathItemObject?.options,
      [OpenAPIV3.HttpMethods.HEAD]: pathItemObject?.head,
      [OpenAPIV3.HttpMethods.PATCH]: pathItemObject?.patch,
      [OpenAPIV3.HttpMethods.TRACE]: pathItemObject?.trace,
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
