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
    .send({ email, callbackUrl: "http://localhost:3000/validate" })
    .then((response) => {
      throw new Error("This magic link should have never been successful");
    })
    .catch((error) => {
      expect(error.message).toBeDefined();
    });
});

test("magic link sends successfully", async () => {
  const email = "test@authengine.co";
  client.magicLink
    .send({ email, callbackUrl: "http://localhost:3000/validate" })
    .then((response) => {
      expect(response).toBeDefined();
    })
    .catch((error) => {
      throw new Error("Magic link did not send successfully");
    });
});
