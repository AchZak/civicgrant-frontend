import { EntraConfig } from '../runtime-config';
import { Session } from './session';

export function startSession(entra: EntraConfig): Promise<Session | undefined> {
  return Promise.resolve(new FakeSession(entra.apiScope));
}

class FakeSession extends Session {
  readonly userName = 'An Peeters';

  constructor(private readonly apiScope: string) {
    super();
  }

  accessToken(): Promise<string> {
    return Promise.resolve(`fake-token-for-${this.apiScope}`);
  }

  signInAgain(): Promise<void> {
    return Promise.resolve();
  }

  signOut(): Promise<void> {
    return Promise.resolve();
  }
}
