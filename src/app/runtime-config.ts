export interface RuntimeConfig {
  readonly primeUiLicenseKey: string;
  readonly apiBaseUrl: string;
  readonly entra: EntraConfig;
}

export interface EntraConfig {
  readonly tenantId: string;
  readonly clientId: string;
  readonly apiScope: string;
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
    isObject(value) &&
    typeof value['primeUiLicenseKey'] === 'string' &&
    typeof value['apiBaseUrl'] === 'string' &&
    isEntraConfig(value['entra'])
  );
}

function isEntraConfig(value: unknown): value is EntraConfig {
  return (
    isObject(value) &&
    isFilled(value['tenantId']) &&
    isFilled(value['clientId']) &&
    isFilled(value['apiScope'])
  );
}

function isFilled(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0;
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}
