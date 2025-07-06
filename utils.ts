import { createDefine } from "fresh";
import { SignInSessionState } from "./utils/auth.ts";

// deno-lint-ignore no-empty-interface
export interface BaseState {}
export interface State extends BaseState, SignInSessionState {}
export const define = createDefine<State>();
