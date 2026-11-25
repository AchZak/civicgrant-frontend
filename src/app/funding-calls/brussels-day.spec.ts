import { endOfBrusselsDay, startOfBrusselsDay } from './brussels-day';

describe('startOfBrusselsDay', () => {
  it.each([
    ['a winter day', new Date(2026, 11, 2), '2026-12-01T23:00:00.000Z'],
    ['a summer day', new Date(2026, 6, 15), '2026-07-14T22:00:00.000Z'],
    ['the day summer time starts', new Date(2026, 2, 29), '2026-03-28T23:00:00.000Z'],
    ['the day summer time ends', new Date(2026, 9, 25), '2026-10-24T22:00:00.000Z'],
  ])('gives midnight in Brussels on %s', (_, day, expected) => {
    // when
    const instant = startOfBrusselsDay(day);

    // then
    expect(instant).toBe(expected);
  });
});

describe('endOfBrusselsDay', () => {
  it.each([
    ['a winter day', new Date(2026, 11, 2), '2026-12-02T23:00:00.000Z'],
    ['a summer day', new Date(2026, 6, 15), '2026-07-15T22:00:00.000Z'],
    ['the day before summer time starts', new Date(2026, 2, 28), '2026-03-28T23:00:00.000Z'],
    ['the day summer time starts', new Date(2026, 2, 29), '2026-03-29T22:00:00.000Z'],
    ['the day summer time ends', new Date(2026, 9, 25), '2026-10-25T23:00:00.000Z'],
    ['the last day of the year', new Date(2026, 11, 31), '2026-12-31T23:00:00.000Z'],
  ])('gives the next midnight in Brussels on %s', (_, day, expected) => {
    // when
    const instant = endOfBrusselsDay(day);

    // then
    expect(instant).toBe(expected);
  });
});
