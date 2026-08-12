import { describe, expect, it } from "vitest";
import { assertSafeUrl, UnsafeUrlError } from "../urlSafety";

describe("assertSafeUrl", () => {
  it("allows an ordinary public https URL", async () => {
    const url = await assertSafeUrl("https://example.com/team");
    expect(url.hostname).toBe("example.com");
  });

  it("rejects a non-http(s) scheme", async () => {
    await expect(assertSafeUrl("file:///etc/passwd")).rejects.toThrow(UnsafeUrlError);
  });

  it("rejects localhost", async () => {
    await expect(assertSafeUrl("http://localhost:3000/")).rejects.toThrow(UnsafeUrlError);
  });

  it("rejects a private IPv4 literal", async () => {
    await expect(assertSafeUrl("http://10.0.0.5/")).rejects.toThrow(UnsafeUrlError);
  });

  it("rejects the cloud metadata address", async () => {
    await expect(assertSafeUrl("http://169.254.169.254/latest/meta-data")).rejects.toThrow(UnsafeUrlError);
  });

  it("rejects a loopback IPv4 literal", async () => {
    await expect(assertSafeUrl("http://127.0.0.1:8080/")).rejects.toThrow(UnsafeUrlError);
  });

  it("rejects an invalid URL string", async () => {
    await expect(assertSafeUrl("not a url")).rejects.toThrow(UnsafeUrlError);
  });
});
