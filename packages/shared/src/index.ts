export type ChannelKind = "gmail" | "instagram" | "whatsapp" | "facebook" | "messenger";
export type LeadStage = "new" | "contacted" | "qualified" | "proposal" | "won";

export interface Lead {
  id: string;
  name: string;
  company: string;
  stage: LeadStage;
  score: number;
  value: number;
  status: "hot" | "warm" | "risk" | "stable";
  lastActivity: string;
}

export interface ConversationMessage {
  id: string;
  sender: string;
  body: string;
  channel: ChannelKind;
  sentAt: string;
  direction: "inbound" | "outbound" | "internal";
}

export interface Conversation {
  id: string;
  leadId: string;
  title: string;
  channel: ChannelKind;
  unread: boolean;
  lastMessage: string;
  updatedAt: string;
  messages: ConversationMessage[];
}

export const profile = { id: "profile_alex", fullName: "Alex Mercer", email: "alex@qchart.demo" };
export const workspace = { id: "workspace_agency", name: "Qchart Agency", plan: "pro" };

export const channels = [
  { id: "ch_gmail", kind: "gmail", label: "Gmail / Workspace", connected: true, unreadCount: 3, status: "ready" },
  { id: "ch_ig", kind: "instagram", label: "Instagram DMs", connected: true, unreadCount: 2, status: "ready" },
  { id: "ch_wa", kind: "whatsapp", label: "WhatsApp Business", connected: false, unreadCount: 1, status: "license_required" },
  { id: "ch_fb", kind: "facebook", label: "Facebook Pages", connected: true, unreadCount: 0, status: "ready" }
] as const;

export const leads: Lead[] = [
  { id: "lead_sarah", name: "Sarah Jenkins", company: "TechFlow", stage: "new", score: 92, value: 45000, status: "hot", lastActivity: "10m ago" },
  { id: "lead_elena", name: "Elena Rostova", company: "Global Freight", stage: "contacted", score: 91, value: 80000, status: "hot", lastActivity: "1d ago" },
  { id: "lead_michael", name: "Michael Chen", company: "Alpaca Tech", stage: "new", score: 62, value: 12000, status: "warm", lastActivity: "18h ago" },
  { id: "lead_acme", name: "Acme Corp", company: "Acme Corp", stage: "proposal", score: 88, value: 25000, status: "risk", lastActivity: "16h wait" }
];

export const conversations: Conversation[] = [
  {
    id: "conv_sarah",
    leadId: "lead_sarah",
    title: "Sarah Jenkins",
    channel: "gmail",
    unread: true,
    lastMessage: "Yes, the new scope looks great. Let's proceed.",
    updatedAt: "10m ago",
    messages: [
      { id: "m1", sender: "Sarah Jenkins", body: "Hi Team, just reviewing the Q3 scope document. Most of it looks fantastic, but I had questions about social asset timing.", channel: "gmail", sentAt: "09:14 AM", direction: "inbound" },
      { id: "m2", sender: "Alex Chen (Internal)", body: "I will handle the timeline. The dev team needs an extra week, so I will text her to manage expectations.", channel: "gmail", sentAt: "09:45 AM", direction: "internal" },
      { id: "m3", sender: "Sarah Jenkins", body: "Yes, the new scope looks great. Let's proceed.", channel: "whatsapp", sentAt: "10:02 AM", direction: "inbound" }
    ]
  },
  { id: "conv_marcus", leadId: "lead_michael", title: "Marcus Vance", channel: "gmail", unread: false, lastMessage: "Re: Q3 Campaign Deliverables Review", updatedAt: "2h ago", messages: [{ id: "m4", sender: "Marcus Vance", body: "Can we schedule a quick review before the weekend?", channel: "gmail", sentAt: "08:20 AM", direction: "inbound" }] },
  { id: "conv_neon", leadId: "lead_elena", title: "Neon Studios", channel: "instagram", unread: true, lastMessage: "Loved the moodboard! Can we tweak the launch copy?", updatedAt: "Yesterday", messages: [{ id: "m5", sender: "Neon Studios", body: "Loved the new campaign drop! When is the next collection launching?", channel: "instagram", sentAt: "Yesterday", direction: "inbound" }] }
];

export const dashboardSummary = {
  metrics: [
    { label: "Leads Won", value: "124", delta: "+12%" },
    { label: "Response Time", value: "14 min", delta: "-8%" },
    { label: "Conversion Rate", value: "24%", delta: "Top 10%" },
    { label: "Team Performance", value: "91%", delta: "+6%" }
  ],
  priorities: [
    { id: "p1", title: "Reply to ABC Agency", detail: "They are awaiting final revised contract. SLA breach imminent.", tone: "danger" },
    { id: "p2", title: "Follow up with XYZ Ltd", detail: "High intent lead. Proposal opened 3 times today.", tone: "warning" },
    { id: "p3", title: "Instagram lead not replied to", detail: "They asked about e-commerce retention packages.", tone: "info" }
  ],
  pipelineHealth: [
    { name: "Acme Corp", tier: "Enterprise Tier", status: "urgent" },
    { name: "TechStart Inc", tier: "Growth Tier", status: "watch" },
    { name: "Global Media", tier: "Agency Tier", status: "healthy" }
  ]
};

export const analyticsSummary = {
  mrr: 124500,
  leadsWon: 124,
  conversionRate: 24,
  avgResponseMinutes: 14,
  channelRevenue: [
    { channel: "whatsapp" as ChannelKind, leads: 340, revenue: 45200 },
    { channel: "instagram" as ChannelKind, leads: 412, revenue: 38800 },
    { channel: "gmail" as ChannelKind, leads: 180, revenue: 29500 },
    { channel: "facebook" as ChannelKind, leads: 308, revenue: 11000 }
  ]
};

export function moveLeadStage(leadId: string, stage: LeadStage) {
  const lead = leads.find((item) => item.id === leadId);
  if (!lead) throw new Error(`Lead not found: ${leadId}`);
  lead.stage = stage;
  lead.updatedAt = new Date().toISOString();
  return lead;
}

export function appendMessage(conversationId: string, body: string) {
  const conversation = conversations.find((item) => item.id === conversationId);
  if (!conversation) throw new Error(`Conversation not found: ${conversationId}`);
  const newMsg = { 
    id: `m_${Date.now()}`, 
    sender: profile.fullName, 
    body, 
    channel: conversation.channel, 
    sentAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), 
    direction: "outbound" as const 
  };
  conversation.messages.push(newMsg);
  conversation.lastMessage = body;
  conversation.unread = false;
  conversation.updatedAt = "Just now";
  return conversation;
}

export function createCsvReport() {
  const rows = [["Metric", "Value"], ["Workspace", workspace.name], ["MRR", String(analyticsSummary.mrr)], ["Leads Won", String(analyticsSummary.leadsWon)], ["Conversion Rate", `${analyticsSummary.conversionRate}%`]];
  return rows.map((row) => row.join(",")).join("\n");
}

