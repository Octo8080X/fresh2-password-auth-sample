type SimpleResultFailure = {
  ok: false;
  error: string;
};

type SimpleResultSuccess<T> = T extends null 
  ? { ok: true }
  : { ok: true } & { [K in keyof T]: T[K] };

export type SimpleResult<T> = SimpleResultSuccess<T>|SimpleResultFailure;
