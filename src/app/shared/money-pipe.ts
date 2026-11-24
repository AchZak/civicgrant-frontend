import { inject, Pipe, PipeTransform } from '@angular/core';
import { CurrentLanguage } from '../language/current-language';

const formats = new Map<string, Intl.NumberFormat>();

function euros(locale: string): Intl.NumberFormat {
  let format = formats.get(locale);
  if (format === undefined) {
    format = new Intl.NumberFormat(locale, { style: 'currency', currency: 'EUR' });
    formats.set(locale, format);
  }
  return format;
}

// Impure so it follows a language switch; the formats are cached, so it stays cheap.
@Pipe({
  name: 'money',
  pure: false,
})
export class MoneyPipe implements PipeTransform {
  private readonly locale = inject(CurrentLanguage).locale;

  transform(amount: number): string {
    return euros(this.locale()).format(amount);
  }
}
