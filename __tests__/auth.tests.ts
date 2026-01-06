/** @jest-environment jsdom */
import { login } from "@/app/(auth)/api";
import { signInWithEmailAndPassword } from "firebase/auth";

jest.mock("firebase/auth", () => ({
  signInWithEmailAndPassword: jest.fn(),
}));

jest.mock("@/src/core/firebase/client", () => ({
  auth: { __type: "auth" },
}));

describe("auth api", () => {
  beforeEach(() => jest.clearAllMocks());

  test("login calls signInWithEmailAndPassword and returns user", async () => {
    (signInWithEmailAndPassword as jest.Mock).mockResolvedValue({
      user: { uid: "u1", email: "a@b.com" },
    });

    const result = await login("a@b.com", "pass123");

    expect(signInWithEmailAndPassword).toHaveBeenCalledTimes(1);
    expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
      { __type: "auth" },
      "a@b.com",
      "pass123"
    );
    expect(result.user).toEqual({ uid: "u1", email: "a@b.com" });
  });

  test("login bubbles up auth errors", async () => {
    (signInWithEmailAndPassword as jest.Mock).mockRejectedValue(
      new Error("Login failed")
    );

    await expect(login("a@b.com", "pass123")).rejects.toThrow("Login failed");
  });
});
