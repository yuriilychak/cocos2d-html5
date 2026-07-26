import type AsyncPool from "../async-pool";
import type LoadError from "./load-error";

export type LoaderError = LoadError | {
  status: number;
  errorMessage: string;
};

export type LoaderAsyncPoolCallback = (errors: LoadError[] | null, results?: unknown[]) => void;

export type LoadOptions = {
  cb?: LoaderAsyncPoolCallback;
  cbTarget?: unknown;
  trigger?: TriggerCallback;
  triggerTarget?: unknown;
}

export type TriggerCallback = (value: unknown, size: number, finishedSize: number) => void;

export interface LoaderCallback<T = unknown> {
  (target: unknown, data?: T): void;
  (error: LoaderError): void;
}

export type ImageLoaderCallback = LoaderCallback<HTMLImageElement>;

export type ImageQueueEntry = { image: HTMLImageElement; callbacks: ImageLoaderCallback[] };

export interface LoaderStrategyInterface<T = unknown> {
  readonly strategyKey: string;
  readonly supportedTypes: string[];
  readonly tileMapTypes?: string[];

  setLoader(loader: LoaderInterface): void;
  getBasePath(): string;
  load(
    realUrl: string,
    url: string,
    resource: unknown,
    callback: LoaderCallback<T>
  ): unknown;
}

export type LoaderFunction = (
  realUrl: string,
  url: string | null,
  resource: unknown,
  callback: LoaderCallback
) => unknown;

export type LoaderRegistration = LoaderStrategyInterface | LoaderFunction;

export interface LoaderInterface {
  resPath: string;
  audioPath: string;
  readonly XMLHttpRequest: XMLHttpRequest;

  get<T>(key: string): T | null;
  has(key: string): boolean;
  set(key: string, value: unknown): void;
  addStrategy(strategy: LoaderStrategyInterface): void;
  register(
    extension: string,
    strategy: LoaderRegistration
  ): void;
  register(
    extensions: string[],
    strategy: LoaderRegistration
  ): void;
  load(resources: string | string[]): AsyncPool<string, LoadError, string[]>;
  load(resources: string | string[], callback: ImageLoaderCallback): AsyncPool<string, LoadError, string[]>;
  load(resources: string | string[], options: LoadOptions): AsyncPool<string, LoadError, string[]>;
  load(resources: string | string[], callback: ImageLoaderCallback): AsyncPool<string, LoadError, string[]>;
  load(resources: string | string[], optioloadns: ImageLoaderCallback, loadCallback: ImageLoaderCallback): AsyncPool<string, LoadError, string[]>;
  load(resources: string | string[], trigger: TriggerCallback, loadCallback: ImageLoaderCallback): AsyncPool<string, LoadError, string[]>;
  load(resources: string | string[], loadCallback: ImageLoaderCallback, target: unknown): AsyncPool<string, LoadError, string[]>;
  loadTxt(url: string, callback: LoaderCallback<string>): unknown;
  loadJson(url: string, callback: LoaderCallback): unknown;
  loadImg(url: string): HTMLImageElement | null;
  loadImg(
    url: string,
    callback: ImageLoaderCallback
  ): HTMLImageElement | null;
  loadImg(
    url: string,
    options: object,
    callback: ImageLoaderCallback | null,
    image: HTMLImageElement
  ): HTMLImageElement | null;
  loadBinary(url: string, callback: LoaderCallback<Uint8Array>): unknown;
  loadBinarySync(url: string): Uint8Array | null;
  getUrl(basePath: string, url?: string): string;
  getAliase(url: string): string;
  release(url: string): void;
  releaseAll(): void;
}
