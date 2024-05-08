import { ProviderAuth } from '@prisma/client';

export interface ISignUp {
  name: string;
  email: string;
  password: string;
}
export interface ISignIn extends Pick<ISignUp, 'email' | 'password'> {}

export interface ISignInWithThirdParty {
  name: string;
  email: string;
  provider: ProviderAuth;
  avatar?: string;
}
