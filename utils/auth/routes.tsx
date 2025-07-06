import { FreshContext } from "fresh";
import { signIn, signUp } from "./logic.ts";

export function getSigninPageHandler(signinPath: string) {
  return (ctx: FreshContext) => {
    const error = ctx.url.searchParams.get("error");

    const html = (
      <html>
        <head>
          <title>Signin</title>
        </head>
        <body>
          <h1>Signin</h1>
          <p>{error ? error : ""}</p>
          <form method="POST" action={signinPath}>
            <label for="email">Email:</label>
            <input type="email" id="email" name="email" required />
            <br />
            <label for="password">Password:</label>
            <input type="password" id="password" name="password" required />
            <br />
            <button type="submit">Login</button>
          </form>
        </body>
      </html>
    );

    return ctx.render(html);
  };
}
export function getSigninHandler(signinPath: string, signinAfterPath: string) {
  return async (ctx: FreshContext) => {
    const form = await ctx.req.formData();
    const email = form.get("email");
    const password = form.get("password");

    if (
      !email || !password
    ) {
      console.error(`Invalid signin attempt with email: ${email}`);
      return Response.redirect(
        `${ctx.url.protocol}//${ctx.url.host}${signinPath}?error=Invalid credentials`,
      );
    }

    const result = await signIn(email.toString(), password.toString());
    if (!result.ok) {
      console.error(
        `Signin failed for email: ${email}, error: ${result.error}`,
      );
      return Response.redirect(
        `${ctx.url.protocol}//${ctx.url.host}${signinPath}?error=${
          encodeURIComponent(result.error)
        }`,
      );
    }

    const response = new Response(null, {
      status: 302,
      headers: {
        "Location": `${ctx.url.protocol}//${ctx.url.host}${signinAfterPath}`,
        "Set-Cookie": `session=${result.token}; HttpOnly; Path=/; Max-Age=3600`,
      },
    });

    return response;
  };
}

export function getSignupPageHandler(signupPath: string) {
  return (ctx: FreshContext) => {
    const html = (
      <html>
        <head>
          <title>Signup</title>
        </head>
        <body>
          <h1>Signup</h1>
          <form method="POST" action={signupPath}>
            <label for="email">Email:</label>
            <input type="email" id="email" name="email" required />
            <br />
            <label for="password">Password:</label>
            <input type="password" id="password" name="password" required />
            <br />
            <button type="submit">Signup</button>
          </form>
        </body>
      </html>
    );

    return ctx.render(html);
  };
}

export function getSignupHandler(signupPath: string, signinAfterPath: string) {
  return async (ctx: FreshContext) => {
    const form = await ctx.req.formData();
    const email = form.get("email");
    const password = form.get("password");

    if (!email || !password) {
      console.error(`Invalid signup attempt with email: ${email}`);
      return Response.redirect(
        `${ctx.url.protocol}//${ctx.url.host}${signupPath}?error=Signup not implemented`,
      );
    }

    const result = await signUp(email.toString(), password.toString());
    if (!result.ok) {
      console.error(
        `Signup failed for email: ${email}, error: ${result.error}`,
      );
      return Response.redirect(
        `${ctx.url.protocol}//${ctx.url.host}${signupPath}?error=${
          encodeURIComponent(result.error)
        }`,
      );
    }

    const response = new Response(null, {
      status: 302,
      headers: {
        "Location": `${ctx.url.protocol}//${ctx.url.host}${signinAfterPath}`,
        "Set-Cookie": `session=${result.token}; HttpOnly; Path=/; Max-Age=3600`,
      },
    });

    return response;
  };
}
