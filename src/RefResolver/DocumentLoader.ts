import * as fs from "fs/promises";
import { Document } from "./Document.js";
import YAML from "yaml";
export class DocumentLoader {
  #cache = new Map<string, Promise<Document>>();

  async load(url: URL): Promise<Document> {
    url = new URL(url.pathname + url.search, url);
    const key = url.toString();

    const cached = this.#cache.get(key);
    if (cached) return await cached;

    const fetching = this.#fetch(url);
    this.#cache.set(key, fetching);
    return await fetching;
  }

  async #fetch(url: URL): Promise<Document> {
    if (url.protocol == "file:") {
      return await this.#fetchFile(url);
    } else {
      console.log(url);
      return await this.#fetchRemote(url);
    }
  }

  async #fetchFile(url: URL): Promise<Document> {
    const buf = await fs.readFile(url.pathname);
    const raw = buf.toString();

    let parsed: unknown;

    if (/\.ya?ml$/i.test(url.pathname)) {
      parsed = YAML.parse(raw);
    } else {
      parsed = JSON.parse(raw);
    }

    return new Document(url, parsed);
  }

  #fetchRemote(url: URL): Promise<Document> {
    throw new Error("Not implemented resolving over network.");
  }
}
