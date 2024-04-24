import { ProviderAuth } from '@prisma/client';

export interface ISignUp {
  name: string;
  email: string;
  password?: string;
  provider?: ProviderAuth;
  avatat?: string;
}
export interface ISignIn extends Pick<ISignUp, 'email' | 'password'> {}
