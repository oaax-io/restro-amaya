type SessionStorage = {
  removeItem: (key: string) => void | Promise<unknown>;
};

/** Remove this app's credentials without requiring a reachable auth service. */
export async function clearLocalSession(storage: SessionStorage, storageKey: string) {
  await Promise.all([
    storageKey,
    `${storageKey}-code-verifier`,
    `${storageKey}-user`,
  ].map((key) => storage.removeItem(key)));
}