import type {
  LoaderInterface,
  LoaderCallback,
  LoaderStrategyInterface
} from "../types";

export default abstract class LoaderStrategy<T = unknown> implements LoaderStrategyInterface<T> {
  #loader: LoaderInterface;
  #key: string;
  #supportedTypes: string[];

  constructor(loader: LoaderInterface, key: string, supportedTypes: string[] = []) {
    this.#loader = loader;
    this.#key = key;
    this.#supportedTypes = supportedTypes;
  }

  public getBasePath(): string {
    return this.#loader.resPath;
  }

  public abstract load(
    realUrl: string,
    url: string | null,
    resource: unknown,
    callback: LoaderCallback<T>
  ): void;

  protected get loader(): LoaderInterface {
    return this.#loader;
  }

  public get supportedTypes(): string[] {
    return this.#supportedTypes;
  }

  public get strategyKey(): string {
    return this.#key;
  }
}
