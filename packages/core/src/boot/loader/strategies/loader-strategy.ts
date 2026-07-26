import type {
  LoaderInterface,
  LoaderCallback,
  LoaderStrategyInterface
} from "../types";

export default abstract class LoaderStrategy<T = unknown> implements LoaderStrategyInterface<T> {
  #loader: LoaderInterface | null = null;
  #key: string;
  #supportedTypes: string[];

  constructor(key: string, supportedTypes: string[] = []) {
    this.#key = key;
    this.#supportedTypes = supportedTypes;
  }

  public setLoader(loader: LoaderInterface) {
    this.#loader = loader;
  }

  public getBasePath(): string {
    return this.#loader!.resPath;
  }

  public abstract load(
    realUrl: string,
    url: string | null,
    resource: unknown,
    callback: LoaderCallback<T>
  ): void;

  protected get loader(): LoaderInterface {
    return this.#loader!;
  }

  public get supportedTypes(): string[] {
    return this.#supportedTypes;
  }

  public get strategyKey(): string {
    return this.#key;
  }
}
