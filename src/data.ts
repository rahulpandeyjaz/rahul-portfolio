export type ProofItem = {
  title: string;
  eyebrow: string;
  value?: string;
  image?: string;
};

export type Service = {
  number: string;
  name: string;
  description: string;
};

export type Project = {
  number: string;
  category: string;
  name: string;
  summary: string;
  metrics: string[];
  image: string;
};

export type WorkExp = {
  role: string;
  company: string;
  location: string;
  period: string;
  highlights: string[];
};

export const profile = {
  name: "Rahul Pandey",
  heroName: "Hi, I'm Rahul",
  title: "Performance Marketer",
  subtitle: "A performance marketer driven by building sharp, measurable, and unforgettable growth systems",
  about:
    "With more than five years of experience across paid media, campaign operations, Amazon Ads, analytics, and SEO, I build full-funnel performance systems that turn budget, audiences, keywords, and creative tests into measurable revenue. I focus on ROAS, ACOS, CAC, CPL, and clean reporting so every campaign has a commercial reason to exist.",
  email: "rahulpandey0498@gmail.com",
  linkedin: "https://www.linkedin.com/in/irahulpandey",
  cv: "/assets/docs/RahulPandeyCV.pdf",
  portfolio: "/assets/docs/RahulPandey_Portfolio.pdf",
  avatar: "/assets/hero/rahul-avatar-transparent.png"
};

export const certificateProof: ProofItem[] = [
  { title: "Advertising with Meta", eyebrow: "Meta / Coursera", image: "/assets/certificates/advertising-with-meta.png" },
  { title: "Foundations of Retail Media", eyebrow: "Amazon Ads", image: "/assets/certificates/foundations-retail-media-amazon-ads.png" },
  { title: "Unilever Digital Marketing Analyst", eyebrow: "Unilever", image: "/assets/certificates/unilever-digital-marketing-analyst.png" },
  { title: "Digital Marketing Capstone", eyebrow: "University of Illinois", image: "/assets/certificates/digital-marketing-specialization-capstone.png" },
  { title: "Marketing Analytics in Practice", eyebrow: "University of Illinois", image: "/assets/certificates/digital-marketing-analytics-practice.png" },
  { title: "Advanced SEO Tactics", eyebrow: "UC Davis", image: "/assets/certificates/advanced-content-seo-tactics.png" },
  { title: "OMCP Digital Marketing Specialist", eyebrow: "OMCP", image: "/assets/certificates/omcp-digital-marketing-specialist.png" }
];

export const metricProof: ProofItem[] = [
  { title: "Portfolio Ad Revenue", eyebrow: "23-day active window", value: "INR 531.82K" },
  { title: "Campaigns Built", eyebrow: "Across campaign portfolio", value: "1,019+" },
  { title: "Average ROAS", eyebrow: "Portfolio performance", value: "4.9x" },
  { title: "Best ROAS", eyebrow: "High-efficiency account", value: "6.4x" },
  { title: "Lowest ACOS", eyebrow: "Efficiency winner", value: "15.62%" },
  { title: "Amazon Sellers", eyebrow: "Campaign operations", value: "108+" },
  { title: "Monthly Media Budget", eyebrow: "Managed at scale", value: "INR 70-80L" }
];

export const allCertifications = [
  { name: "Google Ads Certification", issuer: "Google Skillshop" },
  { name: "Advertising with Meta", issuer: "Meta Blueprint" },
  { name: "Marketing Analytics with Meta", issuer: "Meta Blueprint" },
  { name: "LinkedIn Marketing Solutions Fundamentals", issuer: "LinkedIn" },
  { name: "IBM Generative AI for Digital Marketers", issuer: "IBM / Coursera" },
  { name: "OMCP Digital Marketing Specialist", issuer: "Digital Marketing Institute" },
  { name: "Foundations of Retail Media", issuer: "Amazon Ads" },
  { name: "Unilever Digital Marketing Analyst", issuer: "Unilever" },
  { name: "Digital Marketing Specialization Capstone", issuer: "University of Illinois" },
  { name: "Marketing Analytics in Practice", issuer: "University of Illinois" },
  { name: "Advanced SEO Tactics", issuer: "UC Davis" }
];

export const services: Service[] = [
  {
    number: "01",
    name: "Paid Media Strategy",
    description:
      "Full-funnel planning across Google Ads (Search, Performance Max, YouTube), Meta Ads, LinkedIn Ads, Amazon Ads, and Amazon DSP — budgets mapped to ROAS, ACOS, CAC, and CPL targets."
  },
  {
    number: "02",
    name: "Campaign Operations",
    description:
      "Keyword research, audience segmentation, bid management, creative A/B testing, negative keyword hygiene, and structured stakeholder reporting across 108+ Amazon seller accounts."
  },
  {
    number: "03",
    name: "Analytics & Attribution",
    description:
      "GA4, Meta Business Suite, Pixel/CAPI, UTM hygiene, Looker Studio, Tableau, attribution modelling, and weekly performance narratives that make data-driven decisions visible."
  },
  {
    number: "04",
    name: "SEO & Web",
    description:
      "On-page and technical SEO, WordPress, Google My Business, local directory listings, SEMrush, Moz, Core Web Vitals, and landing page CRO for paid and organic traffic."
  },
  {
    number: "05",
    name: "Strategy & Reporting",
    description:
      "Full-funnel media strategy, budget governance, QCP process, hypothesis-led testing, weekly performance narratives, and cross-functional stakeholder management."
  },
  {
    number: "06",
    name: "AI & MarTech",
    description:
      "Generative AI (GPT-based), IBM AI Tools, AI-assisted campaign optimisation, workflow automation, and automated bid management integrated into day-to-day campaign operations."
  }
];

export const projects: Project[] = [
  {
    number: "01",
    category: "Efficiency",
    name: "Cutting waste, not corners",
    summary:
      "ACOS was sitting at 29.99% when I came in — way too high. I went after the keywords eating budget without converting, cut the broad match waste, and pushed harder on exact and phrase match where purchase intent was actually there. Spend went down 5.2%, revenue went up 9.6%. Same account, just cleaner.",
    metrics: ["INR 58.46K ad revenue", "25.94% ACOS", "3.86x ROAS", "-5.21% spend"],
    image: "/assets/projects/SAVE_20250327_151736.jpg"
  },
  {
    number: "02",
    category: "High ROAS",
    name: "Best ROAS in the portfolio — and I didn't scale to get there",
    summary:
      "6.4x ROAS. Best-performing account in the whole portfolio. The thing is, I kept spend flat and just made the existing budget work harder — negative keyword cleanup, dayparting based on when conversions were actually happening, and protecting what was already working. ACOS landed at 15.62%. Some accounts you scale, some you protect. This one needed protection.",
    metrics: ["6.4x ROAS", "15.62% ACOS", "130 orders", "+8.3% revenue"],
    image: "/assets/projects/SAVE_20250327_151721.jpg"
  },
  {
    number: "03",
    category: "Scale",
    name: "When you know the window's there, you go",
    summary:
      "This was a deliberate scale push — I tripled the budget from INR 14K to INR 46.8K because the opportunity was clearly there. Revenue nearly doubled at +97.19%. Orders went from 175 to 356. Impressions scaled from 534K to 1.28M. And the whole time I was watching ACOS daily to make sure we weren't just burning money. That's what a controlled scale push looks like.",
    metrics: ["+97.19% revenue", "356 orders", "1.28M impressions", "+103.43% orders"],
    image: "/assets/projects/SAVE_20250327_151702.jpg"
  },
  {
    number: "04",
    category: "Awareness",
    name: "Top-of-funnel that actually paid off",
    summary:
      "This account wasn't about short-term ROAS — the brief was awareness first, conversion second. Impressions went from 383K to 1.53M, nearly 4x. Yes, spend went up. But orders still grew 73.8%, which is honestly better than expected for a top-of-funnel push. I kept a hard budget ceiling and reviewed pacing every week so it never ran away. Those new audiences are now feeding retargeting — that's where the real payoff comes.",
    metrics: ["1.53M impressions", "73 orders", "+45.1% revenue", "+73.81% orders"],
    image: "/assets/projects/SAVE_20250327_151653.jpg"
  },
  {
    number: "05",
    category: "Click Quality",
    name: "Revenue grew faster than clicks — that gap is the whole story",
    summary:
      "Clicks grew 25.4%. Revenue grew 48.2%. That gap is the metric that actually matters — it means every click was doing more work than before, and revenue per click improved significantly. Orders moved from 281 to 387, a 37.7% increase. Spend went from INR 47.78K to INR 77.53K, but revenue returned INR 220.96K. This account was all about growth with quality, not just volume — and that is exactly what it delivered across all five concurrent accounts in the portfolio.",
    metrics: ["INR 220.96K ad revenue", "387 orders", "11.71K clicks", "+48.24% revenue"],
    image: "/assets/projects/SAVE_20250327_151730.jpg"
  }
];

export const workExperience: WorkExp[] = [
  {
    role: "Marketing Operations & Paid Media Specialist",
    company: "Heavenly Hair",
    location: "Dublin, Ireland (Remote)",
    period: "May 2025 – Present",
    highlights: [
      "Full-funnel paid media across Google Ads, Meta Ads, and LinkedIn across four revenue streams — e-commerce, salon services, academy training, and B2B programs",
      "27% traffic growth and EUR 1,200+ revenue uplift through Meta A/B testing and Google campaign optimisation",
      "85 qualified leads at EUR 18 avg CAC for Academy and B2B Stockist programs via targeted Google Search and Meta retargeting",
      "ROAS improved from 2.8x to 4.1x on premium product campaigns (EUR 69–195) through creative iteration and bid refinement"
    ]
  },
  {
    role: "Senior Analyst — Campaign Operations & Amazon Ads",
    company: "Tech Mahindra",
    location: "Bengaluru, India (On-site)",
    period: "Aug 2024 – Mar 2025",
    highlights: [
      "Managed paid media for 108 Amazon sellers across softline verticals on an INR 50–60L monthly media budget",
      "35% avg ROI increase through data-driven keyword optimisation, automated bid strategy frameworks, and A/B testing",
      "40% Republic Day campaign sales spike alongside 18% ACOS reduction through real-time budget reallocation",
      "Ranked 2nd floor-wide in Amazon AI certification across a 19-analyst cohort; drove 1,519 AMR registrations with 499 confirmations"
    ]
  },
  {
    role: "Paid Media & Marketing Operations Specialist",
    company: "No Hurt No Harm",
    location: "Dublin, Ireland (Remote)",
    period: "Jul 2021 – Jul 2024",
    highlights: [
      "End-to-end paid media across Google Ads, Meta Ads, Amazon Ads, and Amazon DSP for UK and Ireland — no external agency support",
      "ACOS improved from 25% to 18%, ROAS from 4.0x to 5.5x over a 12-month optimisation cycle",
      "28% repeat purchase growth via Amazon DSP re-engagement workflows; 95% page-1 keyword rankings through integrated paid and organic operations",
      "Built structured lead-acquisition funnels via Meta Lead Ads and Google Search retargeting tracked to CAC, CPL, and conversion rate KPIs"
    ]
  },
  {
    role: "SEO & Paid Media Operations Specialist",
    company: "Heavenly Hair",
    location: "Dublin, Ireland (Remote)",
    period: "Aug 2020 – Jun 2021",
    highlights: [
      "Built and launched Google Ads Search and Shopping campaigns from scratch for UK and Ireland audiences",
      "Managed WordPress website end-to-end — on-page SEO, product copywriting, Core Web Vitals, and landing page quality scores",
      "Improved organic search exposure by 27% through technical SEO using SEMrush and Moz"
    ]
  },
  {
    role: "Paid Media & Campaign Operations Specialist",
    company: "Independent Consultant",
    location: "Remote — Fiverr / Upwork / Direct Clients",
    period: "2018 – 2020",
    highlights: [
      "Full-funnel lead generation for Five Star's Cleaning Services with geo-targeted Google Ads per service vertical",
      "Sustained 4.8-star reputation management on Bark.com for managed clients",
      "Reduced cost-per-lead across 50+ campaign accounts through audience insight, copy variation, and landing page CRO"
    ]
  }
];
