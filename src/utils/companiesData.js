/**
 * Dataset of top companies for autocomplete suggestions
 * Each entry includes:
 * - name: Official company name with proper capitalization
 * - normalizedName: Lowercase version for case-insensitive matching
 * - industry: Primary industry sector
 * - employeeSize: Approximate employee count range
 */

const topCompanies = [
  {
    name: "Google",
    normalizedName: "google",
    industry: "Technology",
    employeeSize: "100k+",
    logoURL: "https://cdn.worldvectorlogo.com/logos/google-icon.svg"
  },
  {
    name: "Apple",
    normalizedName: "apple",
    industry: "Technology",
    employeeSize: "150k+",
    logoURL: "https://cdn.worldvectorlogo.com/logos/apple.svg"
  },
  {
    name: "Microsoft",
    normalizedName: "microsoft",
    industry: "Technology",
    employeeSize: "180k+",
    logoURL: "https://cdn.worldvectorlogo.com/logos/microsoft-5.svg"
  },
  {
    name: "Amazon",
    normalizedName: "amazon",
    industry: "E-commerce/Technology",
    employeeSize: "1M+",
    logoURL: "https://cdn.worldvectorlogo.com/logos/amazon-icon-1.svg"
  },
  {
    name: "Netflix",
    normalizedName: "netflix",
    industry: "Entertainment",
    employeeSize: "10k+",
    logoURL: "https://cdn.worldvectorlogo.com/logos/netflix-4.svg"
  },
  {
    name: "Tesla",
    normalizedName: "tesla",
    industry: "Automotive/Energy",
    employeeSize: "100k+",
    logoURL: "https://cdn.worldvectorlogo.com/logos/tesla-9.svg"
  },
  {
    name: "JPMorgan Chase",
    normalizedName: "jpmorgan chase",
    industry: "Finance",
    employeeSize: "250k+",
    logoURL: "https://cdn.worldvectorlogo.com/logos/jpmorgan-chase.svg"
  },
  {
    name: "Bank of America",
    normalizedName: "bank of america",
    industry: "Finance",
    employeeSize: "200k+",
    logoURL: "https://cdn.worldvectorlogo.com/logos/bank-of-america-1.svg"
  },
  {
    name: "Goldman Sachs",
    normalizedName: "goldman sachs",
    industry: "Finance",
    employeeSize: "40k+",
    logoURL: "https://cdn.worldvectorlogo.com/logos/goldman-sachs.svg"
  },
  {
    name: "Morgan Stanley",
    normalizedName: "morgan stanley",
    industry: "Finance",
    employeeSize: "60k+",
    logoURL: "https://cdn.worldvectorlogo.com/logos/morgan-stanley.svg"
  },
  {
    name: "Johnson & Johnson",
    normalizedName: "johnson & johnson",
    industry: "Healthcare",
    employeeSize: "130k+",
    logoURL: "https://cdn.worldvectorlogo.com/logos/johnson-johnson-2.svg"
  },
  {
    name: "Pfizer",
    normalizedName: "pfizer",
    industry: "Pharmaceuticals",
    employeeSize: "80k+",
    logoURL: "https://cdn.worldvectorlogo.com/logos/pfizer.svg"
  },
  {
    name: "Moderna",
    normalizedName: "moderna",
    industry: "Biotechnology",
    employeeSize: "3k+",
    logoURL: "https://cdn.worldvectorlogo.com/logos/moderna-2.svg"
  },
  {
    name: "Walmart",
    normalizedName: "walmart",
    industry: "Retail",
    employeeSize: "2.3M+",
    logoURL: "https://cdn.worldvectorlogo.com/logos/walmart.svg"
  },
  {
    name: "Target",
    normalizedName: "target",
    industry: "Retail",
    employeeSize: "400k+",
    logoURL: "https://cdn.worldvectorlogo.com/logos/target-7.svg"
  },
  {
    name: "Costco",
    normalizedName: "costco",
    industry: "Retail",
    employeeSize: "250k+",
    logoURL: "https://cdn.worldvectorlogo.com/logos/costco-wholesale-logo.svg"
  },
  {
    name: "Disney",
    normalizedName: "disney",
    industry: "Entertainment",
    employeeSize: "200k+",
    logoURL: "https://cdn.worldvectorlogo.com/logos/walt-disney-logo-2006.svg"
  },
  {
    name: "Airbnb",
    normalizedName: "airbnb",
    industry: "Hospitality",
    employeeSize: "5k+",
    logoURL: "https://cdn.worldvectorlogo.com/logos/airbnb-1.svg"
  },
  {
    name: "Uber",
    normalizedName: "uber",
    industry: "Transportation",
    employeeSize: "30k+",
    logoURL: "https://cdn.worldvectorlogo.com/logos/uber-1.svg"
  },
  {
    name: "Lyft",
    normalizedName: "lyft",
    industry: "Transportation",
    employeeSize: "5k+",
    logoURL: "https://cdn.worldvectorlogo.com/logos/lyft-1.svg"
  },
  {
    name: "DoorDash",
    normalizedName: "doordash",
    industry: "Food Delivery",
    employeeSize: "8k+",
    logoURL: "https://cdn.worldvectorlogo.com/logos/doordash-1.svg"
  },
  {
    name: "Adobe",
    normalizedName: "adobe",
    industry: "Software",
    employeeSize: "25k+",
    logoURL: "https://cdn.worldvectorlogo.com/logos/adobe-2.svg"
  },
  {
    name: "Salesforce",
    normalizedName: "salesforce",
    industry: "Software",
    employeeSize: "70k+",
    logoURL: "https://cdn.worldvectorlogo.com/logos/salesforce-2.svg"
  },
  {
    name: "Oracle",
    normalizedName: "oracle",
    industry: "Software",
    employeeSize: "140k+",
    logoURL: "https://cdn.worldvectorlogo.com/logos/oracle-6.svg"
  },
  {
    name: "Intel",
    normalizedName: "intel",
    industry: "Semiconductors",
    employeeSize: "120k+",
    logoURL: "https://cdn.worldvectorlogo.com/logos/intel-2.svg"
  },
  {
    name: "AMD",
    normalizedName: "amd",
    industry: "Semiconductors",
    employeeSize: "15k+",
    logoURL: "https://cdn.worldvectorlogo.com/logos/amd.svg"
  },
  {
    name: "NVIDIA",
    normalizedName: "nvidia",
    industry: "Semiconductors",
    employeeSize: "20k+",
    logoURL: "https://cdn.worldvectorlogo.com/logos/nvidia.svg"
  },
  {
    name: "Boeing",
    normalizedName: "boeing",
    industry: "Aerospace",
    employeeSize: "150k+",
    logoURL: "https://cdn.worldvectorlogo.com/logos/boeing-3.svg"
  },
  {
    name: "Lockheed Martin",
    normalizedName: "lockheed martin",
    industry: "Aerospace/Defense",
    employeeSize: "110k+",
    logoURL: "https://cdn.worldvectorlogo.com/logos/lockheed-martin.svg"
  },
  {
    name: "SpaceX",
    normalizedName: "spacex",
    industry: "Aerospace",
    employeeSize: "10k+",
    logoURL: "https://cdn.worldvectorlogo.com/logos/spacex-logo-1.svg"
  },
  {
    name: "General Electric",
    normalizedName: "general electric",
    industry: "Conglomerate",
    employeeSize: "170k+",
    logoURL: "https://cdn.worldvectorlogo.com/logos/general-electric-1.svg"
  },
  {
    name: "IBM",
    normalizedName: "ibm",
    industry: "Technology",
    employeeSize: "280k+",
    logoURL: "https://cdn.worldvectorlogo.com/logos/ibm.svg"
  },
  {
    name: "Cisco",
    normalizedName: "cisco",
    industry: "Networking",
    employeeSize: "80k+",
    logoURL: "https://cdn.worldvectorlogo.com/logos/cisco-2.svg"
  },
  {
    name: "Intel",
    normalizedName: "intel",
    industry: "Semiconductors",
    employeeSize: "110k+",
    logoURL: "https://cdn.worldvectorlogo.com/logos/intel-2.svg"
  },
  {
    name: "HP Inc.",
    normalizedName: "hp",
    industry: "Technology",
    employeeSize: "50k+",
    logoURL: "https://cdn.worldvectorlogo.com/logos/hp-inc.svg"
  },
  {
    name: "Dell Technologies",
    normalizedName: "dell",
    industry: "Technology",
    employeeSize: "165k+",
    logoURL: "https://cdn.worldvectorlogo.com/logos/dell-technologies.svg"
  },
  {
    name: "Spotify",
    normalizedName: "spotify",
    industry: "Music Streaming",
    employeeSize: "8k+",
    logoURL: "https://cdn.worldvectorlogo.com/logos/spotify-1.svg"
  },
  {
    name: "Zoom",
    normalizedName: "zoom",
    industry: "Technology",
    employeeSize: "6k+",
    logoURL: "https://cdn.worldvectorlogo.com/logos/zoom-5.svg"
  },
  {
    name: "Slack",
    normalizedName: "slack",
    industry: "Software",
    employeeSize: "2.5k+",
    logoURL: "https://cdn.worldvectorlogo.com/logos/slack-new-logo.svg"
  },
  {
    name: "Shopify",
    normalizedName: "shopify",
    industry: "E-commerce",
    employeeSize: "10k+",
    logoURL: "https://cdn.worldvectorlogo.com/logos/shopify.svg"
  },
  {
    name: "Square",
    normalizedName: "square",
    industry: "Financial Technology",
    employeeSize: "8k+",
    logoURL: "https://cdn.worldvectorlogo.com/logos/square-3.svg"
  },
  {
    name: "Twitter",
    normalizedName: "twitter",
    industry: "Social Media",
    employeeSize: "7k+",
    logoURL: "https://cdn.worldvectorlogo.com/logos/twitter-6.svg"
  },
  {
    name: "LinkedIn",
    normalizedName: "linkedin",
    industry: "Social Media",
    employeeSize: "16k+",
    logoURL: "https://cdn.worldvectorlogo.com/logos/linkedin-icon-2.svg"
  },
  {
    name: "Pinterest",
    normalizedName: "pinterest",
    industry: "Social Media",
    employeeSize: "3k+",
    logoURL: "https://cdn.worldvectorlogo.com/logos/pinterest-6.svg"
  },
  {
    name: "Snapchat",
    normalizedName: "snapchat",
    industry: "Social Media",
    employeeSize: "5k+",
    logoURL: "https://cdn.worldvectorlogo.com/logos/snapchat-logo-1.svg"
  },
  {
    name: "TikTok",
    normalizedName: "tiktok",
    industry: "Social Media",
    employeeSize: "40k+",
    logoURL: "/logos/tiktok.png"
  },
  {
    name: "Bytedance",
    normalizedName: "bytedance",
    industry: "Technology",
    employeeSize: "100k+",
    logoURL: "https://cdn.worldvectorlogo.com/logos/bytedance.svg"
  },
  {
    name: "Stripe",
    normalizedName: "stripe",
    industry: "Financial Technology",
    employeeSize: "4k+",
    logoURL: "https://cdn.worldvectorlogo.com/logos/stripe-4.svg"
  },
  {
    name: "PayPal",
    normalizedName: "paypal",
    industry: "Financial Technology",
    employeeSize: "30k+",
    logoURL: "https://cdn.worldvectorlogo.com/logos/paypal-6.svg"
  },
  // Singapore/APAC Companies
  {
    name: "OCBC Bank",
    normalizedName: "ocbc bank",
    industry: "Banking",
    employeeSize: "30k+",
    logoURL: "https://cdn.worldvectorlogo.com/logos/ocbc-bank.svg"
  },
  {
    name: "Singapore Airlines",
    normalizedName: "singapore airlines",
    industry: "Aviation",
    employeeSize: "25k+",
    logoURL: "https://cdn.worldvectorlogo.com/logos/singapore-airlines.svg"
  },
  {
    name: "Sea Limited",
    normalizedName: "sea limited",
    industry: "Technology",
    employeeSize: "40k+",
    logoURL: "https://cdn.worldvectorlogo.com/logos/sea-group.svg"
  },
  {
    name: "Shopee",
    normalizedName: "shopee",
    industry: "E-commerce",
    employeeSize: "15k+",
    logoURL: "/logos/shopee.png"
  },
  {
    name: "Lazada",
    normalizedName: "lazada",
    industry: "E-commerce",
    employeeSize: "10k+",
    logoURL: "https://cdn.worldvectorlogo.com/logos/lazada.svg"
  },
  {
    name: "Singtel",
    normalizedName: "singtel",
    industry: "Telecommunications",
    employeeSize: "23k+",
    logoURL: "https://cdn.worldvectorlogo.com/logos/singtel-2.svg"
  },
  {
    name: "StarHub",
    normalizedName: "starhub",
    industry: "Telecommunications",
    employeeSize: "5k+",
    logoURL: "https://cdn.worldvectorlogo.com/logos/starhub-1.svg"
  },
  {
    name: "Keppel Corporation",
    normalizedName: "keppel corporation",
    industry: "Conglomerate",
    employeeSize: "20k+",
    logoURL: "https://cdn.worldvectorlogo.com/logos/keppel-corporation-logo.svg"
  },
  {
    name: "CapitaLand",
    normalizedName: "capitaland",
    industry: "Real Estate",
    employeeSize: "8k+",
    logoURL: "https://cdn.worldvectorlogo.com/logos/capitaland.svg"
  },
  {
    name: "Sembcorp Industries",
    normalizedName: "sembcorp industries",
    industry: "Industrial",
    employeeSize: "10k+",
    logoURL: "https://cdn.worldvectorlogo.com/logos/sembcorp-industries.svg"
  },
  {
    name: "Wilmar International",
    normalizedName: "wilmar international",
    industry: "Agribusiness",
    employeeSize: "90k+",
    logoURL: "https://cdn.worldvectorlogo.com/logos/wilmar-international.svg"
  },
  {
    name: "Razer",
    normalizedName: "razer",
    industry: "Gaming Hardware",
    employeeSize: "2k+",
    logoURL: "https://cdn.worldvectorlogo.com/logos/razer-2.svg"
  },
  {
    name: "Garena",
    normalizedName: "garena",
    industry: "Gaming",
    employeeSize: "5k+",
    logoURL: "https://cdn.worldvectorlogo.com/logos/garena-2.svg"
  },
  {
    name: "SP Group",
    normalizedName: "sp group",
    industry: "Utilities",
    employeeSize: "3.5k+",
    logoURL: "https://cdn.worldvectorlogo.com/logos/sp-group.svg"
  },
  {
    name: "Olam International",
    normalizedName: "olam international",
    industry: "Agribusiness",
    employeeSize: "80k+",
    logoURL: "https://cdn.worldvectorlogo.com/logos/olam-international.svg"
  },
  {
    name: "Standard Chartered",
    normalizedName: "standard chartered",
    industry: "Banking",
    employeeSize: "85k+",
    logoURL: "https://cdn.worldvectorlogo.com/logos/standard-chartered-6.svg"
  },
  {
    name: "HSBC",
    normalizedName: "hsbc",
    industry: "Banking",
    employeeSize: "220k+",
    logoURL: "https://cdn.worldvectorlogo.com/logos/hsbc-4.svg"
  },
  {
    name: "Citi",
    normalizedName: "citi",
    industry: "Banking",
    employeeSize: "200k+",
    logoURL: "https://cdn.worldvectorlogo.com/logos/citi-4.svg"
  },
  {
    name: "Accenture",
    normalizedName: "accenture",
    industry: "Consulting",
    employeeSize: "700k+",
    logoURL: "https://cdn.worldvectorlogo.com/logos/accenture-6.svg"
  },
  {
    name: "Deloitte",
    normalizedName: "deloitte",
    industry: "Professional Services",
    employeeSize: "330k+",
    logoURL: "https://cdn.worldvectorlogo.com/logos/deloitte-4.svg"
  },
  {
    name: "EY",
    normalizedName: "ey",
    industry: "Professional Services",
    employeeSize: "300k+",
    logoURL: "https://cdn.worldvectorlogo.com/logos/ernst-young-ey.svg"
  },
  {
    name: "KPMG",
    normalizedName: "kpmg",
    industry: "Professional Services",
    employeeSize: "220k+",
    logoURL: "https://cdn.worldvectorlogo.com/logos/kpmg-1.svg"
  },
  {
    name: "PwC",
    normalizedName: "pwc",
    industry: "Professional Services",
    employeeSize: "300k+",
    logoURL: "https://cdn.worldvectorlogo.com/logos/pwc.svg"
  },
  {
    name: "Shell",
    normalizedName: "shell",
    industry: "Energy",
    employeeSize: "82k+",
    logoURL: "https://cdn.worldvectorlogo.com/logos/shell-4.svg"
  },
  {
    name: "BP",
    normalizedName: "bp",
    industry: "Energy",
    employeeSize: "70k+",
    logoURL: "https://cdn.worldvectorlogo.com/logos/bp-5.svg"
  },
  {
    name: "ExxonMobil",
    normalizedName: "exxonmobil",
    industry: "Energy",
    employeeSize: "63k+",
    logoURL: "https://cdn.worldvectorlogo.com/logos/exxonmobil-2.svg"
  },
  {
    name: "Visa",
    normalizedName: "visa",
    industry: "Financial Services",
    employeeSize: "20k+",
    logoURL: "https://cdn.worldvectorlogo.com/logos/visa.svg"
  },
  {
    name: "Mastercard",
    normalizedName: "mastercard",
    industry: "Financial Services",
    employeeSize: "25k+",
    logoURL: "https://cdn.worldvectorlogo.com/logos/mastercard-6.svg"
  },
  {
    name: "PayPal",
    normalizedName: "paypal",
    industry: "Financial Technology",
    employeeSize: "30k+",
    logoURL: "https://cdn.worldvectorlogo.com/logos/paypal-6.svg"
  },
  {
    name: "SAP",
    normalizedName: "sap",
    industry: "Enterprise Software",
    employeeSize: "100k+",
    logoURL: "https://cdn.worldvectorlogo.com/logos/sap-3.svg"
  },
  {
    name: "Dyson",
    normalizedName: "dyson",
    industry: "Technology/Consumer Electronics",
    employeeSize: "14k+",
    logoURL: "https://cdn.worldvectorlogo.com/logos/dyson-logo.svg"
  },
  {
    name: "Bytedance",
    normalizedName: "bytedance",
    industry: "Technology",
    employeeSize: "100k+",
    logoURL: "https://cdn.worldvectorlogo.com/logos/bytedance.svg"
  },
  {
    name: "Procter & Gamble",
    normalizedName: "procter & gamble",
    industry: "Consumer Goods",
    employeeSize: "100k+",
    logoURL: "https://cdn.worldvectorlogo.com/logos/procter-gamble-8.svg"
  },
  {
    name: "Unilever",
    normalizedName: "unilever",
    industry: "Consumer Goods",
    employeeSize: "150k+",
    logoURL: "https://cdn.worldvectorlogo.com/logos/unilever-eps-vector-logo.svg"
  },
  {
    name: "GlaxoSmithKline",
    normalizedName: "glaxosmithkline",
    industry: "Pharmaceuticals",
    employeeSize: "95k+",
    logoURL: "https://cdn.worldvectorlogo.com/logos/gsk-glaxosmithkline-2.svg"
  },
  {
    name: "Meta",
    normalizedName: "meta",
    industry: "Technology",
    employeeSize: "70k+",
    logoURL: "/logos/meta.png"
  },
  {
    name: "DBS",
    normalizedName: "dbs",
    industry: "Finance",
    employeeSize: "30k+",
    logoURL: "/logos/dbs.png"
  },
  {
    name: "OCBC",
    normalizedName: "ocbc",
    industry: "Banking",
    employeeSize: "30k+",
    logoURL: "/logos/ocbc.png"
  }
];

export default topCompanies; 