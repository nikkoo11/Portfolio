export interface Profile {
  name: string;
  initials: string;
  shortTitle: string;
  title: string;
  description: string;
  image: string;
  address: string;
  email: string;
  phone: string;
  githubUrl: string;
  linkedinUrl: string;
  facebookUrl: string;
  instagramUrl: string;
  cvUrl: string;
}

export interface Project {
  id: number;
  title: string;
  category: string;
  year: string;
  description: string;
  tags: string[];
  image: string;
  live: string;
  github: string;
  hardwareSim?: boolean;
}

export interface SkillCategory {
  frontend: { name: string; level: number }[];
  backend: { name: string; level: number }[];
  tools: { name: string; level: number }[];
}

export interface Achievement {
  title: string;
  year: string;
  icon: string;
  description: string;
}

export interface Certificate {
  title: string;
  issuer: string;
  date: string;
  description: string;
  link: string;
}

export const portfolioData = {
  profile: {
    name: "Jericho Fragata",
    initials: "JF",
    shortTitle: "4th-Year Computer Engineering Student",
    title: "4th-Year Computer Engineering Student | Aspiring Developer",
    description: "Behind every great digital experience is a rock-solid system architecture. As a 4th-year Computer Engineering student at Cagayan State University and a proud alumnus of Bambang National High School, based in Caliguian, Burgos, Isabela, Philippines, I explore the intersection of embedded hardware and modern web engineering. Eager, highly motivated, and deeply willing to learn every day, I am constantly growing—from building robotics and microcontroller designs to crafting web applications with Vue 3.",
    image: "src/assets/avatar1.jpg",
    address: "Caliguian, Burgos, Isabela, Philippines",
    email: "jerichofragata811@gmail.com",
    phone: "+63 967 258 2102",
    githubUrl: "https://github.com/nikkoo11",
    linkedinUrl: "https://www.linkedin.com/in/jericho-fragata-1912b0442/",
    facebookUrl: "https://www.facebook.com/share/1DqL5MsQYu/",
    instagramUrl: "https://www.instagram.com/?hl=en",
    cvUrl: "/resume.pdf"
  } as Profile,

  projects: [
    {
      id: 1,
      title: "Line Follower Robot",
      category: "Embedded Systems",
      year: "2026",
      description: "Autonomous line-following robot with real-time path correction using infrared sensors and PID control algorithms.",
      tags: ["Arduino", "C++", "PID Control", "Robotics"],
      image: "src/assets/LineFollower.jpg",
      live: "#",
      github: "https://github.com/nikkoo11",
      hardwareSim: true
    },
    {
      id: 2,
      title: "PIC Board Microcontroller PCB Design",
      category: "Electronics",
      year: "2025",
      description: "Design and fabrication of a custom PIC microcontroller PCB for IoT applications, including sensor integration and wireless communication.",
      tags: ["KiCad", "PCB Design", "IoT", "Embedded Systems"],
      image: "src/assets/PicBoard.jpg",
      live: "#",
      github: "https://github.com/jerichofragata",
      hardwareSim: true
    },
    {
      id: 3,
      title: "Logic Gates Simulation",
      category: "Digital Electronics",
      year: "2025",
      description: "Interactive simulation of basic logic gates and combinational circuits, allowing users to visualize and test digital logic designs.",
      tags: ["JavaScript", "HTML5", "CSS3", "Digital Logic"],
      image: "src/assets/LogicGates.jpg",
      live: "#",
      github: "https://github.com/jerichofragata",
      hardwareSim: true
    }
  ] as Project[],

  skills: {
    frontend: [
      { name: "C++ / C (Embedded)", level: 70 },
      { name: "Python", level: 65 },
      { name: "Java", level: 60 },
      { name: "Vue 3 & Composition API", level: 65 },
      { name: "TypeScript / JavaScript", level: 60 },
      { name: "Tailwind CSS", level: 70 },
      { name: "HTML5 / CSS3", level: 75 }
    ],
    backend: [
      { name: "Node.js & Express", level: 50 },
      { name: "PostgreSQL / MongoDB", level: 45 },
      { name: "REST APIs", level: 55 }
    ],
    tools: [
      { name: "Git & GitHub", level: 60 },
      { name: "KiCad & PCB Design", level: 65 },
      { name: "Vite", level: 60 }
    ]
  } as SkillCategory,

  achievements: [
    {
      title: "OJT Internship Completed",
      year: "2026",
      icon: "fa-solid fa-briefcase",
      description: "Successfully completed a 1-month On-the-Job Training at Abana Computer Services and Merchandise, gaining hands-on technical support and IT service experience."
    },
    {
      title: "Bambang National High School Alumnus",
      year: "Secondary Graduate",
      icon: "fa-solid fa-graduation-cap",
      description: "Completed secondary education building foundational academic and technical interests."
    }
  ] as Achievement[],

  certificates: [
    {
      title: "TESDA NC II Assessment Candidate",
      issuer: "Technical Education and Skills Development Authority",
      date: "2026",
      description: "Undergoing national certification assessment for technical systems servicing, hardware diagnostics, and network configuration.",
      link: "#"
    },
    {
      title: "Occupational Safety and Health (OSH) Certificate",
      issuer: "Safety Training Authority",
      date: "2025",
      description: "Completed safety compliance training covering workplace hazards, engineering safety protocols, and standard operational procedures.",
      link: "#"
    },
    {
      title: "Introduction to Embedded Systems",
      issuer: "University Coursework",
      date: "2025",
      description: "Foundational training in microcontroller programming and hardware interfacing.",
      link: "#"
    }
  ] as Certificate[]
};