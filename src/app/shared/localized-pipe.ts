import { inject, Pipe, PipeTransform } from '@angular/core';
import { components } from '../api/schema';
import { CurrentLanguage } from '../language/current-language';

type LocalizedText = components['schemas']['LocalizedText'];

@Pipe({
  name: 'localized',
  pure: false,
})
export class LocalizedPipe implements PipeTransform {
  private readonly language = inject(CurrentLanguage).localizedTextLanguage;

  transform(text: LocalizedText): string {
    return text[this.language()];
  }
}
