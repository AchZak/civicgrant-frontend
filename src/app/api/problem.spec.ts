import { readProblem } from './problem';

describe('readProblem', () => {
  it('reads the code of a business problem', () => {
    // given
    const body = {
      type: 'urn:problem-type:civicgrant:submissionAfterClosingDate',
      status: 400,
      detail: 'The funding call closed on 2026-10-31',
    };

    // when
    const problem = readProblem(400, body);

    // then
    expect(problem).toEqual({ status: 400, code: 'submissionAfterClosingDate', inputIssues: [] });
  });

  it('reads the code of a standard Belgif problem', () => {
    // given
    const body = { type: 'urn:problem-type:belgif:resourceNotFound', status: 404 };

    // when
    const problem = readProblem(404, body);

    // then
    expect(problem.code).toBe('resourceNotFound');
  });

  it('turns each body issue into a field and an issue code', () => {
    // given
    const body = {
      type: 'urn:problem-type:belgif:badRequest',
      status: 400,
      issues: [
        {
          type: 'urn:problem-type:belgif:input-validation:schemaViolation',
          in: 'body',
          name: '/proposal/requestedAmount',
          value: 'abc',
        },
        {
          type: 'urn:problem-type:belgif:input-validation:referencedResourceNotFound',
          in: 'body',
          name: '/fundingCallId',
        },
      ],
    };

    // when
    const problem = readProblem(400, body);

    // then
    expect(problem.inputIssues).toEqual([
      { field: 'proposal.requestedAmount', code: 'schemaViolation' },
      { field: 'fundingCallId', code: 'referencedResourceNotFound' },
    ]);
  });

  it('gives no field for an issue outside the body', () => {
    // given
    const body = {
      type: 'urn:problem-type:belgif:badRequest',
      issues: [
        {
          type: 'urn:problem-type:belgif:input-validation:schemaViolation',
          in: 'query',
          name: 'pageSize',
        },
      ],
    };

    // when
    const problem = readProblem(400, body);

    // then
    expect(problem.inputIssues).toEqual([{ field: undefined, code: 'schemaViolation' }]);
  });

  it('gives no code for a type outside the problem-type namespace', () => {
    // when
    const problem = readProblem(500, { type: 'about:blank', status: 500 });

    // then
    expect(problem.code).toBeUndefined();
  });

  it('gives no code for a body that is not a problem', () => {
    // when
    const problem = readProblem(502, '<html><body>Bad Gateway</body></html>');

    // then
    expect(problem).toEqual({ status: 502, inputIssues: [] });
  });
});
