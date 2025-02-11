export interface QuestionTemplate {
  question: string;
  options: string[];
}

export const questions: QuestionTemplate[] = [
  {
    question: "What's your favorite programming language?",
    options: ["JavaScript", "Python", "Java", "C++", "Rust"],
  },
  {
    question: "How do you prefer to work?",
    options: ["Remote", "Office", "Hybrid", "Coffee Shop"],
  },
  {
    question: "What's your preferred code editor?",
    options: ["VS Code", "Neovim", "JetBrains", "Sublime", "Emacs"],
  },
  {
    question: "Which testing framework do you prefer?",
    options: ["Jest", "Vitest", "Mocha", "AVA", "uvu"],
  },
  {
    question: "What's your primary operating system?",
    options: ["Windows", "macOS", "Linux", "BSD"],
  },
  {
    question: "How do you debug your code?",
    options: [
      "Console.log",
      "Debugger",
      "Unit Tests",
      "Print Statements",
      "Step Through",
    ],
  },
  {
    question: "Preferred package manager?",
    options: ["npm", "yarn", "pnpm", "bun"],
  },
  {
    question: "Favorite database type?",
    options: ["SQL", "NoSQL", "Graph", "Key-Value", "Time Series"],
  },
  {
    question: "How do you learn new technologies?",
    options: [
      "Documentation",
      "Video Tutorials",
      "Books",
      "Trial & Error",
      "Side Projects",
    ],
  },
  {
    question: "Preferred CI/CD platform?",
    options: [
      "GitHub Actions",
      "GitLab CI",
      "Jenkins",
      "CircleCI",
      "Travis CI",
    ],
  },
  {
    question: "How do you handle state management?",
    options: ["Redux", "Context API", "Zustand", "MobX", "Jotai"],
  },
  {
    question: "Favorite web framework?",
    options: ["React", "Vue", "Svelte", "Angular", "Solid"],
  },
  {
    question: "How do you style your applications?",
    options: [
      "CSS Modules",
      "Tailwind",
      "Styled Components",
      "SASS",
      "CSS-in-JS",
    ],
  },
  {
    question: "Preferred deployment platform?",
    options: ["Vercel", "Netlify", "AWS", "Digital Ocean", "Heroku"],
  },
  {
    question: "How do you document your code?",
    options: ["JSDoc", "README", "Wiki", "Storybook", "TypeDoc"],
  },
  {
    question: "Favorite git workflow?",
    options: [
      "Git Flow",
      "Trunk Based",
      "Feature Branches",
      "GitHub Flow",
      "GitLab Flow",
    ],
  },
  {
    question: "How do you handle errors?",
    options: [
      "Try/Catch",
      "Error Boundaries",
      "Global Handler",
      "Logger",
      "Sentry",
    ],
  },
  {
    question: "Preferred API architecture?",
    options: ["REST", "GraphQL", "tRPC", "gRPC", "WebSocket"],
  },
  {
    question: "How do you optimize performance?",
    options: [
      "Code Splitting",
      "Lazy Loading",
      "Caching",
      "Memoization",
      "Bundle Analysis",
    ],
  },
  {
    question: "Favorite terminal?",
    options: ["iTerm", "Windows Terminal", "Alacritty", "Kitty", "Hyper"],
  },
  {
    question: "How do you manage environment variables?",
    options: [
      ".env files",
      "CI/CD Variables",
      "Secret Manager",
      "Config Files",
      "Runtime Config",
    ],
  },
  {
    question: "Preferred authentication method?",
    options: ["JWT", "Session Cookies", "OAuth", "Magic Links", "Passwordless"],
  },
  {
    question: "How do you handle form state?",
    options: [
      "React Hook Form",
      "Formik",
      "Final Form",
      "Native Forms",
      "Zod + React Hook Form",
    ],
  },
  {
    question: "Favorite development browser?",
    options: ["Chrome", "Firefox", "Safari", "Edge", "Brave"],
  },
  {
    question: "How do you write CSS?",
    options: [
      "Mobile First",
      "Desktop First",
      "Component First",
      "Utility First",
      "CSS-in-JS",
    ],
  },
  {
    question: "Preferred monorepo tool?",
    options: ["Turborepo", "Nx", "Lerna", "Yarn Workspaces", "pnpm Workspaces"],
  },
  {
    question: "How do you validate data?",
    options: ["Zod", "Yup", "Joi", "JSON Schema", "Type Guards"],
  },
  {
    question: "Favorite code formatting tool?",
    options: ["Prettier", "ESLint", "StandardJS", "Rome", "Biome"],
  },
];
