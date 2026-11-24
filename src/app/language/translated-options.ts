import { computed, Signal } from '@angular/core';
import { translateSignal } from '@jsverse/transloco';

export interface Option<T> {
  readonly label: string;
  readonly value: T;
}

// Options for a PrimeNG Select whose labels follow a language switch. Needs an injection context.
export function translatedOptions<T>(
  values: readonly T[],
  keyOf: (value: T) => string,
): Signal<Option<T>[]> {
  const labels = translateSignal(values.map(keyOf));
  return computed(() => values.map((value, index) => ({ label: labels()[index] ?? '', value })));
}
