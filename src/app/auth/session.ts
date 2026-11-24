export abstract class Session {
  abstract readonly userName: string;

  abstract accessToken(): Promise<string>;

  abstract signInAgain(): Promise<void>;

  abstract signOut(): Promise<void>;
}
