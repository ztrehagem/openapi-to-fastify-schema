import fs from "node:fs/promises";
import YAML from "yaml";
import type { OpenAPIV3_1, OpenAPI } from "openapi-types";
import { createOperationMap } from "./OpenAPIV3_1/createOperationMap.js";
import { retrieveFlattenOperations } from "./OpenAPIV3_1/retrieveFlattenOperations.js";
import { RefResolver } from "./RefResolver/RefResolver.js";
import type { Operation } from "./OpenAPIV3_1/Operation.js";

type OperationId = string;

export const generateOperationMap = async (
  entryFileUrl: URL
): Promise<Record<OperationId, Operation>> => {
  const docBuf = await fs.readFile(entryFileUrl);
  const docStr = docBuf.toString();

  let doc;

  if (/\.ya?ml$/i.test(entryFileUrl.pathname)) {
    doc = YAML.parse(docStr) as OpenAPI.Document;
  } else {
    doc = JSON.parse(docStr) as OpenAPI.Document;
  }

  if (!isOA_v3_1(doc)) {
    throw new Error("Supported OpenAPI version is only 3.1.0.");
  }

  const flattenOperations = retrieveFlattenOperations(doc.paths ?? {});

  const refResolver = new RefResolver();

  const operationMap = await createOperationMap(
    flattenOperations,
    refResolver,
    entryFileUrl
  );

  return operationMap;
};

const isOA_v3_1 = (doc: OpenAPI.Document): doc is OpenAPIV3_1.Document => {
  return "openapi" in doc && doc.openapi == "3.1.0";
};
