import { describe, it, expect } from "vitest";
import { settings } from "./global";
import S3ImageHosting from "../../src/index";

describe("S3ImageHosting init", () => {
  it("should create an instance with the provided settings", () => {
    const s3 = new S3ImageHosting(settings);
    expect(s3).toBeInstanceOf(S3ImageHosting);
  });
});
