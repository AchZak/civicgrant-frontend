import { HttpInterceptorFn } from '@angular/common/http';
import { inject, InjectionToken } from '@angular/core';

// Empty locally, where the dev server's proxy forwards /api; the API's own origin once deployed.
export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL');

export const apiBaseUrlInterceptor: HttpInterceptorFn = (request, next) => {
  const baseUrl = inject(API_BASE_URL);
  if (baseUrl === '' || !request.url.startsWith('/api/')) {
    return next(request);
  }
  return next(request.clone({ url: `${baseUrl}${request.url}` }));
};
