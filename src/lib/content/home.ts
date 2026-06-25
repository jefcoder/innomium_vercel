import { engagementIcons } from "@/lib/icons";

export const homeContent = {
  hero: {
    headline: "Verified AI/ML talent for consulting, execution, and live technical challenges.",
    subheadline:
      "Innomium connects companies with trusted AI/ML experts for mentorship, confidential advisory, one-to-one technical work, and performance-driven competitions.",
    primaryCTAs: [
      { label: "Find AI/ML Talent", href: "/talents" },
      { label: "Apply as Talent", href: "/apply" },
    ],
    secondaryCTA: { label: "Launch a Competition", href: "/competitions" },
  },
  clientCapabilities: {
    headline: "Access the right AI/ML expertise, in the right format.",
    description:
      "Whether you need strategic guidance, hands-on implementation, confidential advisory, or competitive problem solving, Innomium helps you connect with verified AI/ML talent through flexible engagement models.",
    cards: [
      {
        key: "consult" as const,
        title: "Expert Consultation",
        description:
          "Get direct guidance from verified AI/ML professionals for architecture review, model strategy, training issues, evaluation design, or technical decision-making.",
      },
      {
        key: "proprietary" as const,
        title: "Proprietary Consultation",
        description:
          "Discuss sensitive problems through controlled disclosure, anonymous expert matching, NDA workflows, and Innomium-assisted facilitation.",
      },
      {
        key: "task" as const,
        title: "1:1 Technical Tasks",
        description:
          "Assign technical work to selected experts through hourly or milestone-based engagements with clear deliverables and review processes.",
      },
      {
        key: "competition" as const,
        title: "Live Competitions",
        description:
          "Launch AI/ML challenges where multiple talents compete, contribute, and demonstrate capability through measurable results.",
      },
    ],
  },
  talentBenefits: {
    headline: "Join a trusted AI/ML network built around proven expertise.",
    description:
      "Innomium gives skilled AI/ML professionals a professional platform to showcase verified capability, control profile visibility, and access high-quality consulting, task, and competition opportunities.",
    cards: [
      {
        icon: "verified" as const,
        title: "Build a Verified Profile",
        description:
          "Submit evidence for your skills and receive verification from the Innomium team.",
      },
      {
        icon: "network" as const,
        title: "Choose Your Availability",
        description:
          "Set whether you are open to consulting, proprietary advisory, tasks, competitions, or urgent requests.",
      },
      {
        icon: "visibility" as const,
        title: "Control Your Visibility",
        description:
          "Remain public, limited, hidden, or visible only after contribution.",
      },
      {
        icon: "reputation" as const,
        title: "Build Reputation Through Performance",
        description:
          "Earn reputation through client reviews, completed work, verified skills, and competition outcomes.",
      },
    ],
  },
  whyInnomium: {
    headline: "A higher-trust network for serious AI/ML work.",
    description:
      "AI/ML work often requires specialized judgment, confidentiality, and deep technical experience. Innomium is designed to help clients discover talent they can trust and help talents work in ways that protect their professional identity and reputation.",
    points: [
      "Every important skill claim can be supported by evidence.",
      "Talent visibility is controlled by the talent.",
      "Client requests can be public, private, selected, or Innomium-mediated.",
      "Confidential engagements support staged information disclosure.",
      "Competitions allow clients to discover capability through performance, not only resumes.",
    ],
  },
};

export { engagementIcons };
