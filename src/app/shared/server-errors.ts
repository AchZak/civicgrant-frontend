import { ReadonlyFieldTree, ValidationError } from '@angular/forms/signals';
import { problemFrom } from '../api/http-problem';
import { codeKey, problemKey } from '../api/problem-messages';

type Fields = Readonly<Record<string, ReadonlyFieldTree<unknown>>>;

// Input issues go to their field, a business code to the field it belongs to, the rest to the form.
// Messages are translation keys: app-field-errors and app-form-errors translate them.
export function serverErrors(
  error: unknown,
  fields: Fields,
  fieldOfCode: Readonly<Record<string, string>> = {},
): ValidationError.WithOptionalFieldTree[] {
  const problem = problemFrom(error);
  const message = problemKey(problem);
  const issueErrors = problem.inputIssues.map((issue) => ({
    kind: 'server',
    message: codeKey(issue.code) ?? message,
    fieldTree: issue.field === undefined ? undefined : fields[issue.field],
  }));
  if (issueErrors.length > 0) {
    return issueErrors;
  }
  const field = problem.code === undefined ? undefined : fieldOfCode[problem.code];
  return [{ kind: 'server', message, fieldTree: field === undefined ? undefined : fields[field] }];
}

export function onceTouched(context: { readonly state: { touched(): boolean } }): boolean {
  return context.state.touched();
}
