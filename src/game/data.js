// Content for the game version of the site. Edit text here.

export const GREETINGS = [
  "Hello",
  "வணக்கம் · Vanakkam",
  "नमस्ते · Namaste",
  "నమస్కారం · Namaskaram",
  "നമസ്കാരം · Namaskaram",
  "Bonjour",
  "Hola",
  "こんにちは · Konnichiwa",
  "你好 · Nǐ hǎo",
  "مرحبا · Marhaba",
  "Hallo",
  "Ciao",
];

export const PAGES = [
  { id: "home", label: "Home" },
  { id: "amazon", label: "Amazon" },
  { id: "conestoga", label: "Conestoga" },
  { id: "work", label: "Walmart · Kelly" },
  { id: "td", label: "TD" },
  { id: "today", label: "Today" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "testimonials", label: "Testimonials" },
  { id: "contact", label: "Contact" },
];

export const NAV = [
  { label: "Home", page: 0 },
  { label: "Journey", page: 1 },
  { label: "Skills", page: 6 },
  { label: "Projects", page: 7 },
  { label: "Testimonials", page: 8 },
  { label: "Contact", page: 9 },
];

export const STAGES = {
  amazon: {
    n: 1,
    sign: ["AMAZON · CHENNAI", "2018 – 2021"],
    title: "Automation Analyst",
    sub: "Amazon · Greater Chennai · Feb 2020 – Feb 2021",
    bullets: [
      "Built an automated Mapping Efficiency report to spot trends and irregularities",
      "Ran week-on-week mapping variance and gap analysis for stakeholders",
      "Monitored sales across the US, Denmark, France, Canada and Mexico",
    ],
  },
  conestoga: {
    n: 2,
    sign: ["CONESTOGA COLLEGE", "2021 – 2022"],
    title: "IT Business Analysis",
    sub: "Conestoga College · Postgraduate · Sep 2021 – Dec 2022",
    bullets: [
      "Postgraduate program in IT Business Analysis",
      "GPA 3.84, graduated with Distinction",
      "Studied while working part-time at Walmart",
    ],
  },
  work: {
    n: 3,
    sign: ["WALMART · KELLY", "2022 – 2024"],
    title: "Customer & Technical Support",
    sub: "Walmart (part-time) · Kelly Connect (remote)",
    bullets: [
      "Customer Fulfillment Associate (OMNI), Walmart, Feb 2022 – Nov 2023",
      "Technical Support Specialist, Kelly, Oct 2023 – Jan 2024",
      "Built client-relations and customer-experience skills in Canada",
    ],
  },
  td: {
    n: 4,
    sign: ["TD · SYMCOR", "Apr 2024 – Present"],
    title: "Analyst",
    sub: "Toronto-Dominion Bank · Symcor cheque processing",
    bullets: [
      "Took cheque processing from manual to 99% automation",
      "100% accuracy on RSP / TFSA transactions",
      "Q2 2026 Star Award · go-to for high-risk escalations",
    ],
  },
};

export const SKILLS = [
  "Python",
  "SQL",
  "Power BI",
  "Tableau",
  "Excel",
  "Visio",
  "Regex",
  "Automation",
  "Reporting",
];

export const PROJECTS = [
  {
    name: "Symcor Cheque Automation",
    text: "Took the full cheque process from manual to 99% automation, documented in a detailed SOP.",
    tags: ["Automation", "Symcor"],
  },
  {
    name: "TD Banking Analysis",
    text: "Analyzed banking financial statements and identified opportunities to support growth.",
    tags: ["Tableau", "Excel", "Visio"],
  },
  {
    name: "Smart Irrigation",
    text: "Dynamic programming decision model using remote sensing data to plan crop irrigation.",
    tags: ["ArcGIS", "SWAT"],
  },
  {
    name: "Process Actors & Interaction",
    text: "Documented call centre processes with Visio diagrams of the interactions.",
    tags: ["Visio", "Excel", "Tableau"],
  },
  {
    name: "Starbucks Customer Study",
    text: "Identified major customer demographics across regions in Canada from sales and survey data.",
    tags: ["SQL", "Power BI", "Excel"],
  },
];

export const LINKS = {
  linkedin: "https://www.linkedin.com/in/ezhil-nilavan/",
  github: "https://github.com/ezhilnilavankalaimani",
  email: "mailto:iamezhilnilavan@gmail.com",
};
