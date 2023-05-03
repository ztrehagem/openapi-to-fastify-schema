export class Document<T = unknown> {
  readonly #url: URL;
  readonly #obj: T;

  constructor(url: URL, obj: T) {
    this.#url = url;
    this.#obj = obj;
  }

  query<T>(pathString: string): T {
    const keys = pathString.split("/").filter((key) => key.length > 0);

    let target: unknown = this.#obj;

    for (const key of keys) {
      target = (target as Record<string, unknown>)[key];
    }

    return target as T;
  }
}
