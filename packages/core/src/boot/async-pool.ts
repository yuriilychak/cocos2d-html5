type AsyncPoolSource<T> = T[] | Record<string, T>;

type AsyncPoolIterator<ValueType, ErrorType, DataType> = (
  value: any,
  index: number | string,
  callback: (error: ErrorType | unknown, result?: DataType) => void,
  pool: AsyncPool<ValueType, ErrorType, DataType>
) => void;

type AsyncPoolEndCallback = (...args: any[]) => void;

type PoolItem<T> = { index: number | string; value: T };

/**
 * Async Pool class, a helper of async.
 */
export default class AsyncPool<ValueType, ErrorType, DataType = unknown> {
  #finished: boolean = false;
  #source: AsyncPoolSource<ValueType> | null = null;
  #limit: number;
  #pool: PoolItem<ValueType>[] = [];
  #iterator: AsyncPoolIterator<ValueType, ErrorType, DataType>;
  #iteratorTarget: unknown;
  #onEnd: AsyncPoolEndCallback | null;
  #onEndTarget: unknown;
  #results: DataType[] | Record<string, DataType>;
  #errors: ErrorType[] | Record<string, ErrorType>;
  #workingSize: number = 0;
  #size: number;
  #finishedSize: number = 0;

  constructor(
    source: AsyncPoolSource<ValueType> | null,
    limit: number,
    iterator: AsyncPoolIterator<ValueType, ErrorType, DataType>,
    onEnd: AsyncPoolEndCallback | null = null,
    target: unknown = null
  ) {
    const isArray = source instanceof Array;

    this.#source = source;
    this.#limit = limit;
    this.#iterator = iterator;
    this.#iteratorTarget = target;
    this.#onEnd = onEnd ?? null;
    this.#onEndTarget = target;
    this.#results = isArray ? [] : {};
    this.#errors = isArray ? [] : {};

    if (source) {
      if (isArray) {
        for (let i = 0; i < source.length; ++i) {
          this.#addToPoll(source[i], i);
        }
      } else {
        for (const key in source) {
          this.#addToPoll(source[key], key);
        }
      }
    }

    this.#size = this.#pool.length;
    this.#limit = this.#limit || this.#size;
  }

  public onIterator(iterator: AsyncPoolIterator<ValueType, ErrorType, DataType>, target?: unknown): void {
    this.#iterator = iterator;
    this.#iteratorTarget = target;
  }

  public onEnd(errors: unknown, results: unknown): void {
    this.#finished = true;

    if (this.#onEnd) {
      const selector = this.#onEnd;
      const target = this.#onEndTarget;
      this.#onEnd = null;
      this.#onEndTarget = null;
      selector.call(target, errors, results);
    }
  }

  public flow(): void {
    if (this.#pool.length === 0) {
      if (this.#onEnd) {
        this.#onEnd.call(this.#onEndTarget, null, []);
      }
      return;
    }

    for (let i = 0; i < this.#limit; i++) {
      this.#handleItem();
    }
  }

  #addToPoll(value: ValueType, index: number | string): void {
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
      this.#iteratorTarget,
      value,
      index,
      (error: ErrorType | unknown, result?: DataType) => {
        if (this.#finished) {
          return;
        }

        if (error) {
          this.#setError(index, error as ErrorType);
        } else {
          this.#setResult(index, result!);
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

  #setError(index: number | string, error: ErrorType): void {
    if(this.#errors instanceof Array) {
      this.#errors[index as number] = error;
    } else {
      this.#errors[index as string] = error;
    }
  }

  #setResult(index: number | string, error: DataType): void {
    if(this.#results instanceof Array) {
      this.#results[index as number] = error;
    } else {
      this.#results[index as string] = error;
    }
  }

  get #hasErrors() {
    return (this.#errors instanceof Array && !!this.#errors.length) || (this.#errors instanceof Object && !!Object.keys(this.#errors).length);
  }

  public get source(): AsyncPoolSource<ValueType> | null {
    return this.#source;
  }

  public get size(): number {
    return this.#size;
  }

  public get finishedSize(): number {
    return this.#finishedSize;
  }
}
