import {
  createSession,
  createUser,
  getSessionByToken,
  getUserByEmailAndPassword,
  getUserById,
} from "../../utils/db.ts";
import { SimpleResult } from "../../utils/result.ts";

async function getTextHash(src: string, salt: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(salt + src + salt);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  // ArrayBufferを16進数文字列に変換
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function signUp(
  email: string,
  password: string,
): Promise<SimpleResult<{ token: string }>> {
  const passwordHash = await getTextHash(password, Deno.env.get("AUTH_SALT")!);
  const createUserResult = await createUser(email, passwordHash);

  if (!createUserResult.ok) {
    console.error(createUserResult.error);
    return { ok: false, error: createUserResult.error };
  }

  const token = await crypto.randomUUID();
  const tokenHash = await getTextHash(token, Deno.env.get("AUTH_SALT")!);
  const expire = Date.now() + 60 * 60 * 1000;

  const createSessionResult = await createSession(
    createUserResult.id,
    tokenHash,
    expire,
  );

  if (!createSessionResult.ok) {
    console.error(createSessionResult.error);
    return { ok: false, error: createSessionResult.error };
  }

  return { ok: true, token };
}

export async function signIn(
  email: string,
  password: string,
): Promise<SimpleResult<{ token: string }>> {
  const passwordHash = await getTextHash(password, Deno.env.get("AUTH_SALT")!);
  const userResult = await getUserByEmailAndPassword(email, passwordHash);

  if (!userResult.ok) {
    console.error(userResult.error);
    return { ok: false, error: userResult.error };
  }

  const token = await crypto.randomUUID();
  const tokenHash = await getTextHash(token, Deno.env.get("AUTH_SALT")!);
  const expire = Date.now() + 1 * 60 * 1000;

  const createSessionResult = await createSession(
    userResult.id,
    tokenHash,
    expire,
  );

  if (!createSessionResult.ok) {
    console.error(createSessionResult.error);
    return { ok: false, error: createSessionResult.error };
  }

  return { ok: true, token };
}

export async function getUserBySession(
  token: string,
): Promise<SimpleResult<{ id: number; email: string }>> {
  const tokenHash = await getTextHash(token, Deno.env.get("AUTH_SALT")!);
  const result = await getSessionByToken(tokenHash, Date.now());
  if (!result.ok) {
    console.error(result.error);
    return { ok: false, error: result.error };
  }

  const userResult = await getUserById(result.user_id);
  if (!userResult.ok) {
    console.error(userResult.error);
    return { ok: false, error: userResult.error };
  }

  return { ok: true, id: result.user_id, email: userResult.email };
}
