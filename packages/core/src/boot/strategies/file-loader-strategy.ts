import LoaderStrategy from "./loader-strategy";
import LoadError from "../load-error";

import type { LoaderInterface, LoaderCallback } from "../types";

export default abstract class FileLoaderStrategy<T> extends LoaderStrategy<T> {
  constructor(
    loader: LoaderInterface,
    key: string,
    supportedTypes: string[] = []
  ) {
    super(loader, key, supportedTypes);
  }

  protected abstract resultMiddleware(request: XMLHttpRequest): T;

  protected abstract prepareRequest(request: XMLHttpRequest): void;

  public load(
    realUrl: string,
    url: string,
    res: unknown,
    callback: LoaderCallback<T>
  ): void {
    const request = this.loader.XMLHttpRequest;

    request.timeout = 10000;
    const errorMessage = `load ${realUrl} failed!`;
    this.prepareRequest(request);

    request.open("GET", realUrl, true);

    const listeners = {
      load: () => {
        FileLoaderStrategy.#updateListeners(request, listeners);

        if (request.readyState === 4) {
          if (request.status !== 200 && request.status !== 0) {
            callback(new LoadError(errorMessage, request.status));
            return;
          }

          try {
            const data = this.resultMiddleware(request);
            callback(null, data);
          } catch(e) {
            callback(new LoadError(`parse [${realUrl}] failed : ${e}`, 0));
          }
        }
      },
      error: () => {
        FileLoaderStrategy.#updateListeners(request, listeners);

        callback(new LoadError(errorMessage, request.status));
      },
      timeout: () => {
        FileLoaderStrategy.#updateListeners(request, listeners);

        callback(
          new LoadError(`Request timeout: ${errorMessage}`, request.status)
        );
      }
    };

    FileLoaderStrategy.#updateListeners(request, listeners, true);

    request.send(null);
  }

  static #updateListeners(
    request: XMLHttpRequest,
    listeners: Record<string, () => void>,
    isAdd: boolean = false
  ) {
    const entries = Object.entries(listeners);

    if (isAdd) {
      for (const entry of entries) {
        request.addEventListener(...entry);
      }
    } else {
      for (const entry of entries) {
        request.removeEventListener(...entry);
      }
    }
  }
}
