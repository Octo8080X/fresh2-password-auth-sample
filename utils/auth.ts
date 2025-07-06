import * as auth from "./auth/plugin.ts";
export const passwordAuth = auth.passwordAuth({
  signinPath: "/session",
  signupPath: "/signup",
  signinAfterPath: "/",
});

export type { SignInSessionState } from "./auth/middleware.ts";
