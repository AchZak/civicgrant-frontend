import en from './en.json';
import fr from './fr.json';
import nl from './nl.json';

function keysOf(translations: object, prefix = ''): string[] {
  return Object.entries(translations).flatMap(([key, value]) =>
    typeof value === 'object' && value !== null
      ? keysOf(value, `${prefix}${key}.`)
      : [`${prefix}${key}`],
  );
}

describe('translations', () => {
  it.each([
    ['nl', nl],
    ['fr', fr],
  ])('%s has the same keys as en, in the same order', (_, translations) => {
    // when
    const keys = keysOf(translations);

    // then
    expect(keys).toEqual(keysOf(en));
  });
});
