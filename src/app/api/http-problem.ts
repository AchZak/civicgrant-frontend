import { HttpErrorResponse } from '@angular/common/http';
import { Problem, readProblem } from './problem';

export function problemFrom(error: unknown): Problem {
  return error instanceof HttpErrorResponse
    ? readProblem(error.status, error.error)
    : readProblem(0, undefined);
}
