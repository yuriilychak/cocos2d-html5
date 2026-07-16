import type AsyncPool from "./async-pool";

export type AsyncPoolSource<T> = T[] | Record<string, T>;

export type AsyncPoolIndex<Source> = Source extends unknown[] ? number : string;
export type AsyncPoolResults<Source, DataType> = Source extends unknown[] ? DataType[] : Record<string, DataType>;
export type AsyncPoolErrors<Source, ErrorType> = Source extends unknown[] ? ErrorType[] : Record<string, ErrorType>;

export type AsyncPoolIterator<
  ValueType = unknown,
  ErrorType = unknown,
  Source extends AsyncPoolSource<ValueType> = AsyncPoolSource<ValueType>,
  DataType = unknown,
  IteratorTarget = unknown,
  CallbackTarget = unknown
> = (
  this: IteratorTarget,
  value: ValueType,
  index: AsyncPoolIndex<Source>,
  callback: (error: ErrorType | unknown, result?: DataType) => void,
  pool: AsyncPool<ValueType, ErrorType, Source, DataType, IteratorTarget, CallbackTarget>
) => void;

export type AsyncPoolEndCallback<
  Source extends AsyncPoolSource<unknown> = AsyncPoolSource<unknown>,
  ErrorType = unknown,
  DataType = unknown,
  CallbackTarget = unknown
> =
  (this: CallbackTarget, errors: AsyncPoolErrors<Source, ErrorType> | null, results?: AsyncPoolResults<Source, DataType>) => void;

export type AsyncPoolItem<ValueType = unknown, Source extends AsyncPoolSource<ValueType> = AsyncPoolSource<ValueType>> = {
  index: AsyncPoolIndex<Source>;
  value: ValueType;
};
