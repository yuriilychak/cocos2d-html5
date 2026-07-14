import { LoaderStrategyKey } from "../../enums";

export default class LoaderStrategy {
  #loader;

  constructor(loader) {
    this.#loader = loader;
  }

  get loader() {
    return this.#loader;
  }

  get supportedTypes() {
    return [];
  }

  get strategyKey() {
    return LoaderStrategyKey.TEXT;
  }

  getBasePath() {
    return this.#loader.resPath;
  }
}
