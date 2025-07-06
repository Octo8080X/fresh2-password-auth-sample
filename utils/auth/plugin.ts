import { App, Define } from "fresh";
import { signInSessionMiddleware } from "./middleware.ts";
import {
  getSigninHandler,
  getSigninPageHandler,
  getSignupHandler,
  getSignupPageHandler,
} from "./routes.tsx";

import type { SignInSessionState } from "./middleware.ts";
import { signinLinkComponent, signupLinkComponent } from "./component.tsx";

function setupPasswordAuth<State extends SignInSessionState>(
  app: App<State>,
  define: Define<State>,
  params: {
    signinPath: string;
    signupPath: string;
    signinAfterPath: string;
  },
) {
  app.use(define.middleware(signInSessionMiddleware));
  app.post(
    params.signinPath,
    getSigninHandler(params.signinPath, params.signinAfterPath),
  );
  app.get(params.signinPath, getSigninPageHandler(params.signinPath));
  app.post(
    params.signupPath,
    getSignupHandler(params.signupPath, params.signinAfterPath),
  );
  app.get(params.signupPath, getSignupPageHandler(params.signupPath));
}

export function passwordAuth(params: {
  signinPath: string;
  signupPath: string;
  signinAfterPath: string;
}) {
  return {
    setup<State extends SignInSessionState>(
      app: App<State>,
      define: Define<State>,
    ) {
      setupPasswordAuth(app, define, params);
    },
    SigninLinkComponent: signinLinkComponent(params.signinPath),
    SignupLinkComponent: signupLinkComponent(params.signupPath),
  };
}
