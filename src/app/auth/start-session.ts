import {
  AccountInfo,
  createStandardPublicClientApplication,
  InteractionRequiredAuthError,
  IPublicClientApplication,
} from '@azure/msal-browser';
import { EntraConfig } from '../runtime-config';
import { Session } from './session';

// Resolves without a session when it sent the browser to Entra ID to sign in.
export async function startSession(entra: EntraConfig): Promise<Session | undefined> {
  const msal = await createStandardPublicClientApplication({
    auth: {
      clientId: entra.clientId,
      authority: `https://login.microsoftonline.com/${entra.tenantId}`,
      redirectUri: document.baseURI,
      postLogoutRedirectUri: document.baseURI,
    },
  });
  const result = await msal.handleRedirectPromise();
  const account = result?.account ?? msal.getAllAccounts()[0];
  if (!account) {
    await msal.loginRedirect({ scopes: [entra.apiScope] });
    return undefined;
  }
  msal.setActiveAccount(account);
  return new EntraSession(msal, account, entra.apiScope);
}

class EntraSession extends Session {
  readonly userName: string;

  constructor(
    private readonly msal: IPublicClientApplication,
    private readonly account: AccountInfo,
    private readonly apiScope: string,
  ) {
    super();
    this.userName = account.name ?? account.username;
  }

  async accessToken(): Promise<string> {
    const request = { scopes: [this.apiScope], account: this.account };
    try {
      const result = await this.msal.acquireTokenSilent(request);
      return result.accessToken;
    } catch (error) {
      if (error instanceof InteractionRequiredAuthError) {
        await this.msal.acquireTokenRedirect(request);
      }
      throw error;
    }
  }

  signInAgain(): Promise<void> {
    return this.msal.loginRedirect({ scopes: [this.apiScope] });
  }

  signOut(): Promise<void> {
    return this.msal.logoutRedirect({ account: this.account });
  }
}
