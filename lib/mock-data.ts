import type {
  InterestOption,
  ExperienceOption,
  GoalOption,
  LanguageOption,
  TimeOption,
  Recommendation,
} from "./types";

export const interestOptions: InterestOption[] = [
  { value: "Compilers", label: "Compilers", icon: "⚙️" },
  { value: "Programming Languages", label: "Programming Languages", icon: "🔤" },
  { value: "Rust", label: "Rust", icon: "🦀" },
  { value: "Operating Systems", label: "Operating Systems", icon: "💻" },
  { value: "Databases", label: "Databases", icon: "🗄️" },
  { value: "Web Development", label: "Web Development", icon: "🌐" },
  { value: "AI / ML", label: "AI / ML", icon: "🧠" },
  { value: "Developer Tools", label: "Developer Tools", icon: "🛠️" },
  { value: "Game Development", label: "Game Development", icon: "🎮" },
  { value: "Security", label: "Security", icon: "🔒" },
  { value: "Embedded Systems", label: "Embedded Systems", icon: "🔌" },
  { value: "DevOps", label: "DevOps", icon: "🚀" },
  { value: "Networking", label: "Networking", icon: "📡" },
];

export const experienceOptions: ExperienceOption[] = [
  {
    value: "Beginner",
    label: "Beginner",
    description:
      "New to open source. Looking for welcoming communities and well-documented issues labeled for newcomers.",
    icon: "🌱",
  },
  {
    value: "Intermediate",
    label: "Intermediate",
    description:
      "Have contributed before. Comfortable with PRs, code review, and project workflows.",
    icon: "🌿",
  },
  {
    value: "Advanced",
    label: "Advanced",
    description:
      "Experienced contributor. Ready for architectural work, performance optimization, and core features.",
    icon: "🌳",
  },
];

export const goalOptions: GoalOption[] = [
  {
    value: "First Open Source Contribution",
    label: "First Contribution",
    description: "Make your debut in open source",
  },
  {
    value: "Build Portfolio",
    label: "Build Portfolio",
    description: "Showcase work to employers",
  },
  {
    value: "Learn New Technologies",
    label: "Learn Technologies",
    description: "Pick up new skills hands-on",
  },
  {
    value: "Find Mentors",
    label: "Find Mentors",
    description: "Connect with experienced devs",
  },
  {
    value: "Contribute to Production Systems",
    label: "Production Systems",
    description: "Work on real-world codebases",
  },
  {
    value: "Prepare for Jobs",
    label: "Job Preparation",
    description: "Strengthen your resume",
  },
  {
    value: "Deep Technical Learning",
    label: "Deep Learning",
    description: "Dive deep into complex systems",
  },
];

export const languageOptions: LanguageOption[] = [
  { value: "Rust", label: "Rust" },
  { value: "C", label: "C" },
  { value: "C++", label: "C++" },
  { value: "Go", label: "Go" },
  { value: "JavaScript", label: "JavaScript" },
  { value: "TypeScript", label: "TypeScript" },
  { value: "Python", label: "Python" },
  { value: "Java", label: "Java" },
  { value: "Kotlin", label: "Kotlin" },
  { value: "Zig", label: "Zig" },
];

export const timeOptions: TimeOption[] = [
  {
    value: "Less than 2 hours/week",
    label: "Casual",
    description: "A few hours on weekends",
  },
  {
    value: "2–5 hours/week",
    label: "Part-time",
    description: "Consistent weekly contributions",
  },
  {
    value: "5–10 hours/week",
    label: "Serious",
    description: "Significant time investment",
  },
  {
    value: "10+ hours/week",
    label: "Full-time",
    description: "Dedicated contributor",
  },
];

export const mockRecommendations: Recommendation[] = [
  {
    id: "1",
    repository: "rust-analyzer",
    organization: "rust-lang",
    description:
      "An experimental Rust compiler front-end for IDEs. Provides real-time analysis, go-to-definition, and inline hints.",
    primaryLanguage: "Rust",
    stars: 9800,
    activityLevel: "Very High",
    openBeginnerIssues: 18,
    openHelpWantedIssues: 24,
    lastUpdated: "2 hours ago",
    badges: ["Beginner Friendly", "High Activity", "Great Documentation", "Fast Maintainer Response"],
    whyRecommended: [
      "Matches your interest in compilers and Rust.",
      "Has 18 beginner-friendly issues.",
      "Maintainers responded to contributors within 24 hours.",
    ],
  },
  {
    id: "2",
    repository: "tokio",
    organization: "tokio-rs",
    description:
      "An asynchronous runtime for the Rust programming language. Provides the building blocks for writing network applications.",
    primaryLanguage: "Rust",
    stars: 28400,
    activityLevel: "High",
    openBeginnerIssues: 8,
    openHelpWantedIssues: 15,
    lastUpdated: "5 hours ago",
    badges: ["High Activity", "Great Documentation"],
    whyRecommended: [
      "Matches your interest in Rust and networking.",
      "Widely used in production systems.",
      "Has comprehensive documentation and examples.",
    ],
  },
  {
    id: "3",
    repository: "neovim",
    organization: "neovim",
    description:
      "Hyperextensible Vim-based text editor. Community-driven with a modern architecture and Lua scripting.",
    primaryLanguage: "C",
    stars: 86200,
    activityLevel: "Very High",
    openBeginnerIssues: 32,
    openHelpWantedIssues: 41,
    lastUpdated: "1 hour ago",
    badges: ["Beginner Friendly", "High Activity", "Great Documentation", "Fast Maintainer Response"],
    whyRecommended: [
      "Matches your interest in developer tools.",
      "Has 32 beginner-friendly issues.",
      "Large, welcoming community with fast response times.",
    ],
  },
  {
    id: "4",
    repository: "zig",
    organization: "ziglang",
    description:
      "General-purpose programming language and toolchain for maintaining robust, optimal, and reusable software.",
    primaryLanguage: "Zig",
    stars: 38100,
    activityLevel: "High",
    openBeginnerIssues: 12,
    openHelpWantedIssues: 19,
    lastUpdated: "3 hours ago",
    badges: ["Systems Programming", "High Activity"],
    whyRecommended: [
      "Matches your interest in programming languages and systems programming.",
      "Active compiler development with many contribution opportunities.",
      "Smaller codebase that is easier to navigate.",
    ],
  },
  {
    id: "5",
    repository: "deno",
    organization: "denoland",
    description:
      "A modern runtime for JavaScript and TypeScript with secure-by-default features and native TypeScript support.",
    primaryLanguage: "Rust",
    stars: 100300,
    activityLevel: "Very High",
    openBeginnerIssues: 14,
    openHelpWantedIssues: 22,
    lastUpdated: "30 minutes ago",
    badges: ["Beginner Friendly", "High Activity", "Great Documentation", "Fast Maintainer Response"],
    whyRecommended: [
      "Matches your interest in JavaScript, TypeScript, and developer tools.",
      "Well-organized issue tracker with good-first-issue labels.",
      "Fast maintainer response times.",
    ],
  },
  {
    id: "6",
    repository: "tauri",
    organization: "tauri-apps",
    description:
      "Build smaller, faster, and more secure desktop and mobile applications with a web frontend.",
    primaryLanguage: "Rust",
    stars: 90200,
    activityLevel: "High",
    openBeginnerIssues: 21,
    openHelpWantedIssues: 30,
    lastUpdated: "4 hours ago",
    badges: ["Beginner Friendly", "High Activity", "Great Documentation"],
    whyRecommended: [
      "Matches your interest in web development and Rust.",
      "Has 21 beginner-friendly issues.",
      "Excellent documentation for new contributors.",
    ],
  },
  {
    id: "7",
    repository: "linux",
    organization: "torvalds",
    description:
      "Linux kernel source tree. The world's most popular open-source operating system kernel.",
    primaryLanguage: "C",
    stars: 190000,
    activityLevel: "Very High",
    openBeginnerIssues: 5,
    openHelpWantedIssues: 12,
    lastUpdated: "1 hour ago",
    badges: ["Systems Programming", "High Activity"],
    whyRecommended: [
      "Matches your interest in operating systems and networking.",
      "The definitive systems programming project.",
      "Maintainers actively label beginner-friendly patches.",
    ],
  },
  {
    id: "8",
    repository: "llama.cpp",
    organization: "ggml-org",
    description:
      "Inference of LLMs in C/C++. Run large language models locally with GPU acceleration.",
    primaryLanguage: "C++",
    stars: 82400,
    activityLevel: "Very High",
    openBeginnerIssues: 16,
    openHelpWantedIssues: 28,
    lastUpdated: "1 hour ago",
    badges: ["Beginner Friendly", "High Activity", "Fast Maintainer Response"],
    whyRecommended: [
      "Matches your interest in AI/ML.",
      "Fast-growing project with many issues.",
      "Has 16 beginner-friendly issues for newcomers.",
    ],
  },
  {
    id: "9",
    repository: "signal-cli",
    organization: "AsamK",
    description:
      "A CLI and Java library for the Signal messaging protocol. Create and manage Signal accounts programmatically.",
    primaryLanguage: "Java",
    stars: 8600,
    activityLevel: "Moderate",
    openBeginnerIssues: 9,
    openHelpWantedIssues: 13,
    lastUpdated: "1 day ago",
    badges: ["Beginner Friendly", "Great Documentation"],
    whyRecommended: [
      "Matches your interest in security and networking.",
      "Well-documented codebase.",
      "Maintainers are responsive to new contributors.",
    ],
  },
];

export const defaultFilters = {
  minStars: 0,
  maxDifficulty: "any" as const,
  language: "any",
  activityLevel: "any" as const,
  beginnerFriendlyOnly: false,
  systemsProjectsOnly: false,
};
