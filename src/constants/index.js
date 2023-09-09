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
    VT,
    farmer,
    telecom,
    chatapp,
    threejs,
    game
  } from "../assets";
  
  export const navLinks = [
    {
      id: "about",
      title: "About",
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
      title : "Automation Analyst",
      company_name: "Amazon",
      icon: VT,
      date : "June 2018- Feb 2021",
      points: [
       "Processed extensive data to evaluate and produce risk-free solutions using various statistical techniques and was involved in quality processes and support during the sale period to establish, monitor and streamline quality processes in the project.",
      "Debugged and analyzed e-commerce and other online competitors with the employer and designed and created weekly business reports with callouts on Spike / Low. Performed feasibility analysis and provided estimates to implement the new functionality.",
   " Drove weekly business meet coordinated with stakeholders to manage portfolios ",
"  Created an Automated Mapping Efficiency report to review metric performance, identify trends and irregularities and develop and implement plans to address the issue. ",
       " Executed and reported week-on-week mapping variance and gap analysis and drove weekly business meets, coordinated with stakeholders to manage portfolios, and designed dashboards to have accurate data insights on mapping efficiency to improve processes. ",
        "Involved in process-level training for new employees and on-boarded them to BAU",
        "Involved in end-to-end management of assigned projects in compliance to project delivery schedules and enhanced project profitability through implementing effective project plans and resource and mitigation plans based on anticipated project risks.",
        "Undertook the Turing project, implemented and tested enhancement features",
        "During my 3 years, I have worked on different teams and monitored region specific amazon sales in the United States, Denmark, France, Canada and Mexico"
      ]
    },
    {
      title: "OMNI",
      company_name: "Walmart",
      icon: walmart,
      iconBg: "#E6DEDD",
      date: "March 2022 - Present",
      points: [
        "Meeting the customers' needs and delivering them their respective online • grocery orders..",
        "Changing and adapting to the constantly evolving working condition..",
        "Attend to the customer's concerns if they have complaints about their order.",
        "Letting customers know that their order is ready if it is ready ahead of time.",
      ],
    },
  ];
  
  const testimonials = [
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
  
  export { services, technologies, experiences, testimonials, projects };