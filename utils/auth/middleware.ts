import { FreshContext } from "fresh";
import { getUserBySession } from "./logic.ts";

export interface SignInSessionState {
  session: {
    id: number;
    email: string;
    isLogin: true;
  } | {
    isLogin: false;
  };
}

export async function signInSessionMiddleware<State extends SignInSessionState>(
  ctx: FreshContext<State>,
) {
  const session = ctx.req.headers.get("cookie")?.split("; ").find((c) =>
    c.startsWith("session=")
  )?.split("=")[1];

  if (!session) {
    ctx.state.session = { isLogin: false };
    return ctx.next();
  }

  const result = await getUserBySession(session);
  if (!result.ok) {
    ctx.state.session = { isLogin: false };
  } else {
    ctx.state.session = {
      id: result.id,
      email: result.email,
      isLogin: true,
    };
  }
  return ctx.next();
}
