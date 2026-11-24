import { formatEnterpriseNumber, parseEnterpriseNumber } from './enterprise-number';

describe('parseEnterpriseNumber', () => {
  it.each([
    ['0123.456.749'],
    ['0123456749'],
    ['BE0123456749'],
    ['be 0123.456.749'],
    ['  BE 0123 456 749  '],
  ])('reads %j as ten digits', (input) => {
    // when
    const digits = parseEnterpriseNumber(input);

    // then
    expect(digits).toBe('0123456749');
  });

  it.each([['123.456.749'], ['2123.456.749'], ['0123.456.74A'], ['BE'], ['']])(
    'refuses %j',
    (input) => {
      // when
      const digits = parseEnterpriseNumber(input);

      // then
      expect(digits).toBeUndefined();
    },
  );
});

describe('formatEnterpriseNumber', () => {
  it('groups ten digits as four, three and three', () => {
    // when
    const formatted = formatEnterpriseNumber('0123456749');

    // then
    expect(formatted).toBe('0123.456.749');
  });
});
