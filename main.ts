import { App, fsRoutes, staticFiles } from "fresh";
import { define, type State } from "./utils.ts";
import { passwordAuth } from "./utils/auth.ts";

export const app = new App<State>();

app.use(staticFiles());

passwordAuth.setup(app, define);

// this can also be defined via a file. feel free to delete this!
const exampleLoggerMiddleware = define.middleware((ctx) => {
  console.log(`${ctx.req.method} ${ctx.req.url}`);
  return ctx.next();
});
app.use(define.middleware(exampleLoggerMiddleware));

await fsRoutes(app, {
  loadIsland: (path) => import(`./islands/${path}`),
  loadRoute: (path) => import(`./routes/${path}`),
});

if (import.meta.main) {
  app.listen();
}
