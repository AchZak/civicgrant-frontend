import { inject, LOCALE_ID, Pipe, PipeTransform } from '@angular/core';

export type BrusselsDateFormat = 'date' | 'dateTime';

// DatePipe only takes fixed offsets; Intl knows Brussels' summer time.
@Pipe({
  name: 'brusselsDate',
})
export class BrusselsDatePipe implements PipeTransform {
  private readonly locale = inject(LOCALE_ID);
  private readonly formats: Record<BrusselsDateFormat, Intl.DateTimeFormat> = {
    date: new Intl.DateTimeFormat(this.locale, { timeZone: 'Europe/Brussels', dateStyle: 'long' }),
    dateTime: new Intl.DateTimeFormat(this.locale, {
      timeZone: 'Europe/Brussels',
      dateStyle: 'long',
      timeStyle: 'short',
    }),
  };

  transform(value: string, format: BrusselsDateFormat = 'dateTime'): string {
    return this.formats[format].format(new Date(value));
  }
}
