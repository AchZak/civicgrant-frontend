import { inject, Pipe, PipeTransform } from '@angular/core';
import { CurrentLanguage } from '../language/current-language';

const megabyte = 1024 * 1024;

@Pipe({
  name: 'fileSize',
  pure: false,
})
export class FileSizePipe implements PipeTransform {
  private readonly locale = inject(CurrentLanguage).locale;

  transform(bytes: number): string {
    const [value, unit] =
      bytes >= megabyte ? [bytes / megabyte, 'megabyte'] : [bytes / 1024, 'kilobyte'];
    return new Intl.NumberFormat(this.locale(), {
      style: 'unit',
      unit,
      maximumFractionDigits: 1,
    }).format(value);
  }
}
