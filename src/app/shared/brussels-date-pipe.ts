import { inject, Pipe, PipeTransform } from '@angular/core';
import { CurrentLanguage } from '../language/current-language';

export type BrusselsDateFormat = 'date' | 'dateTime';

const options: Readonly<Record<BrusselsDateFormat, Intl.DateTimeFormatOptions>> = {
  date: { timeZone: 'Europe/Brussels', dateStyle: 'long' },
  dateTime: { timeZone: 'Europe/Brussels', dateStyle: 'long', timeStyle: 'short' },
};

const formats = new Map<string, Intl.DateTimeFormat>();

function brusselsFormat(locale: string, format: BrusselsDateFormat): Intl.DateTimeFormat {
  const key = `${locale} ${format}`;
  let dateFormat = formats.get(key);
  if (dateFormat === undefined) {
    dateFormat = new Intl.DateTimeFormat(locale, options[format]);
    formats.set(key, dateFormat);
  }
  return dateFormat;
}

// DatePipe only takes fixed offsets; Intl knows Brussels' summer time.
@Pipe({
  name: 'brusselsDate',
  pure: false,
})
export class BrusselsDatePipe implements PipeTransform {
  private readonly locale = inject(CurrentLanguage).locale;

  transform(value: string, format: BrusselsDateFormat = 'dateTime'): string {
    return brusselsFormat(this.locale(), format).format(new Date(value));
  }
}
