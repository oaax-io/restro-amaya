// @ts-ignore bun test runner types
import { describe, expect, test } from "bun:test";
import { clearLocalSession } from "./local-sign-out";

describe("offline logout", () => {
  test("removes session and auxiliary credentials without any network call", async () => {
    const key = "sb-test-auth-token";
    const values = new Map([
      [key, "session"], [`${key}-code-verifier`, "verifier"],
      [`${key}-user`, "user"], ["language", "de"],
    ]);
    await clearLocalSession({ removeItem: (name) => { values.delete(name); } }, key);
    expect([...values.entries()]).toEqual([["language", "de"]]);
  });

  test("clears all credentials through asynchronous preview storage too", async () => {
    const removed: string[] = [];
    await clearLocalSession({ removeItem: async (key) => { removed.push(key); } }, "app-session");
    expect(removed.sort()).toEqual(["app-session", "app-session-code-verifier", "app-session-user"]);
  });
});