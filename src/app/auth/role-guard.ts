import { inject } from '@angular/core';
import { CanActivateFn, RedirectCommand, Router } from '@angular/router';
import { CurrentUser, Role } from './current-user';

// A hint only: the API checks the role again on every call. The address bar keeps the refused URL.
export function requireAnyRole(...roles: Role[]): CanActivateFn {
  return () =>
    inject(CurrentUser).holdsAnyOf(roles) ||
    new RedirectCommand(inject(Router).parseUrl('/no-access'), { skipLocationChange: true });
}
