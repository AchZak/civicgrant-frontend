import { TranslocoService } from '@jsverse/transloco';
import { Confirmation } from 'primeng/api';

interface ConfirmTexts {
  readonly heading: string;
  readonly message: string;
  readonly accept: string;
  readonly reject: string;
}

// A ConfirmDialog's texts from a `confirm { heading, message, accept, reject }` key.
export function confirmTexts(
  transloco: TranslocoService,
  key: string,
): Pick<Confirmation, 'header' | 'message' | 'acceptLabel' | 'rejectLabel'> {
  const texts = transloco.translateObject<ConfirmTexts>(key);
  return {
    header: texts.heading,
    message: texts.message,
    acceptLabel: texts.accept,
    rejectLabel: texts.reject,
  };
}
