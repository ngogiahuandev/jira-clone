export type Primitive = string | number | boolean | null | undefined;
export type PrimitiveRecord = Record<string, Primitive>;

export function shallowDiff<T extends PrimitiveRecord>(a: T, b: T): Partial<T> {
  const out: Partial<T> = {};
  (Object.keys(b) as (keyof T)[]).forEach((k) => {
    if (a[k] !== b[k]) out[k] = b[k];
  });
  return out;
}

export function isDirtyByValue<T extends PrimitiveRecord>(a: T, b: T): boolean {
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
  for (const k of keys as unknown as (keyof T)[]) {
    if (a[k] !== b[k]) return true;
  }
  return false;
}
