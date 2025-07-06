import { Database } from "@db/sqlite";
import { SimpleResult } from "./result.ts";

const db = new Database(Deno.env.get("DB_URL")!);

const init = async () => {
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL
    );
  `);
  await db.exec(`
    CREATE TABLE IF NOT EXISTS sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      secret_hash BLOB NOT NULL UNIQUE,
      expires_at INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
};

console.log("Initializing database...");
await init();

export function getUserByEmailAndPassword(
  email: string,
  passwordHash: string,
): SimpleResult<{ id: number }> {
  const stmt = db.prepare(
    "SELECT * FROM users WHERE email = ? AND password_hash = ?",
  );

  try {
    const result = stmt.get(email, passwordHash);
    if (!result || !("id" in result) || typeof result.id !== "number") {
      return { ok: false, error: "User not found or invalid credentials" };
    }
    return { ok: true, id: result.id };
  } catch (error) {
    console.error("Error getting user by email and password:", error);
    return { ok: false, error: "Error getting user by email and password" };
  }
}

export function createUser(
  email: string,
  passwordHash: string,
): SimpleResult<{ id: number }> {
  const stmt = db.prepare(
    "INSERT INTO users (email, password_hash) VALUES (?, ?) RETURNING id",
  );

  try {
    const result = stmt.get(email, passwordHash);
    if (!result || !("id" in result) || typeof result.id !== "number") {
      return {
        ok: false,
        error: "Failed to create user or user already exists",
      };
    }

    return { ok: true, id: result.id };
  } catch (error) {
    console.error("Error creating user:", error);
    return { ok: false, error: "Error creating user" };
  }
}

export function createSession(
  userId: number,
  secretHash: string,
  expire: number,
): SimpleResult<null> {
  const stmt = db.prepare(
    "INSERT INTO sessions (user_id, secret_hash, expires_at) VALUES (?, ?, ?) RETURNING id",
  );

  try {
    const result = stmt.get(userId, secretHash, expire);
    if (!result || !("id" in result) || typeof result.id !== "number") {
      return {
        ok: false,
        error: "Failed to create session",
      };
    }

    return { ok: true };
  } catch (error) {
    console.error("Error creating session:", error);
    return { ok: false, error: "Error creating session" };
  }
}

export function getSessionByToken(
  token: string,
  now: number,
): SimpleResult<{ id: number; user_id: number }> {
  const stmt = db.prepare(
    "SELECT * FROM sessions WHERE secret_hash = ? AND expires_at > ? ORDER BY created_at DESC LIMIT 1",
  );
  try {
    const result = stmt.get(token, now);
    if (
      !result || !("id" in result) || typeof result.id !== "number" ||
      !("user_id" in result) || typeof result.user_id !== "number"
    ) {
      return { ok: false, error: "Invalid session token" };
    }
    return { ok: true, id: result.id, user_id: result.user_id };
  } catch (error) {
    console.error("Error getting session by token:", error);
    return { ok: false, error: "Error getting session by token" };
  }
}

export function getUserById(
  id: number,
): SimpleResult<{ id: number; email: string }> {
  const stmt = db.prepare("SELECT * FROM users WHERE id = ?");

  try {
    const result = stmt.get(id);
    if (
      !result || !("id" in result) || typeof result.id !== "number" ||
      !("email" in result) || typeof result.email !== "string"
    ) {
      return { ok: false, error: "User not found" };
    }
    return { ok: true, id: result.id, email: result.email };
  } catch (error) {
    console.error("Error getting user by id:", error);
    return { ok: false, error: "Error getting user by id" };
  }
}
