import type {
  AsyncPoolEndCallback,
  AsyncPoolErrors,
  AsyncPoolIndex,
  AsyncPoolItem,
  AsyncPoolIterator,
  AsyncPoolResults,
  AsyncPoolSource,
} from "./types";

/**
 * Async Pool class, a helper of async.
 */
export default class AsyncPool<
  ValueType = unknown,
  ErrorType = unknown,
  Source extends AsyncPoolSource<ValueType> = AsyncPoolSource<ValueType>,
  DataType = unknown,
  IteratorTarget = unknown,
  CallbackTarget = unknown
> {
  #finished: boolean = false;
  #source: Source | null = null;
  #limit: number;
  #pool: AsyncPoolItem<ValueType, Source>[] = [];
  #iterator: AsyncPoolIterator<ValueType, ErrorType, Source, DataType, IteratorTarget, CallbackTarget>;
  #iteratorTarget: IteratorTarget | null = null;
  #onEnd: AsyncPoolEndCallback<Source, ErrorType, DataType, CallbackTarget> | null;
  #onEndTarget: CallbackTarget | null = null;
  #results: AsyncPoolResults<Source, DataType>;
  #errors: AsyncPoolErrors<Source, ErrorType>;
  #workingSize: number = 0;
  #size: number;
  #finishedSize: number = 0;

  constructor(
    source: Source | null,
    limit: number,
    iterator: AsyncPoolIterator<ValueType, ErrorType, Source, DataType, IteratorTarget, CallbackTarget>,
    onEnd: AsyncPoolEndCallback<Source, ErrorType, DataType, CallbackTarget> | null = null,
    iteratorTarget: IteratorTarget | null = null,
    callbackTarget: CallbackTarget | null = null
  ) {
    const isArray = source instanceof Array;

    this.#source = source;
    this.#limit = limit;
    this.#iterator = iterator;
    this.#iteratorTarget = iteratorTarget;
    this.#onEnd = onEnd ?? null;
    this.#onEndTarget = callbackTarget === null
      ? iteratorTarget as unknown as CallbackTarget
      : callbackTarget;
    this.#results = (isArray ? [] : {}) as AsyncPoolResults<Source, DataType>;
    this.#errors = (isArray ? [] : {}) as AsyncPoolErrors<Source, ErrorType>;

    if (source) {
      if (isArray) {
        for (let i = 0; i < source.length; ++i) {
          this.#addToPoll(i as AsyncPoolIndex<Source>, source[i]);
        }
      } else {
        for (const key in source) {
          this.#addToPoll(key as AsyncPoolIndex<Source>, (source as Record<string, ValueType>)[key]);
        }
      }
    }

    this.#size = this.#pool.length;
    this.#limit = this.#limit || this.#size;
  }

  public onIterator(iterator: AsyncPoolIterator<ValueType, ErrorType, Source, DataType, IteratorTarget, CallbackTarget>, target?: IteratorTarget): void {
    this.#iterator = iterator;
    this.#iteratorTarget = target ?? null;
  }

  public onEnd(errors: AsyncPoolErrors<Source, ErrorType> | null, results: AsyncPoolResults<Source, DataType>): void {
    this.#finished = true;

    if (this.#onEnd) {
      const selector = this.#onEnd;
      const target = this.#onEndTarget;
      this.#onEnd = null;
      this.#onEndTarget = null;
      selector.call(target as CallbackTarget, errors, results);
    }
  }

  public flow(): void {
    if (this.#pool.length === 0) {
      if (this.#onEnd) {
        this.#onEnd.call(this.#onEndTarget as CallbackTarget, null, this.#results);
      }
      return;
    }

    for (let i = 0; i < this.#limit; i++) {
      this.#handleItem();
    }
  }

  #addToPoll(index: AsyncPoolIndex<Source>, value: ValueType): void {
    this.#pool.push({ index, value });
  }

  #handleItem(): void {
    if (this.#pool.length === 0 || this.#workingSize >= this.#limit) {
      return;
    }

    const item = this.#pool.shift()!;
    const { value, index } = item;
    this.#workingSize++;
    this.#iterator.call(
      this.#iteratorTarget as IteratorTarget,
      value,
      index,
      (error: ErrorType | unknown, result?: DataType) => {
        if (this.#finished) {
          return;
        }

        if (error) {
          (this.#errors as Record<number | string, ErrorType>)[index] = error as ErrorType;
        } else {
          (this.#results as Record<number | string, DataType>)[index] = result!;
        }

        this.#finishedSize++;
        this.#workingSize--;

        if (this.#finishedSize === this.#size) {
          const errors = this.#hasErrors ? this.#errors : null;
          this.onEnd(errors, this.#results);
          return;
        }

        this.#handleItem();
      },
      this
    );
  }

  get #hasErrors() {
    return (this.#errors instanceof Array && !!this.#errors.length) || (this.#errors instanceof Object && !!Object.keys(this.#errors).length);
  }

  public get source(): Source | null {
    return this.#source;
  }

  public get size(): number {
    return this.#size;
  }

  public get finishedSize(): number {
    return this.#finishedSize;
  }
}
