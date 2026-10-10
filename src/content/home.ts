import { links } from "./site";

export type SpecCell = {
  code: string;
  mobileCode: string;
  label: string;
  value: string;
  href?: string;
  isLiveClock?: boolean;
};

export const specCells: readonly SpecCell[] = [
  { code: "A1", mobileCode: "A1", label: "Location", value: "Jakarta, Indonesia" },
  {
    code: "A2",
    mobileCode: "A5",
    label: "Coordinates",
    value: "6.2088° S, 106.8456° E",
    href: links.coordinates,
  },
  { code: "A3", mobileCode: "A2", label: "Local time", value: "", isLiveClock: true },
  { code: "A4", mobileCode: "A3", label: "Experience", value: "3 years in production" },
  { code: "A5", mobileCode: "A4", label: "Daily drivers", value: "Java, TypeScript" },
];

export const about = {
  paragraph:
    "I'm a software engineer from Jakarta, Indonesia, in my third year in this field. My daily drivers are Java and TypeScript, usually Spring Boot and NestJS on the backend with Next.js and React on the front.",
  improving: "I'm currently improving on Go and SQL",
  profileRole: "Software Engineer, Jakarta",
  languages: [
    { name: "Indonesian", level: "Native" },
    { name: "English", level: "C2, EF SET 88/100" },
    { name: "Japanese", level: "N5 equivalent, studying" },
  ],
  education: {
    school: "State Polytechnic of Jakarta, 2018 to 2022",
    degree: "B.A.Sc., Computer and Informatics Engineering",
  },
} as const;

export const ndaNote =
  "Most of my current work is under NDA. These two features are the parts I'm cleared to share.";

export type CaseStudy = {
  code: string;
  title: string;
  summary: string;
  tone: "dark" | "light";
  illustration: "stack" | "frame";
  facts: readonly { label: string; value: string }[];
};

export const caseStudies: readonly CaseStudy[] = [
  {
    code: "Case 01 / Full-stack",
    title: "Content Approval",
    summary:
      "My full-stack, end-to-end example, leaning backend. There was no frontend or backend reference design: every part of it came from me.",
    tone: "dark",
    illustration: "stack",
    facts: [
      { label: "Role", value: "Sole owner, backend to frontend" },
      { label: "Stack", value: "Spring Boot, NestJS, Redis, tus" },
      { label: "Built", value: "2025" },
      { label: "Status", value: "Released mid-2026" },
    ],
  },
  {
    code: "Case 02 / Frontend",
    title: "DSME VCS",
    summary:
      "Mostly frontend work, built from designs attached to a Jira ticket. Loading a Lottie animation lives in its own hook, so the next screen reuses it.",
    tone: "light",
    illustration: "frame",
    facts: [
      { label: "Role", value: "Frontend, from design handoff" },
      { label: "Stack", value: "React, MUI, Lottie" },
      { label: "Built", value: "2025" },
      { label: "Status", value: "Released mid-2026" },
    ],
  },
];

export const walkthrough = {
  eyebrow: "Walkthrough",
  title: "See both features in full",
  summary:
    "The video walks through the ask, the flow, the code, and the result. The deck holds the same material as slides.",
  facts: [
    { label: "Video", value: "YouTube, 8:55" },
    { label: "Deck", value: "PDF, 16 pages" },
  ],
} as const;

export type ExperienceEntry = {
  number: string;
  company: string;
  role: string;
  period: string;
  isCurrent?: boolean;
};

export const experienceEntries: readonly ExperienceEntry[] = [
  {
    number: "01",
    company: "SMBC Indonesia",
    role: "Full Stack Developer. Real-time video banking and corporate onboarding systems.",
    period: "Apr 2025 to present",
    isCurrent: true,
  },
  {
    number: "02",
    company: "PLN Icon Plus",
    role: "Software Engineer. Frontend across three concurrent projects. Mentored juniors in Vue 3 and Tailwind CSS.",
    period: "Aug 2024 to Oct 2024",
  },
  {
    number: "03",
    company: "Independent development",
    role: "Self-directed learning, freelance work, and a short-term contract",
    period: "Nov 2023 to Jul 2024",
  },
  {
    number: "04",
    company: "Bank KB Bukopin",
    role: "Software Engineer. Full-stack digital attendance system with jQuery, React, and Spring Boot.",
    period: "Oct 2022 to Oct 2023",
  },
];

export type StackTier = {
  label: string;
  items: readonly string[];
  variant: "daily" | "secondary" | "learning";
};

export const dailyStackTiers: readonly StackTier[] = [
  { label: "Backend", items: ["Java", "Spring Boot", "NestJS"], variant: "daily" },
  {
    label: "Frontend",
    items: ["TypeScript", "Next.js", "React", "Chakra UI v3", "TanStack Query"],
    variant: "daily",
  },
  { label: "Data", items: ["MS SQL Server", "MySQL", "Redis", "Liquibase"], variant: "daily" },
  { label: "Queues and jobs", items: ["BullMQ", "Quartz"], variant: "daily" },
];

export const extraStackTiers: readonly StackTier[] = [
  {
    label: "Also worked with",
    items: [
      "Vue 3",
      "Redux",
      "Tailwind CSS",
      "Node.js",
      "Docker",
      "PostgreSQL",
      "MongoDB",
      "Firebase",
      "Grafana",
      "Python",
      "PHP",
    ],
    variant: "secondary",
  },
  { label: "Learning", items: ["Go"], variant: "learning" },
];

export const contactHeadline = "Hope to talk more soon";
