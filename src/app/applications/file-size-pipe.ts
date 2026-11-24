import { inject, LOCALE_ID, Pipe, PipeTransform } from '@angular/core';

const megabyte = 1024 * 1024;

@Pipe({
  name: 'fileSize',
})
export class FileSizePipe implements PipeTransform {
  private readonly locale = inject(LOCALE_ID);

  transform(bytes: number): string {
    const [value, unit] =
      bytes >= megabyte ? [bytes / megabyte, 'megabyte'] : [bytes / 1024, 'kilobyte'];
    return new Intl.NumberFormat(this.locale, {
      style: 'unit',
      unit,
      maximumFractionDigits: 1,
    }).format(value);
  }
}
