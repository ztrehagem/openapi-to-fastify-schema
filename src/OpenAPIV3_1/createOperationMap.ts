import type { FlattenOperation } from "./FlattenOperation.js";
import type { RefResolver } from "../RefResolver/RefResolver.js";
import { toUppercase } from "../utils/string.js";
import type { Operation } from "./Operation.js";
import { resolveRequestBodyObject } from "./resolver/resolveRequestBodyObject.js";
import { resolveParameterObjects } from "./resolver/resolveParameterObjects.js";
import { resolveResponsesObject } from "./resolver/resolveResponsesObject.js";

export const createOperationMap = async (
  flattenOperations: readonly FlattenOperation[],
  refResolver: RefResolver,
  from: URL
): Promise<Record<string, Operation>> => {
  const entries = flattenOperations.map<Promise<[string, Operation]>>(
    async (flattenOperation) => {
      const operationId =
        flattenOperation.operationId ??
        createFallbackOperationId(flattenOperation);

      const pathString = convertPathString(flattenOperation.path);

      const [body, { params, querystring }, response] = await Promise.all([
        resolveRequestBodyObject(flattenOperation.requestBody, {
          refResolver,
          from,
        }),
        resolveParameterObjects(flattenOperation.parameters, {
          refResolver,
          from,
        }),
        resolveResponsesObject(flattenOperation.responses, {
          refResolver,
          from,
        }),
      ]);

      const operation: Operation = {
        method: toUppercase(flattenOperation.method),
        url: pathString,
        schema: {
          body,
          params,
          querystring,
          response,
        },
      };

      return [operationId, operation];
    }
  );

  return Object.fromEntries(await Promise.all(entries));
};

const createFallbackOperationId = (op: FlattenOperation): string => {
  return `${op.method}:${op.path}`;
};

const convertPathString = (openApiPathString: string): string => {
  return openApiPathString.replace(
    /{([^}]+)}/g,
    (_, name: string) => `:${name}`
  );
};
