import Client from "./client";

class LocalStorageMock {
  store: {};
  constructor() {
    this.store = {};
  }

  clear() {
    this.store = {};
  }

  getItem(key) {
    return this.store[key] || null;
  }

  setItem(key, value) {
    this.store[key] = String(value);
  }

  removeItem(key) {
    delete this.store[key];
  }

  get length() {
    return Object.keys(this.store).length;
  }

  key(index: number) {
    return Object.keys(this.store)[index] || null;
  }
}

global.localStorage = new LocalStorageMock();

const client = new Client({
  apiUrl: "http://localhost:8000",
  publicKey: "test",
});

test("magic link fails for invalid email", async () => {
  const email = "invalid";
  client.magicLink
    .create({ email, callbackUrl: "http://localhost:3000/validate" })
    .catch((error) => {
      expect(error.message).toBeDefined();
    });
});

test("retrives all sessions", async () => {
  client.user.sessions.list();
});
