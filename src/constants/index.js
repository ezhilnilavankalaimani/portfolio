import {
    mobile,
    backend,
    database,
    web,
    javascript,
    java,
    html,
    css,
    reactjs,
    redux,
    tailwind,
    nodejs,
    mongodb,
    git,
    adobe,
    walmart,
    SI,
    td,
    kelly,
    popeyes,
    conestoga,
    anna,
    growth,
    cap,
    amazon,
    farmer,
    telecom,
    chatapp,
    threejs,
    game,
    symcor
  } from "../assets";
  
  export const navLinks = [
    {
      id: "about",
      title: "About",
    },
    {
      id: "education",
      title: "Education",
    },
    {
      id: "work",
      title: "Work",
    },
    {
      id: "contact",
      title: "Contact",
    },
  ];
  
  const services = [
    {
      title: "Analyst",
      icon: web,
    },
    {
      title: "Automation Specialist",
      icon: mobile,
    },
    {
      title: "Business Development Analyst",
      icon: backend,
    },
    {
      title: "Data Analyst",
      icon: database,
    },
  ];
  
  const technologies = [
    {
      name: "SQL",
      icon: html,
    },
    {
      name: "REGRESSION",
      icon: css,
    },
    {
      name: "PYTHON",
      icon: javascript,
    },
    {
      name: "EXCEL",
      icon: java,
    },
    {
      name: "POWERBI",
      icon: reactjs,
    },
    {
      name: "TABLEAU",
      icon: redux,
    },
    {
      name: "git",
      icon: git,
    },
    {
      name: "Adobe",
      icon: adobe,
    },
  
  ];
  
  const experiences = [
    {
      title: "Wealth Operations Officer III",
      company_name: "TD, Toronto",
      icon: td,
      iconBg: "#55B94B",
      date: "Dec 2024 - Present",
      points: [
        "Process complex RSP and TFSA transactions (withdrawals, contributions, swaps, wires, in-kind and corrections) with 100% accuracy and timeliness, within regulatory, audit and SLA requirements.",
        "Won the Q2 2026 Star Award for Best Performance for taking the Symcor process live in production and eliminating manual intervention.",
        "Own BWeb, EasyLine reconciliation and high-volume PIC file processing, keeping data balanced and discrepancies resolved on time.",
        "Act as the point of escalation for complex, high-risk items, investigating and documenting exceptions with Risk, Compliance and IT.",
        "Drive Lean-based improvements and risk controls that reduced error rates and improved team productivity.",
        "Monitor daily workflow, prioritize task distribution and support the team so service levels are met, consistently achieving top departmental KPIs.",
        "Analyze, develop, test and deploy operational enhancements and new procedures, with documentation and feedback for automation, system changes and macro development.",
        "Train and coach new hires and interdepartmental transfers, supporting cross-training and knowledge transfer.",
      ],
    },
    {
      title: "Wealth Operations Officer II",
      company_name: "TD, Toronto",
      icon: td,
      iconBg: "#55B94B",
      date: "Apr 2024 - Dec 2024",
      points: [
        "Executed transactions accurately and on time, in line with established guidelines and procedures, while meeting formal and informal Service Level Agreements (SLAs).",
      ],
    },
    {
      title: "Technical Support Specialist",
      company_name: "Kelly Science, Engineering, Technology & Telecom (Remote, Full-time)",
      icon: kelly,
      iconBg: "#FFFFFF",
      date: "Oct 2023 - Jan 2024",
      points: [
        "Remote, full-time technical support. Skills: iOS, Client Relations.",
      ],
    },
    {
      title: "Customer Fulfillment Associate (OMNI)",
      company_name: "Walmart, Waterloo (Part-time)",
      icon: walmart,
      iconBg: "#E6DEDD",
      date: "Feb 2022 - Nov 2023",
      points: [
        "Meeting the customers' needs and delivering them their respective online • grocery orders..",
        "Changing and adapting to the constantly evolving working condition..",
        "Attend to the customer's concerns if they have complaints about their order.",
        "Letting customers know that their order is ready if it is ready ahead of time.",
      ],
    },
    {
      title: "Crew Member and Cook",
      company_name: "Popeyes Louisiana Kitchen, Kitchener (Contract, Part-time)",
      icon: popeyes,
      iconBg: "#FFFFFF",
      date: "Dec 2021 - Jan 2022",
      points: [
        "Customer-facing contract role. Skills: Customer Experience.",
      ],
    },
    {
      title: "Automation Analyst",
      company_name: "Amazon, India (Greater Chennai Area)",
      icon: amazon,
      iconBg: "#FFFFFF",
      date: "Jun 2018 - Feb 2021",
      points: [
        "Engineered and executed automated workflows for large-scale data processing, applying statistical techniques to derive high-accuracy, risk-mitigated business insights.",
        "Developed and deployed automation using SQL, HTML parsing, XPath and Regular Expressions to extract, transform and validate high-volume data sets, improving processing accuracy by 35%.",
        "Designed, tested and implemented workflow automation frameworks for complex transaction processing, with error handling, logging and exception management for production-ready solutions.",
        "Collaborated with technical support, IT and cross-functional teams to troubleshoot, optimize and integrate automation pipelines, ensuring scalability and minimal downtime.",
        "Conducted competitive intelligence and automated weekly reporting pipelines, achieving 90% coverage in monitoring key performance fluctuations and generating actionable business callouts.",
        "Conducted UAT and regression testing of automation scripts, maintained detailed technical documentation, and improved operational efficiency using Lean principles.",
        "Managed the full lifecycle of individual automation projects, including requirements gathering, feasibility analysis, resource planning, implementation and performance tracking, reducing manual effort.",
        "Supported multi-regional Amazon marketplaces (US, Canada, Mexico) with scalable automation frameworks and monitoring scripts to keep data integrity and platform efficiency consistent.",
        "Collaborated with engineering and operations teams to find automation opportunities, delivering solutions that improved SLA adherence and system throughput.",
        "Delivered internal automation training and knowledge-transfer sessions, enabling faster onboarding, process standardization and stronger team technical skills.",
        "Developed real-time dashboards and reporting tools in Power BI and Excel to track performance, risk and operational health for senior leadership.",
        "Led projects through all SDLC phases, from requirements gathering to deployment, with smoke and UAT testing for quality and accuracy.",
        "Oversaw variance management, facilitated meetings and designed performance dashboards to track profitability and efficiency gains.",
        "Received the 'Spotlight' and 'Star of the Month' awards at Amazon, India for outstanding performance.",
      ],
    },
  ];

  const education = [
    {
      title: "Bachelor of Engineering, Computer Science and Engineering",
      company_name: "Anna University, India (GPA 3.70)",
      icon: anna,
      iconBg: "#FFFFFF",
      date: "2014 - May 2018",
      points: [
        "Coursework: Design and Analysis of Algorithms, Software Engineering, Compiler Design, Theory of Computation.",
        "General Secretary of the Computer Society of India Student Chapter.",
        "2nd place out of 25 teams in the Android application development workshop conducted by IIT Bombay.",
        "Presented the 'Smart Irrigation' paper at MIT and other renowned institutions in India.",
      ],
    },
    {
      title: "Courses & Certifications",
      company_name: "Self-paced learning",
      icon: growth,
      iconBg: "#0A8A35",
      date: "2021",
      points: [
        "Certification in Football Analytics using Python (Mad About Sports), May 2021.",
        "Certification in Data Science SQL (University of California, Davis), June 2021.",
        "Microsoft Excel 2019 Introductory exam badge (Pearson), Oct 2021.",
      ],
    },
    {
      title: "Postgraduate, Information Technology Business Analysis",
      company_name: "Conestoga College, Ontario (Full-time study, GPA 3.84 - Distinction)",
      icon: conestoga,
      iconBg: "#231F20",
      date: "Sep 2021 - Dec 2022",
      points: [
        "Completed a postgraduate program with a 3.84 GPA (Distinction) while working part-time.",
        "Coursework: Advanced Data Analytics, Software Integration, Risk Analysis, Service Management, IT Infrastructure, ERP, UI/UX, Requirements Modeling and Visualization, SQL and Data Analysis, Business Process Analysis.",
      ],
    },
    {
      title: "Certified ScrumMaster (CSM)",
      company_name: "Scrum Alliance",
      icon: growth,
      iconBg: "#0A8A35",
      date: "May 2025",
      points: [
        "Earned the Certified ScrumMaster (CSM) designation from the Scrum Alliance.",
      ],
    },
  ];
  
  const testimonials = [
    {
      testimonial:
        "Received the Q2 2026 Star Award at TD for automating the Symcor cheque process, moving it from manual handling to full automation.",
      name: "Q2 2026 Star Award",
      subtitle: "Recognition at Toronto-Dominion Bank",
      company: "TD",
      image: td,
    },
    {
      testimonial:
        " Ezhil, our Automation Analyst, with three years of dedicated service at Amazon, consistently impressed with their automation prowess. His insights, problem-solving skills, and commitment to streamlining processes greatly contributed to our team's success and overall operational excellence. A valuable asset!.",
      name: "Mohan Kumar",
      designation: "Project Manager",
      company: "Amazon",
      image: "https://1000logos.net/wp-content/uploads/2016/10/Amazon-logo-meaning.jpg",
    },
    {
      testimonial:
        "I had the privilege of working closely with Ezhil Nilavan for three years at Amazon. His exceptional expertise as an automation analyst improved our efficiency through innovative solutions, making him highly recommended for automation projects.",
      name: "Manikandan",
      designation: "Team Leader",
      company: "Amazon",
      image: "https://1000logos.net/wp-content/uploads/2016/10/Amazon-logo-meaning.jpg",
    },
    {
      testimonial:"Ezhil Nilavan has been an integral part of our automation team at Amazon for the past three years, and their impact has been nothing short of impressive. His understanding to analyze complex processes, design effective automation strategies, and execute projects with precision is commendable. His attention to detail and commitment to quality consistently exceeded expectations.",
      name: "Oviya",
      designation: "Software Developer",
      company: "Amazon",
      image: "https://1000logos.net/wp-content/uploads/2016/10/Amazon-logo-meaning.jpg"
    },

  ];
  
  const projects = [
    {
      name: "Symcor Cheque Processing Automation",
      description:[
        "Automated the end-to-end Symcor cheque process at TD, taking it from a fully manual workflow to 99% automation.",
        "Covers the complete flow: cheque verification, Accept / Review / Reject actions, Letter of Direction (LOD) tracking, rejection and return handling, and daily All Items / Reject reporting.",
        "Documented the full process in a detailed SOP with timelines, quality checks and risk controls, so the team can run and audit it consistently.",
      ],
      tags: [
        {
          name: "Process Automation",
          color: "blue-text-gradient",
        },
        {
          name: "Symcor",
          color: "green-text-gradient",
        },
        {
          name: "SOP Documentation",
          color: "pink-text-gradient",
        },
      ],
      image: symcor,
      source_code_link: "#",
    },
    {
      name: "Toronto-Dominion Bank",
      description:[
            "Analyzed the financial statements of the Banking environment and came up with suggestions and opportunities to increase the organization's growth through proper analysis and understanding",
            "Analysis was made from all aspects, including the political and environmental based analysis.",
            

      ],
      tags: [
        {
          name: "Tableau",
          color: "blue-text-gradient",
        },
        {
          name: "Excel",
          color: "green-text-gradient",
        },
        {
          name: "Visio",
          color: "pink-text-gradient",
        },
      ],
      image: farmer,
      source_code_link: "#",
    },
    {
      name: "Smart Irrigation",
      description:[
      "To provide a Dynamic Programming decision model based on remote sensing GIS data analytics for the irrigation of crops",
      "This project analyzes historical data on various parameters of a land region. Aggregating the details of the multiple operations, the system will compute and quantify the amount of water needed for the crops, in general, for the farm.",
      

  ],
      tags: [
        {
          name: "ArcGIS",
          color: "blue-text-gradient",
        },
        {
          name: "SWAT (Soil & Water Assessment Tool)",
          color: "green-text-gradient",
        },
        
      ],
      image: telecom,
      source_code_link: "#",
    },
    {
      name: "System/Process Actors and Interaction",
      description:[
         "This project’s Primary purpose is to documentation and use of tools as data analyst",
         "From this project I achieved documenting call centre process and Diagram by using Visio showing interactions between call centre operation",
         
        ],
      tags: [
        {
          name: "Visio",
          color: "blue-text-gradient",
        },
        {
          name: "Excel",
          color: "green-text-gradient",
        },
        {
          name: "Tableau",
          color: "pink-text-gradient",
        },
      ],
      image: chatapp,
      source_code_link: "#",
    },
    {
      name: "Starbucks",
      description:[
            "The project aims to identify Starbucks' major customer demographics across various regions in Canada.",
            "Through comprehensive data analysis, we will discern patterns in customer preferences, age groups, and buying behavior",
            "By analyzing sales data, social media interactions, and customer surveys, we will pinpoint key customer segments in each region",
            "This insight will enable Starbucks to tailor its marketing strategies, menu offerings, and store layouts to better cater to the specific needs and tastes of customers in different Canadian regions, ultimately enhancing customer satisfaction and brand loyalty"

      ],
      tags: [
        {
          name: "SQL",
          color: "blue-text-gradient",
        },
        {
          name: "Power BI",
          color: "pink-text-gradient",
        },
        {
          name: "Excel",
          color: "pink-text-gradient",
        },
      ],
      image: game,
      source_code_link: "#",
    },
  ];
  
  export { services, technologies, experiences, education, testimonials, projects };
