import { email, fullName, links, siteUrl } from "@/content/site";

export function personStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: fullName,
    alternateName: ["Faith", "FaithL3S5"],
    url: siteUrl,
    email,
    image: `${siteUrl}/opengraph-image.png`,
    jobTitle: "Full-stack developer",
    address: { "@type": "PostalAddress", addressLocality: "Jakarta", addressCountry: "ID" },
    sameAs: [links.linkedIn, links.gitHub, links.gamingChannel],
  };
}
