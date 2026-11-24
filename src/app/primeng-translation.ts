import { Translation } from 'primeng/api';

// PrimeNG merges this shallowly: `aria` replaces its default object, so it lists every label.
export const primeNgTranslation: Translation = {
  fileSizeTypes: $localize`:@@primeng.fileSizeTypes:B,KB,MB,GB,TB,PB,EB,ZB,YB`.split(','),
  choose: $localize`:@@primeng.choose:Choose`,
  upload: $localize`:@@primeng.upload:Upload`,
  cancel: $localize`:@@primeng.cancel:Cancel`,
  emptyMessage: $localize`:@@primeng.emptyMessage:No options available`,
  emptySearchMessage: $localize`:@@primeng.emptySearchMessage:No results found`,
  aria: {
    close: $localize`:@@primeng.aria.close:Close`,
    browseFiles: $localize`:@@primeng.aria.browseFiles:Browse files`,
    removeLabel: $localize`:@@primeng.aria.removeLabel:Remove`,
    pageLabel: $localize`:@@primeng.aria.pageLabel:Page {page}`,
    firstPageLabel: $localize`:@@primeng.aria.firstPageLabel:First page`,
    lastPageLabel: $localize`:@@primeng.aria.lastPageLabel:Last page`,
    nextPageLabel: $localize`:@@primeng.aria.nextPageLabel:Next page`,
    prevPageLabel: $localize`:@@primeng.aria.prevPageLabel:Previous page`,
    previousPageLabel: $localize`:@@primeng.aria.previousPageLabel:Previous page`,
    rowsPerPageLabel: $localize`:@@primeng.aria.rowsPerPageLabel:Rows per page`,
    jumpToPageDropdownLabel: $localize`:@@primeng.aria.jumpToPageDropdownLabel:Jump to page`,
    jumpToPageInputLabel: $localize`:@@primeng.aria.jumpToPageInputLabel:Jump to page`,
  },
};
