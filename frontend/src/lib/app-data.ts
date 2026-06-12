import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Bot,
  CreditCard,
  Gauge,
  Grid2X2,
  Inbox,
  Link2,
  Mail,
  MessageCircle,
  Settings,
  Send,
  ShieldCheck,
  SlidersHorizontal,
  Users
} from "lucide-react";

export type AppNavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export const appNav: AppNavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: Gauge },
  { href: "/inbox", label: "Inbox", icon: Inbox },
  { href: "/workspace", label: "Workspace", icon: Grid2X2 },
  { href: "/pipeline", label: "Pipeline", icon: SlidersHorizontal },
  { href: "/team", label: "Team", icon: Users },
  { href: "/ai-assistant", label: "AI Assistant", icon: Bot },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/integrations", label: "Integrations", icon: Link2 },
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/billing", label: "Billing", icon: CreditCard }
];

export const channelStats = [
  { label: "WhatsApp", count: 20, status: "READY", tone: "success" },
  { label: "Instagram", count: 10, status: "READY", tone: "success" },
  { label: "Messenger", count: 5, status: "MANUAL", tone: "warning" },
  { label: "Telegram", count: 3, status: "READY", tone: "success" },
  { label: "Email", count: 4, status: "SYNCED", tone: "info" },
  { label: "Live Chat", count: 3, status: "ONLINE", tone: "success" }
];

export const conversations = [
  {
    name: "Sarah Jenkins",
    company: "TechFlow",
    platform: "WhatsApp",
    message: "Yes, the new scope looks great. Let's proceed with the Q3 campaign.",
    status: "OPEN",
    time: "10m",
    score: 92,
    value: "$45,000 MRR"
  },
  {
    name: "Marcus Vance",
    company: "Global Media",
    platform: "Gmail",
    message: "Re: Q3 Campaign Deliverables Review",
    status: "PENDING",
    time: "2h",
    score: 81,
    value: "$29,500 MRR"
  },
  {
    name: "Neon Studios",
    company: "Neon Studios",
    platform: "Instagram",
    message: "Loved the moodboard! Can we tweak the launch assets?",
    status: "OPEN",
    time: "Yesterday",
    score: 74,
    value: "$12,000 MRR"
  },
  {
    name: "Mike Ross",
    company: "Bluecart",
    platform: "Messenger",
    message: "I haven't received my tracking number yet. Order #4492.",
    status: "ATTENTION",
    time: "2h",
    score: 58,
    value: "$4,800 MRR"
  }
];

export const contacts = [
  { name: "Sarah Jenkins", channel: "WhatsApp", value: "sarah@techflow.io", tag: "Enterprise lead" },
  { name: "Marcus Vance", channel: "Gmail", value: "marcus@globalmedia.com", tag: "Renewal" },
  { name: "Elena Rostova", channel: "LinkedIn", value: "elena@globalfreight.com", tag: "Proposal" },
  { name: "John Doe", channel: "Messenger", value: "+1 555-0198", tag: "Support" }
];

export const integrations = [
  { label: "WhatsApp Official API", status: "LICENSE REQUIRED", note: "Official Meta integration for high-volume broadcasts and automation.", key: "whatsapp" },
  { label: "Instagram DMs", status: "READY", note: "Manage direct messages, story replies, and comments.", key: "instagram" },
  { label: "Facebook Messenger", status: "MANUAL SETUP", note: "Route Messenger conversations into the unified inbox.", key: "facebook" },
  { label: "Telegram Bot", status: "CONNECT", note: "Fastest MVP messaging channel.", key: "telegram" },
  { label: "Gmail", status: "CONNECT", note: "Google OAuth sync for client emails.", key: "gmail" },
  { label: "Gemini AI", status: "CONFIGURE", note: "Reply suggestions, insights, and conversation summaries.", key: "gemini" },
  { label: "Website Live Chat", status: "READY", note: "Embeddable widget for website leads.", key: "livechat" }
];

export const assistantPrompts = [
  {
    title: "Availability",
    prompt: "Yes, the product is currently available. Would you like us to help you place an order?"
  },
  {
    title: "Pricing",
    prompt: "Sure, I can share the latest pricing. Which product or plan are you interested in?"
  },
  {
    title: "Delivery",
    prompt: "Yes, we can check delivery for your location. Please share your PIN code."
  }
];

export const dashboardMetrics = [
  { label: "Leads won", value: "124", delta: "+12%" },
  { label: "Response time", value: "14m", delta: "-36%" },
  { label: "Conversion rate", value: "24%", delta: "Top 10%" },
  { label: "Team performance", value: "91%", delta: "+8%" }
];

export const priorities = [
  {
    title: "Reply to ABC Agency",
    detail: "They are awaiting the final revised contract. SLA breach imminent.",
    wait: "16h wait",
    tone: "danger"
  },
  {
    title: "Follow up with XYZ Ltd",
    detail: "High intent lead. Proposal opened 3 times today.",
    wait: "2 days",
    tone: "warning"
  },
  {
    title: "Instagram lead not replied to",
    detail: "Hey, do you guys handle e-commerce retention?",
    wait: "New",
    tone: "info"
  }
];

export const pipelineColumns = [
  {
    title: "New",
    color: "#38BDF8",
    cards: [
      { name: "Sarah Jenkins", company: "Nexus Dynamics", score: 88, value: "$45k Est. Value", age: "2h ago", tone: "success" },
      { name: "Michael Chen", company: "Alpaca Tech", score: 62, value: "$12k Est. Value", age: "18h ago", tone: "warning" }
    ]
  },
  {
    title: "Contacted",
    color: "#C4B5FD",
    cards: [
      { name: "Elena Rostova", company: "Global Freight", score: 91, value: "$80k Est. Value", age: "1d ago", tone: "success" }
    ]
  },
  { title: "Qualified", color: "#2DD4BF", cards: [] },
  {
    title: "Proposal",
    color: "#F59E0B",
    cards: [
      { name: "TechCorp Inc.", company: "Enterprise SaaS", score: 98, value: "$45k/mo", age: "Renewal", tone: "success" }
    ]
  }
];

export const teamMembers = [
  {
    name: "Elena Rodriguez",
    email: "elena@qchart.com",
    role: "Admin",
    metric: "Leads won (30d)",
    value: "84",
    channels: ["WhatsApp", "Instagram", "Gmail"]
  },
  {
    name: "Marcus Johnson",
    email: "marcus@qchart.com",
    role: "Agent",
    metric: "Avg response",
    value: "2m 14s",
    channels: ["WhatsApp"]
  },
  {
    name: "Sarah Cooper",
    email: "sarah@qchart.com",
    role: "Manager",
    metric: "Tasks done",
    value: "38/50",
    channels: ["Gmail", "Messenger"]
  }
];

export const aiRecommendations = [
  {
    title: "High Priority",
    detail: "TechCorp is requesting a pricing upgrade. Schedule a call immediately.",
    action: "Draft Calendar Invite",
    tone: "danger"
  },
  {
    title: "Attention Needed",
    detail: "Mike Ross has been waiting 2 hours for a tracking number.",
    action: "Generate Response",
    tone: "warning"
  },
  {
    title: "Pattern Detected",
    detail: "DNS-related support queries are up 15% after the recent registrar update.",
    action: "Publish SOP",
    tone: "info"
  }
];

export const supportTickets = [
  { id: "#441", title: "API Integration Failing on Checkout", customer: "Sarah Jenkins", priority: "High", time: "2m ago" },
  { id: "#442", title: "Cannot access reporting dashboard", customer: "John Doe", priority: "Med", time: "15m ago" }
];

export const inboxIcon = MessageCircle;
export const mailIcon = Mail;
export const sendIcon = Send;
export const shieldIcon = ShieldCheck;
