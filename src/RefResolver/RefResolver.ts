import { DocumentLoader } from "./DocumentLoader.js";

export interface RefObject {
  $ref: string;
}

export class RefResolver {
  readonly #loader = new DocumentLoader();

  async resolve<T>(url: URL): Promise<T> {
    const location = new URL(url.pathname + url.search, url);
    const document = await this.#loader.load(location);

    const path = url.hash.slice(1);
    const obj = document.query(path);

    return obj as T;
  }

  /**
   * @deprecated
   * TODO: remove this
   */
  async resolveRefObject<T>(
    obj: NonNullable<T> | RefObject,
    from: URL
  ): Promise<T> {
    if (typeof obj == "object" && "$ref" in obj) {
      const url = new URL(obj.$ref, from);
      return this.resolve<T>(url);
    }

    return obj;
  }
}
