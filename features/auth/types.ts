export type SignInCredentials = {
  email: string;
  password: string;
};

export type AuthenticatedUser = {
  code: number;
  message: string;
  data?: {
    token: string;
    user: {
      name: string;
      email: string;
    }
  }
};
