export interface RuntimeConfig {
  readonly primeUiLicenseKey: string;
}

export async function loadRuntimeConfig(): Promise<RuntimeConfig> {
  const response = await fetch('/config.json', { cache: 'no-cache' });
  if (!response.ok) {
    throw new Error(`/config.json answered ${response.status}`);
  }
  const config: unknown = await response.json();
  if (!isRuntimeConfig(config)) {
    throw new Error('/config.json lacks a value or has one of the wrong type');
  }
  return config;
}

function isRuntimeConfig(value: unknown): value is RuntimeConfig {
  return (
    typeof value === 'object' &&
    value !== null &&
    'primeUiLicenseKey' in value &&
    typeof value.primeUiLicenseKey === 'string'
  );
}
