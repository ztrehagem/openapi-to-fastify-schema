import fs from "fs/promises";
import { pathToFileURL } from "url";
import { generateOperationMap } from "./main.js";

const [argSrc] = process.argv.slice(2);

if (!argSrc) {
  console.log("Usage: openapi-to-fastify-schema ./path/to/openapi.yaml");
  console.error("No input file.");
  process.exit(1);
}

const srcUrl = new URL(argSrc, pathToFileURL("./"));

const operationMap = await generateOperationMap(srcUrl).catch((error) => {
  console.error("Generation Error");
  console.error(error);
  process.exit(1);
});
const operationMapJson = JSON.stringify(operationMap, null, 2);

const outJsCode = `export default ${operationMapJson};`;
const outDtsCode = `
type OperationMap = ${operationMapJson};
declare const operationMap: OperationMap;
export default operationMap;
`;

const outDir = new URL("../../.generated/", import.meta.url);

await fs.mkdir(outDir, { recursive: true });

const outJsUrl = new URL("operationMap.js", outDir);
const outDtsUrl = new URL("operationMap.d.ts", outDir);

await Promise.all([
  fs.writeFile(outJsUrl, outJsCode),
  fs.writeFile(outDtsUrl, outDtsCode),
]);
