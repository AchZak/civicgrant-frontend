import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { from, switchMap, tap } from 'rxjs';
import { Session } from './session';

export const accessTokenInterceptor: HttpInterceptorFn = (request, next) => {
  if (!request.url.startsWith('/api/')) {
    return next(request);
  }
  const session = inject(Session);
  return from(session.accessToken()).pipe(
    switchMap((token) => next(request.clone({ setHeaders: { Authorization: `Bearer ${token}` } }))),
    tap({
      error: (error: unknown) => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          void session.signInAgain();
        }
      },
    }),
  );
};
