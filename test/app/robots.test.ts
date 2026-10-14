import { describe, expect, it } from "vitest";
import robots from "@/app/robots";

describe("robots", () => {
  it("lets every crawler in and points them to the sitemap", () => {
    expect(robots()).toEqual({
      rules: { userAgent: "*", allow: "/" },
      sitemap: "https://faith.l3s5.dev/sitemap.xml",
    });
  });
});
