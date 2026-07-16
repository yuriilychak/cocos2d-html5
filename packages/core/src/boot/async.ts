import AsyncPool from "./async-pool";
import type {
  AsyncPoolEndCallback,
  AsyncPoolIterator,
  AsyncPoolSource,
} from "./types";

export default class Async {
  /** Do tasks in series. */
  public static series<
    Task extends (...args: any[]) => void,
    Source extends AsyncPoolSource<Task> = AsyncPoolSource<Task>,
    Target = unknown,
    ErrorType = unknown,
    DataType = unknown
  >(
    tasks: Source,
    cb?: AsyncPoolEndCallback<Source, ErrorType, DataType, Target>,
    target?: Target
  ): AsyncPool<Task, ErrorType, Source, DataType, Target, Target> {
    const asyncPool = new AsyncPool<Task, ErrorType, Source, DataType, Target, Target>(
      tasks,
      1,
      (func, _index, callback) => {
        func.call(target, callback);
      },
      cb || null,
      target
    );
    asyncPool.flow();
    return asyncPool;
  }

  /** Do tasks in parallel. */
  public static parallel<
    Task extends (...args: any[]) => void,
    Source extends AsyncPoolSource<Task> = AsyncPoolSource<Task>,
    Target = unknown,
    ErrorType = unknown,
    DataType = unknown
  >(
    tasks: Source,
    cb?: AsyncPoolEndCallback<Source, ErrorType, DataType, Target>,
    target?: Target
  ): AsyncPool<Task, ErrorType, Source, DataType, Target, Target> {
    const asyncPool = new AsyncPool<Task, ErrorType, Source, DataType, Target, Target>(
      tasks,
      0,
      (func, _index, callback) => {
        func.call(target, callback);
      },
      cb || null,
      target
    );
    asyncPool.flow();
    return asyncPool;
  }

  /** Do tasks as a waterfall. */
  public static waterfall<
    Task extends (...args: any[]) => void,
    Source extends AsyncPoolSource<Task> = AsyncPoolSource<Task>,
    Target = unknown,
    ErrorType = unknown,
    DataType = unknown
  >(
    tasks: Source,
    cb?: (...args: any[]) => void,
    target?: Target
  ): AsyncPool<Task, ErrorType, Source, DataType, Target, Target> {
    let args: any[] = [];
    let lastResults: any[] = [null];
    const asyncPool = new AsyncPool<Task, ErrorType, Source, DataType, Target, Target>(
      tasks,
      1,
      (func, index, callback) => {
        const callbackWithArgs = callback as (...args: any[]) => void;
        args.push((error: ErrorType, ...rest: any[]) => {
          args = rest;
          if ((tasks as Task[]).length - 1 === index) {
            lastResults = lastResults.concat(args);
          }
          callbackWithArgs(error, ...rest);
        });
        func.apply(target, args);
      },
      (error) => {
        if (!cb) return;
        if (error) return cb.call(target, error);
        cb.apply(target, lastResults);
      }
    );
    asyncPool.flow();
    return asyncPool;
  }

  /** Do tasks by iterator. */
  public static map<
    ValueType = unknown,
    ErrorType = unknown,
    Source extends AsyncPoolSource<ValueType> = AsyncPoolSource<ValueType>,
    DataType = unknown,
    Target = unknown
  >(
    tasks: Source,
    iterator:
      | AsyncPoolIterator<ValueType, ErrorType, Source, DataType, Target, Target>
      | {
          iterator: AsyncPoolIterator<ValueType, ErrorType, Source, DataType, Target, Target>;
          cb?: AsyncPoolEndCallback<Source, ErrorType, DataType, Target>;
          iteratorTarget?: Target;
        },
    callback?: AsyncPoolEndCallback<Source, ErrorType, DataType, Target>,
    target?: Target
  ): AsyncPool<ValueType, ErrorType, Source, DataType, Target, Target> {
    let localIterator = iterator;
    if (typeof iterator === "object") {
      callback = iterator.cb;
      target = iterator.iteratorTarget;
      localIterator = iterator.iterator;
    }
    const asyncPool = new AsyncPool<ValueType, ErrorType, Source, DataType, Target, Target>(
      tasks,
      0,
      localIterator as AsyncPoolIterator<ValueType, ErrorType, Source, DataType, Target, Target>,
      callback || null,
      target
    );
    asyncPool.flow();
    return asyncPool;
  }

  /** Do tasks by iterator with a concurrency limit. */
  public static mapLimit<
    ValueType = unknown,
    ErrorType = unknown,
    Source extends AsyncPoolSource<ValueType> = AsyncPoolSource<ValueType>,
    DataType = unknown,
    Target = unknown
  >(
    tasks: Source,
    limit: number,
    iterator: AsyncPoolIterator<ValueType, ErrorType, Source, DataType, Target, Target>,
    cb?: AsyncPoolEndCallback<Source, ErrorType, DataType, Target>,
    target?: Target
  ): AsyncPool<ValueType, ErrorType, Source, DataType, Target, Target> {
    const asyncPool = new AsyncPool<ValueType, ErrorType, Source, DataType, Target, Target>(
      tasks,
      limit,
      iterator,
      cb || null,
      target
    );
    asyncPool.flow();
    return asyncPool;
  }
}
