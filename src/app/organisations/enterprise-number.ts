const tenDigits = /^[01]\d{9}$/;

// Same normalisation as the backend's EnterpriseNumber.parse; the mod-97 check stays there.
export function parseEnterpriseNumber(input: string): string | undefined {
  const digits = input.trim().toUpperCase().replace(/^BE/, '').replace(/[\s.]/g, '');
  return tenDigits.test(digits) ? digits : undefined;
}

export function formatEnterpriseNumber(digits: string): string {
  return `${digits.slice(0, 4)}.${digits.slice(4, 7)}.${digits.slice(7)}`;
}
