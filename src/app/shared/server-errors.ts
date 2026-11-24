import { ReadonlyFieldTree, ValidationError } from '@angular/forms/signals';
import { problemFrom } from '../api/http-problem';
import { codeMessage, problemMessage } from '../api/problem-messages';

type Fields = Readonly<Record<string, ReadonlyFieldTree<unknown>>>;

// Input issues go to their field, a business code to the field it belongs to, the rest to the form.
export function serverErrors(
  error: unknown,
  fields: Fields,
  fieldOfCode: Readonly<Record<string, string>> = {},
): ValidationError.WithOptionalFieldTree[] {
  const problem = problemFrom(error);
  const message = problemMessage(problem);
  const issueErrors = problem.inputIssues.map((issue) => ({
    kind: 'server',
    message: codeMessage(issue.code) ?? message,
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
