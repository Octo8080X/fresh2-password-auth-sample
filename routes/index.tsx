import { useSignal } from "@preact/signals";
import { define } from "../utils.ts";
import Counter from "../islands/Counter.tsx";
import { passwordAuth } from "./../utils/auth.ts";

export default define.page(function Home(ctx) {
  const count = useSignal(3);

  return (
    <div class="px-4 py-8 mx-auto fresh-gradient">
      <div class="max-w-screen-md mx-auto flex flex-col items-center justify-center">
        <img
          class="my-6"
          src="/logo.svg"
          width="128"
          height="128"
          alt="the Fresh logo: a sliced lemon dripping with juice"
        />
        <h1 class="text-4xl font-bold">Welcome to Fresh</h1>
        <p class="my-4">
          Try updating this message in the
          <code class="mx-2">./routes/index.tsx</code> file, and refresh.
        </p>
        <Counter count={count} />

        <div>
          {ctx.state.session.isLogin
            ? <p>Welcome back, {ctx.state.session.email}!</p>
            : (
              <p>
                You are not signed in. Please{" "}
                <passwordAuth.SignupLinkComponent text="sign up" /> or{" "}
                <passwordAuth.SigninLinkComponent text="sign in" />.
              </p>
            )}
        </div>
      </div>
    </div>
  );
});
