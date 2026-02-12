import { CVData } from './types';

export const INITIAL_CV_DATA: CVData = {
  name: "Rob Guard",
  title: "Innovative FinTech & AI Leadership",
  profileImage: "https://lh3.googleusercontent.com/d/1aYEE_t-baxMQA20R-_Fxb8zKTDF7XA80",
  pdfUrl: "https://drive.google.com/file/d/1--9mHt6d6rfX5PtGQB6S21jJmZzzFOaV/view?usp=drive_link",
  contact: {
    phone: "07929 051 831",
    email: "robguardjr@gmail.com",
    linkedin: "linkedin.com/in/robguard"
  },
  heroBlurb: "Bridge the gap between complex engineering and enterprise value. I bring a unique perspective at intersection of product vision, technical depth, and commercial acumen. I architect and grow scalable operating models that deliver AI-driven moats with measurable P&L impact.",
  summary: "I've 2 decades of experience leading and growing product domains in tech from public sector & government all the way to start-ups and fintech. I have grown, coached and led high performing product teams that delivered meaningful impact to ARR, deeply understand engineering, and bring commercial & customer awareness to every conversation. I've grown 0 to 10, and worked at scale in 10-100 environments, leading expansive domains with multiple teams, manager of manager, and operational headcount from 50-100.\n\nMost recently I've been leading a broad domain of Spend and Control at Pleo (auth, spend policy, assurance, accounts payable, procurement, employee spend & mobile, AI teams) primarily focussing on optimising churn reduction and increasing our operational efficiency, with previous experience heading up Product & Treasury at Runa (Funding, Payments, FinOps, Ledger) where I led global expansion into 30+ new markets and created new scalable ARR lines, and earlier led the launch of Curve's first credit product to the masses, demonstrating low risk adoption + securing a £1bn credit facility.",
  experience: [
    {
      id: "pleo",
      company: "PLEO",
      role: "SENIOR DIRECTOR OF PRODUCT",
      location: "LONDON, REMOTE",
      startDate: "AUG 25",
      endDate: "PRESENT",
      description: "Strategic direction across 6 domains, positioning AI and agentic policy control as a core competitive moat to retain market leadership. Scaled team with 4 senior hires and introduced AI prototyping into the discovery process, accelerating solution design and time to market.",
      highlights: [
        "Launched an AI enforcement strategy achieving 91% accuracy automating the detection of anomalous spend, automating compliance for finance teams, and integrating into spend rules.",
        "Pivoted the stagnant Accounts Payable and Vendor Management solution toward incremental value over a 90-day play in core markets, resulting in 28% reduction in net churn and reduced support load.",
        "Overhauled delivery lifecycle from 6-month to 6-week cadence and drove AI discovery agent tooling project to increase teams’ discovery and delivery velocity."
      ],
      skills: ["Churn Reduction", "AI Led Strategy Development", "Market Expansion"],
      tags: ["B2B", "SAAS", "SPEND", "POLICY", "ACCOUNTS PAYABLE", "CASHFLOW", "ANALYTICS", "AI"]
    },
    {
      id: "runa",
      company: "RUNA",
      role: "HEAD OF PRODUCT",
      location: "LONDON",
      startDate: "OCT 22",
      endDate: "JUL 25",
      description: "Identified and executed commercialisation opportunities, diversifying revenue streams & reducing overheads. Fuelled global expansion, adding 60million (8%) annual volume and 1million annual revenue. Hired and led a team of Senior Product Managers, adopting experiment-based discovery.",
      highlights: [
        "Formulated strategy across teams, led research on regulatory hurdles & strategic partners to launch operations in 17 new markets across APAC, LatAm and the Middle East.",
        "Influenced across the business to operationalise cross-functional teams, reducing time to market from 16+ to 4 weeks, resulting in 80+ hours/week operational overhead reduction.",
        "Launched on-platform FX in 40 currencies, driving 50+ uplift in revenue across 100million volume."
      ],
      skills: ["FX", "Virtual Accounts", "Accounts Payable", "Global Expansion (EMEA, Asia, LatAm)", "Billing Optimisation", "Core Ledger"],
      tags: ["B2B2B2C", "SAAS", "PAYMENTS", "TREASURY", "FUNDING", "OPERATIONS", "AI", "ACCOUNTS PAYABLE"]
    },
    {
      id: "curve",
      company: "CURVE",
      role: "GROUP PRODUCT MANAGER (HEAD OF)",
      location: "LONDON",
      startDate: "JUN 21",
      endDate: "AUG 22",
      description: "Launched Curve Flex in 4 months; a pioneering buy-now-pay-later instalment loan product for historic purchases, and grew to a 1billion facility. Collaborated closely with legal, risk, compliance and FCA teams to navigate regulatory requirements and ensure full compliance.",
      highlights: [
        "Established 4 high-performing teams, using rapid discovery/execution cycles and targeted marketing strategies, achieving rapid user acquisition with over 20,000 engaged users.",
        "Demonstrated viability and scalability with 50million in new loans, pivotal in securing a 1billion credit facility to scale into lucrative EU and US markets.",
        "Fostered a culture of focus & accountability, resulting in aligned teams that felt empowered to voice ideas and contribute to driving results."
      ],
      skills: ["Mobile Onboarding", "B2B Loans", "B2C BNPL Loans", "Flex Credit Card", "Balance Transfers", "Loan Management CX Platform", "Credit Risk Reduction"],
      tags: ["B2C", "B2B", "MOBILE", "CONSUMER CREDIT", "BNPL"]
    },
    {
      id: "capitalise",
      company: "CAPITALISE",
      role: "VP PRODUCT & PLATFORM",
      location: "LONDON",
      startDate: "MAR 18",
      endDate: "MAY 21",
      description: "Spearheaded strategic initiatives to create new revenue opportunities and leveraged data to drive significant revenue growth and churn reduction. Led product, data and platform teams to deliver innovative funding & advisory solutions.",
      highlights: [
        "Led formulation and execution of an enterprise lending platform and embedded finance platform driving a 4x increase in engagement and 15% incremental ARR.",
        "Designed and launched a unified specification integrating tier 1 banks and fintech lenders, providing instant pricing across multiple products."
      ],
      skills: ["Embedded Finance", "Multi-lender Quotes", "Re-platforming", "Funding Advisory", "Marketplace Search", "Enterprise Launch"],
      tags: ["B2B", "SAAS", "MARKETPLACE", "COMMERCIAL CREDIT"]
    },
    {
      id: "futrli",
      company: "FUTRLI",
      role: "CHIEF PRODUCT OFFICER (EXIT TO SAGE)",
      location: "BRIGHTON",
      startDate: "JUL 15",
      endDate: "FEB 18",
      description: "Propelled user and revenue growth from 2,000 to 25,000 SaaS customers, coaching 5 product, engineering and design teams into a highly performing squad model and instilling R&D led product frameworks.",
      highlights: [
        "Instrumental in scaling the product function leading to a successful exit to Sage.",
        "Developed AI forecasting and reporting dashboards that became core differentiators."
      ],
      skills: ["AI (ML) Forecasting", "Report Builder", "Credit Forecasting", "Flexible Dashboards"],
      tags: ["B2B", "SAAS", "CASHFLOW", "FORECASTING", "REPORTING"]
    },
    {
      id: "tlm-nexus-pm",
      company: "TLM NEXUS",
      role: "PROGRAMME MANAGER",
      location: "BRIGHTON",
      startDate: "SEP 14",
      endDate: "APR 15",
      description: "Overall responsibility for the analysis & design across 15 products. Managed 6 senior analysts, with ongoing involvement in sales & R&D for emerging opportunities.",
      highlights: [],
      skills: ["Fields Ops Support", "Air & Sea", "Systems Design", "Business Analysis"],
      tags: ["B2B", "GOVERNMENT", "DEFENCE", "PROGRAMME MANAGEMENT"]
    },
    {
      id: "tlm-nexus-ha",
      company: "TLM NEXUS",
      role: "HEAD OF ANALYSIS",
      location: "BRIGHTON",
      startDate: "OCT 12",
      endDate: "AUG 14",
      description: "Led the business analysis function for complex defence projects, ensuring technical requirements met operational needs.",
      highlights: [],
      skills: ["Fields Ops Support", "Air & Sea", "Systems Design", "Business Analysis"],
      tags: ["B2B", "GOVERNMENT", "DEFENCE", "PROGRAMME MANAGEMENT"]
    },
    {
      id: "mitie",
      company: "MITIE",
      role: "BUSINESS ANALYST & IT PROJECTS MANAGER",
      location: "BRISTOL",
      startDate: "AUG 09",
      endDate: "MAY 11",
      description: "Researched, designed and delivered award-winning service solutions to international airports driving direct saving in excess of £1.5mio/year.",
      highlights: [
        "Managed full lifecycle from project definition and design to delivery and hardware setup.",
        "Provided on-site training for complex operational systems."
      ],
      skills: ["Facilities Management", "Heathrow Passengers with Reduced Mobility", "Luton PRM", "Gatwick PRM", "West Midlands Ambulance Maintenance", "London Museum Cleaning Scheduling"],
      tags: ["B2B", "AIRPORTS", "OPERATIONS"]
    }
  ],
  education: [
    {
      id: "bmth",
      degree: "BSc HONS BUSINESS INFORMATION SYSTEMS MANAGEMENT",
      institution: "BOURNEMOUTH UNIVERSITY",
      years: "2005 — 2009"
    }
  ],
  awards: [
    {
      id: "bifm",
      title: "BIFM INNOVATION IN CUSTOMER SERVICE",
    },
    {
      id: "gold",
      title: "GOLD GLOBAL FM AWARD FOR EXCELLENCE"
    }
  ],
  principles: [
    {
      id: "p1",
      title: "AI AND AGENTIC WORKFLOWS",
      description: "Discover and build use cases where agentic AI can drive efficiency and delight for both product and customer tasks."
    },
    {
      id: "p2",
      title: "VELOCITY AS A STRATEGY",
      description: "Reducing delivery cycles from months to weeks. Fast iterations allow for real-world testing and faster product-market fit."
    },
    {
      id: "p3",
      title: "DATA-DRIVEN DECISIVENESS",
      description: "Leveraging deep insights to move beyond simple behaviour improvements toward fundamental business model innovation."
    },
    {
      id: "p4",
      title: "DISTRIBUTED OWNERSHIP",
      description: "Empowering cross-functional teams to own outcomes, not just outputs, fostering a culture of accountability and innovation."
    }
  ],
  interests: [
    {
      id: "i1",
      title: "EXPLORING EMERGING TECHNOLOGIES",
      description: "Passionate about how blockchain, generative AI, and open banking create societal impact, particularly in expanding access to financial services."
    },
    {
      id: "i2",
      title: "DATA-DRIVEN CURIOSITY",
      description: "Enjoy researching data-driven projects, from investment simulations to algorithms that simplify financial decision-making for underserved communities."
    },
    {
      id: "i3",
      title: "MENTORING AND GROWTH ADVICE",
      description: "Mentor several product managers at startups, focused on democratising knowledge and leveraging technology to bridge financial literacy gaps."
    },
    {
      id: "i4",
      title: "CREATIVE PROBLEM-SOLVING",
      description: "Applying iterative design and abstract thinking to transform complex ideas into tangible, scalable solutions."
    },
    {
      id: "i5",
      title: "PROMOTING FINANCIAL EMPOWERMENT",
      description: "Acting as a trusted advisor on personal finance, financial planning, and investment strategies across diverse asset classes."
    },
    {
      id: "i6",
      title: "MEASURED RISK TAKER",
      description: "Drawn to high-pressure environments like competitive sailing and kite surfing that require rapid, strategic decision-making."
    }
  ]
};
