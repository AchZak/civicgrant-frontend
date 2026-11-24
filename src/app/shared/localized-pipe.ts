import { inject, LOCALE_ID, Pipe, PipeTransform } from '@angular/core';
import { components } from '../api/schema';

type LocalizedText = components['schemas']['LocalizedText'];

@Pipe({
  name: 'localized',
})
export class LocalizedPipe implements PipeTransform {
  private readonly language: keyof LocalizedText = inject(LOCALE_ID).startsWith('fr') ? 'fr' : 'nl';

  transform(text: LocalizedText): string {
    return text[this.language];
  }
}
