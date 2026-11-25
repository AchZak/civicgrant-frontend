const brusselsOffset = new Intl.DateTimeFormat('en', {
  timeZone: 'Europe/Brussels',
  timeZoneName: 'longOffset',
});

// A date picker's Date is midnight in the browser's time zone: only its calendar day counts.
export function startOfBrusselsDay(day: Date): string {
  return brusselsMidnight(day.getFullYear(), day.getMonth(), day.getDate()).toISOString();
}

export function endOfBrusselsDay(day: Date): string {
  return brusselsMidnight(day.getFullYear(), day.getMonth(), day.getDate() + 1).toISOString();
}

function brusselsMidnight(year: number, monthIndex: number, day: number): Date {
  const utcMidnight = Date.UTC(year, monthIndex, day);
  // The offset at UTC midnight can differ from the one at Brussels midnight, so look again.
  const firstGuess = utcMidnight - offsetInMinutes(utcMidnight) * 60_000;
  return new Date(utcMidnight - offsetInMinutes(firstGuess) * 60_000);
}

function offsetInMinutes(instant: number): number {
  const name = brusselsOffset.formatToParts(instant).find((part) => part.type === 'timeZoneName');
  const match = /GMT([+-])(\d{2}):(\d{2})/.exec(name?.value ?? '');
  if (match === null) {
    return 0;
  }
  const [, sign, hours, minutes] = match;
  const offset = Number(hours) * 60 + Number(minutes);
  return sign === '-' ? -offset : offset;
}
