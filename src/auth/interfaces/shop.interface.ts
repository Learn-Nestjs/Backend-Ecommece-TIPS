import { ProviderAuth } from '@prisma/client';

export interface ISignUp {
  name: string;
  email: string;
  password?: string;
  provider?: ProviderAuth;
  avatar?: string;
}
export interface ISignIn extends Pick<ISignUp, 'email' | 'password'> {}
