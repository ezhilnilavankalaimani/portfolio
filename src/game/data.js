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
    sub: "Amazon · India · Jun 2018 – Feb 2021",
    bullets: [
      "Automation with SQL, XPath and Regex lifted processing accuracy by 35%",
      "Automated weekly reports with 90% coverage of key performance swings",
      "Spotlight and Star of the Month awards for outstanding performance",
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
      "Coursework: Data Analytics, Business Process Modeling, Databases, Project Management",
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
    sign: ["TD", "Apr 2024 – Present"],
    title: "Wealth Operations Officer III",
    sub: "TD, Toronto · Apr 2024 – Present",
    bullets: [
      "Took cheque processing from manual to 99% automation",
      "100% accuracy on RSP / TFSA transactions",
      "Q2 2026 Star Award · escalation point for high-risk items",
    ],
  },
};

export const SKILLS = [
  "Python",
  "SQL",
  "HTML",
  "Power BI",
  "Tableau",
  "Excel",
  "MS Project",
  "Visio",
  "QuickSight",
  "Regex",
  "Automation",
  "Reporting",
];

export const CERTS = [
  "Certified ScrumMaster (CSM) · Scrum Alliance · May 2025",
  "Excel 2019 badge · Pearson · Oct 2021",
  "Data Science SQL · UC Davis · Jun 2021",
  "Football Analytics with Python · May 2021",
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
  facebook: "https://www.facebook.com/iam.ezhilnilavan/",
  letterboxd: "https://letterboxd.com/EzhilNilavan/",
  instagram: "https://www.instagram.com/ezhilnilavan_/",
};

// Full resume detail shown when a visitor clicks an experience card
export const DETAILS = {
  td: {
    head: "Wealth Operations Officer III",
    org: "TD, Toronto · Apr 2024 – Present",
    points: [
      "Executed complex RSP and TFSA transactions (withdrawals, contributions, swaps, wires, in-kind, corrections) with 100% accuracy and timeliness, following regulatory requirements, policy guidelines, audit standards and SLAs.",
      "Processed high-volume financial and non-financial transactions across multiple banking platforms while keeping SLA targets and compliance.",
      "Awarded the Q2 2026 Star Award for Best Performance for taking the Symcor process to live production, eliminating manual intervention and training teammates.",
      "Monitored daily workflow, prioritized task distribution and gave operational support; consistently hit top departmental KPIs.",
      "Point of escalation for processing and operational issues; led investigations of complex, high-risk activity and worked with Risk, Compliance and IT on lasting fixes.",
      "Owns BWeb, EasyLine reconciliation and high-volume PIC file processing, keeping data balanced and discrepancies resolved on time.",
      "Designed Lean-based improvements and risk controls that cut error rates and lifted team productivity.",
      "Analyzed, tested and deployed operational enhancements and new procedures; documented and gave feedback on automation, system changes and macro development.",
      "Trained and coached new hires and interdepartmental transfers, supporting cross-training and knowledge transfer.",
    ],
  },
  amazon: {
    head: "Automation Analyst",
    org: "Amazon, India · Jun 2018 – Feb 2021",
    points: [
      "Built and ran automated workflows for large-scale data processing, using statistical techniques to produce accurate, risk-aware business insights.",
      "Automation with SQL, HTML parsing, XPath and Regular Expressions to extract, transform and validate high-volume data, improving processing accuracy by 35%.",
      "Designed, tested and shipped workflow automation frameworks for complex transaction processing, with error handling, logging and exception management.",
      "Worked with technical support, IT and cross-functional teams to troubleshoot, optimize and integrate automation pipelines with minimal downtime.",
      "Competitive intelligence and automated weekly reporting with 90% coverage of key performance swings, producing actionable callouts.",
      "UAT and regression testing of scripts, technical documentation, and Lean-based efficiency work.",
      "Managed individual automation projects end to end: requirements, feasibility, planning, implementation and tracking, cutting manual effort.",
      "Supported multi-regional Amazon marketplaces (US, Canada, Mexico) with scalable automation and monitoring scripts.",
      "Real-time dashboards in Power BI and Excel giving senior leadership insight into performance, risk and operational health.",
      "Internal automation training and coaching; led projects through all SDLC phases including smoke and UAT testing.",
      "Won the Spotlight and Star of the Month awards for outstanding performance.",
    ],
  },
  work: {
    head: "Customer & Technical Support",
    org: "Walmart (part-time) · Kelly Connect (remote) · 2022 – 2024",
    points: [
      "Customer Fulfillment Associate (OMNI), Walmart, Feb 2022 – Nov 2023, while studying at Conestoga.",
      "Technical Support Specialist, Kelly, Oct 2023 – Jan 2024, remote.",
      "Built client-relations and customer-experience skills in Canada before joining TD.",
    ],
  },
};

DETAILS.anna = {
  head: "B.E. Computer Science and Engineering",
  org: "Anna University, India · Graduated May 2018 · GPA 3.70",
  points: [
    "Coursework: Design and Analysis of Algorithms, Software Engineering, Compiler Design, Theory of Computation.",
    "General Secretary of the Computer Society of India Student Chapter.",
    "2nd place out of 25 teams in the Android application development workshop run by IIT Bombay.",
    "Won accolades for presenting the academic paper on Smart Irrigation at MIT and other renowned institutions in India.",
  ],
};
DETAILS.conestoga = {
  head: "Postgraduate, IT Business Analysis",
  org: "Conestoga College, Ontario · Sep 2021 – Dec 2022 · GPA 3.84",
  points: [
    "Coursework: Data Analytics, Business Process Modeling, Database Management Systems, Project Management.",
    "Distinguished GPA of 3.84 in Business Analysis (Fall 2022), top academic performance.",
    "Certified ScrumMaster (CSM), Scrum Alliance, May 2025.",
    "Data Science SQL, University of California, Davis, Jun 2021.",
    "Microsoft Excel 2019 Introductory badge, Pearson, Oct 2021.",
    "Football Analytics using Python, Mad About Sports, May 2021.",
  ],
};
DETAILS.today = {
  head: "Q2 2026 Star Award",
  org: "Wealth Operations Officer III · TD, Toronto",
  points: [
    "Received the Q2 Star Award for Best Performance at TD '26 for leading the live implementation of the Symcor process and training teammates.",
    "Took cheque processing to live production and removed manual intervention.",
    "100% accuracy on RSP and TFSA transactions, within regulatory, audit and SLA requirements.",
    "Tools: SQL, Python (exposure), HTML, Power BI, Tableau, advanced Excel and macros, MS Project, Visio, QuickSight.",
  ],
};
DETAILS.proj = {
  "TD Banking Analysis": {
    head: "TD Banking Analysis",
    org: "Toronto-Dominion Bank · Tableau, Excel, Visio",
    points: ["In-depth financial and operational analysis of the banking sector, automating data workflows to assess KPIs such as net interest margin, capital adequacy and liquidity ratios.",
      "Excel (macros, Power Query), Tableau and Visio used to streamline reporting, model financial scenarios and visualize banking process flows.",
      "Combined macroeconomic, regulatory and ESG data into automated, insight-driven recommendations for strategic decisions."],
  },
  "Smart Irrigation": {
    head: "Smart Irrigation",
    org: "ArcGIS, SWAT (Soil & Water Assessment Tool)",
    points: ["Built a Dynamic Programming decision model using remote-sensing GIS data and SWAT to optimize precision crop irrigation.",
      "Spatial-temporal analysis of historical land parameters in ArcGIS, joining multi-source datasets to compute crop-specific water needs and improve farm resource management."],
  },
};
