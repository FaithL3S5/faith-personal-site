import { describe, expect, it } from "vitest";
import { email, fullName, links, siteUrl } from "@/content/site";
import { personStructuredData } from "@/lib/personStructuredData";

describe("personStructuredData", () => {
  it("builds Faith's Person record from the site content", () => {
    const person = personStructuredData();

    expect(person).toMatchObject({
      "@context": "https://schema.org",
      "@type": "Person",
      name: fullName,
      alternateName: ["Faith", "FaithL3S5"],
      url: siteUrl,
      email,
      image: `${siteUrl}/opengraph-image.png`,
    });
    expect(person.sameAs).toEqual([links.linkedIn, links.gitHub, links.gamingChannel]);
  });
});
