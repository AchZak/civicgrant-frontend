export interface Problem {
  readonly status: number;
  readonly code?: string;
  readonly inputIssues: readonly InputIssue[];
}

export interface InputIssue {
  readonly field?: string;
  readonly code?: string;
}

const problemTypePrefix = 'urn:problem-type:';

export function readProblem(status: number, body: unknown): Problem {
  if (!isObject(body)) {
    return { status, inputIssues: [] };
  }
  const issues = Array.isArray(body['issues']) ? body['issues'] : [];
  return {
    status,
    code: codeOf(body['type']),
    inputIssues: issues.filter(isObject).map(readInputIssue),
  };
}

function readInputIssue(issue: Record<string, unknown>): InputIssue {
  return {
    field: issue['in'] === 'body' ? fieldOf(issue['name']) : undefined,
    code: codeOf(issue['type']),
  };
}

function codeOf(type: unknown): string | undefined {
  if (typeof type !== 'string' || !type.startsWith(problemTypePrefix)) {
    return undefined;
  }
  return type.slice(type.lastIndexOf(':') + 1);
}

// Body issues name a JSON pointer: /proposal/requestedAmount becomes proposal.requestedAmount.
function fieldOf(name: unknown): string | undefined {
  if (typeof name !== 'string') {
    return undefined;
  }
  return name.replace(/^\//, '').replaceAll('/', '.');
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
