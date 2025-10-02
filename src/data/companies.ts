export interface Company {
  company: string;
  period: string;
  role: string;
  description: string;
  contributions: string[];
  tags: string[];
  logo?: string;
  logoAlt?: string;
}

export const companiesData: Company[] = [
  {
    company: "NFI Industries",
    period: "2017 - Present",
    role: "UX Designer & Frontend Developer",
    description: "NFI Industries is a leading supply chain solutions provider offering logistics, distribution, and transportation services across North America. As a key member of their technology team, I've been responsible for transforming complex logistics software into responsive and user-friendly interfaces.",
    contributions: [
      "Led the UX redesign of their Transportation Management System, improving task completion by 45%, faster onboarding and 97% reduction in user errors",
      "Created a comprehensive component library using LiveView and Tailwind CSS that accelerated development across multiple projects",
      "Collaborated with cross-functional teams to implement user-centered design processes, including regular usability testing sessions with actual users",
      "Helped develop and implement accessibility standards across all digital products"
    ],
    tags: ["UX Design", "LiveView", "Phoenix", "Elixir", "Tailwind CSS", "Design Systems"],
    logo: "/images/companies/nfi-project.jpg",
    logoAlt: "NFI Industries Logo"
  },
  {
    company: "Calamos Investments",
    period: "2015 - 2017",
    role: "Web Developer",
    description: "Calamos Investments is a global investment management firm specializing in alternative investments and risk-managing strategies. As their web developer, I was responsible for creating a cohesive digital presence for this respected financial firm.",
    contributions: [
      "Designed and developed the main corporate website, improving user engagement by 35% and reducing bounce rates by 28%",
      "Created an interactive financial dashboard that made complex investment data accessible to clients, increasing client engagement with financial reports",
      "Built multiple custom templates using Sitecore CMS templates, improving the efficiency of content updates by 60%",
      "Executed marketing initiatives by designing and implementing microsites and campaign landing pages with high conversion rates"
    ],
    tags: ["Web Development", "Sitecore CMS", "Bootstrap", "JavaScript", "Data Visualization", "Responsive Design"],
    logo: "/images/companies/calamos-project.jpg",
    logoAlt: "Calamos Investments Logo"
  },
  {
    company: "GKIC",
    period: "2012 - 2014",
    role: "Web Designer",
    description: "GKIC (Glazer-Kennedy Insider's Circle) is a leading provider of marketing training and resources for small businesses. I joined the company during a period of significant digital transformation, taking responsibility for creating and maintaining their web presence as they expanded their online offerings.",
    contributions: [
      "Created three new websites and redesigned four heavily utilized sites, including the main corporate website",
      "Developed wireframes, sitemaps, and mockups to provide clear direction for web projects",
      "Worked closely with project managers and backend developers to ensure projects remained on track and within budget",
      "Designed high-converting landing pages for marketing campaigns, contributing to a 25% increase in lead generation"
    ],
    tags: ["Web Design", "HTML/CSS", "WordPress", "Wireframing", "UI Design", "Marketing Design"],
    logo: "/images/companies/gkic-project.jpg",
    logoAlt: "GKIC Logo"
  },
  {
    company: "PMall",
    period: "2010 - 2012",
    role: "Web Designer",
    description: "PMail (PersonalizationMall) is a top 500 e-commerce retailer specializing in personalized gifts and merchandise. During my period of significant online growth, I joined their team to enhance the user experience and visual design of their e-commerce platform.",
    contributions: [
      "Developed UI, wireframes, sitemaps, and screen mockups for an e-commerce platform handling millions in annual sales",
      "Redesigned the product customization interface, resulting in a 22% increase in completed orders",
      "Managed site updates and designed various online materials, including logos and branding materials",
      "Conducted user interviews and usability tests to gather insights, which informed significant UX improvements"
    ],
    tags: ["E-commerce", "UI Design", "User Research", "Graphic Design", "Usability Testing", "Conversion Optimization"], 
    logo: "/images/companies/pmall-project.jpg",
    logoAlt: "PMall Logo"
  }
];