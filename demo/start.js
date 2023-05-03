import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { generateOperationMap } from "../dist/main.js";

const entryFileUrl = pathToFileURL(path.resolve("./demo/api.yaml"));

const operationMap = await generateOperationMap(entryFileUrl);

await fs.writeFile("./demo/out.json", JSON.stringify(operationMap, null, 2));
