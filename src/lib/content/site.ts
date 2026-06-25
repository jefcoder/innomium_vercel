export const site = {
  name: "Innomium Talent",
  tagline: "Verified AI/ML talent for consulting, execution, and live technical challenges.",
  description:
    "Innomium connects companies with trusted AI/ML experts for mentorship, confidential advisory, one-to-one technical work, and performance-driven competitions.",
  url: "https://talent.innomium.com",
  contactEmail: "talent@innomium.com",
} as const;

export const mainNav = [
  { label: "Home", href: "/", icon: "home" as const },
  { label: "For Clients", href: "/for-clients", icon: "forClients" as const },
  { label: "For Talent", href: "/for-talent", icon: "forTalent" as const },
  { label: "Browse Talent", href: "/talents", icon: "browseTalent" as const },
  { label: "Competitions", href: "/competitions", icon: "competitions" as const },
  { label: "Trust & Vetting", href: "/trust", icon: "trust" as const },
] as const;

export const footerNav = {
  platform: [
    { label: "For Clients", href: "/for-clients" },
    { label: "For Talent", href: "/for-talent" },
    { label: "Browse Talent", href: "/talents" },
    { label: "Competitions", href: "/competitions" },
  ],
  trust: [
    { label: "Trust & Vetting", href: "/trust" },
    { label: "Apply as Talent", href: "/apply" },
  ],
  account: [
    { label: "Sign In", href: "/login" },
    { label: "Get Started", href: "/signup" },
  ],
} as const;

export const clientCTAs = [
  "Find AI/ML Talent",
  "Request Expert Consultation",
  "Launch a Competition",
  "Start a Client Request",
  "Request Hidden Talent",
  "Get Matched by Innomium",
] as const;

export const talentCTAs = [
  "Apply as Talent",
  "Build Your Verified Profile",
  "Join the AI/ML Talent Network",
  "Submit Your Expertise",
] as const;
