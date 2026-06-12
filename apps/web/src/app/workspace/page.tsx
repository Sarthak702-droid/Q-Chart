"use client";

import { useEffect, useState } from "react";
import { 
  Bot, Mail, Maximize2, MessageCircle, Pin, PinOff, Send, Sparkles, 
  Users, Trash2, Eye, EyeOff, LayoutGrid, RotateCcw, Save, Trash, HelpCircle, ArrowRight
} from "lucide-react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { AppShell } from "@/components/app-shell";
import { Badge, Button, GlassCard, SectionHeader } from "@/components/ui";

interface WindowLayout {
  id: string;
  title: string;
  iconType: "mail" | "instagram" | "whatsapp" | "facebook" | "lead" | "ai";
  badge?: string;
  width: "half" | "full";
  height: number; // in pixels
  pinned: boolean;
  visible: boolean;
}

const defaultLayout: WindowLayout[] = [
  { id: "gmail", title: "Gmail", iconType: "mail", badge: "3 New", width: "half", height: 380, pinned: false, visible: true },
  { id: "instagram", title: "Instagram DMs", iconType: "instagram", badge: "2 New", width: "half", height: 380, pinned: false, visible: true },
  { id: "whatsapp", title: "WhatsApp Biz", iconType: "whatsapp", badge: "Hot Lead", width: "half", height: 380, pinned: false, visible: true },
  { id: "facebook", title: "Facebook Inbox", iconType: "facebook", badge: "Pending", width: "half", height: 380, pinned: false, visible: true },
  { id: "lead-details", title: "Lead Details", iconType: "lead", width: "half", height: 380, pinned: false, visible: true },
  { id: "ai-copilot", title: "Qchart AI Assistant", iconType: "ai", width: "half", height: 380, pinned: false, visible: true },
];

export default function WorkspacePage() {
  const [layout, setLayout] = useState<WindowLayout[]>(defaultLayout);
  const [poppedOut, setPoppedOut] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [igMessages, setIgMessages] = useState([
    { sender: "Neon Studios", body: "Loved the new campaign drop! When is the next collection launching?", sentAt: "Yesterday", type: "inbound" }
  ]);
  const [chatInputs, setChatInputs] = useState<Record<string, string>>({});

  // Load saved layout from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("qchart_workspace_layout");
    if (saved) {
      try {
        setLayout(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load saved layout", e);
      }
    }
  }, []);

  const saveLayout = () => {
    localStorage.setItem("qchart_workspace_layout", JSON.stringify(layout));
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const resetLayout = () => {
    setLayout(defaultLayout);
    localStorage.removeItem("qchart_workspace_layout");
  };

  const togglePin = (id: string) => {
    setLayout(prev => prev.map(w => w.id === id ? { ...w, pinned: !w.pinned } : w));
  };

  const toggleWidth = (id: string) => {
    setLayout(prev => prev.map(w => w.id === id ? { ...w, width: w.width === "half" ? "full" : "half" } : w));
  };

  const resizeHeight = (id: string, dir: "inc" | "dec") => {
    setLayout(prev => prev.map(w => w.id === id ? { ...w, height: Math.max(280, Math.min(600, w.height + (dir === "inc" ? 60 : -60))) } : w));
  };

  const toggleVisible = (id: string) => {
    setLayout(prev => prev.map(w => w.id === id ? { ...w, visible: !w.visible } : w));
  };

  const handleSendIgReply = (text: string) => {
    if (!text.trim()) return;
    setIgMessages(prev => [
      ...prev,
      { sender: "You", body: text, sentAt: "Just now", type: "outbound" }
    ]);
  };

  const handleInputChange = (id: string, value: string) => {
    setChatInputs(prev => ({ ...prev, [id]: value }));
  };

  const visibleWindows = layout.filter(w => w.visible);
  const hiddenWindows = layout.filter(w => !w.visible);

  return (
    <AppShell>
      <SectionHeader 
        title="Agency Workspace" 
        description="A customized workspace where you can drag, resize, pin, and save layout configurations."
        action={
          <div className="flex gap-3">
            <Button variant="ghost" onClick={resetLayout} className="flex items-center gap-2">
              <RotateCcw size={16} /> Reset
            </Button>
            <Button onClick={saveLayout} className="flex items-center gap-2">
              <Save size={16} /> Save Layout
            </Button>
          </div>
        }
      />

      {/* Hidden Panels Drawer */}
      {hiddenWindows.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="mb-6 rounded-2xl border border-white/10 bg-white/[.03] p-4 flex flex-wrap items-center gap-3"
        >
          <span className="text-xs font-bold uppercase tracking-wider text-textMuted flex items-center gap-1">
            <EyeOff size={14} /> Hidden Panels ({hiddenWindows.length}):
          </span>
          {hiddenWindows.map(w => (
            <button 
              key={w.id} 
              onClick={() => toggleVisible(w.id)}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold flex items-center gap-2 transition-all"
            >
              <span>{w.title}</span>
              <Eye size={12} className="text-cyan" />
            </button>
          ))}
        </motion.div>
      )}

      {/* Workspace canvas */}
      <Reorder.Group 
        axis="y" 
        values={layout} 
        onReorder={setLayout} 
        className="space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {layout.map((window) => {
            if (!window.visible) return null;
            
            const isFullWidth = window.width === "full";
            const colSpan = isFullWidth ? "md:col-span-2" : "md:col-span-1";
            const Icon = {
              mail: Mail,
              instagram: MessageCircle,
              whatsapp: MessageCircle,
              facebook: MessageCircle,
              lead: Users,
              ai: Sparkles
            }[window.iconType];

            const iconColors = {
              mail: "text-danger",
              instagram: "text-[#c1c1ff]",
              whatsapp: "text-success",
              facebook: "text-info",
              lead: "text-cyan",
              ai: "text-cyan animate-pulse"
            }[window.iconType];

            return (
              <Reorder.Item
                key={window.id}
                value={window}
                dragListener={!window.pinned}
                className={`flex flex-col rounded-3xl ${colSpan} transition-all duration-300`}
                style={{ height: window.height }}
              >
                <GlassCard 
                  className="flex-1 flex flex-col overflow-hidden !p-0 relative group border-white/10"
                  tilt={!window.pinned}
                >
                  {/* Window Header */}
                  <header 
                    className={`h-12 bg-white/[.03] border-b border-white/10 flex items-center justify-between px-5 ${
                      window.pinned ? "cursor-default" : "cursor-grab active:cursor-grabbing"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={18} className={iconColors} />
                      <h2 className="font-bold text-sm text-textPrimary">{window.title}</h2>
                      {window.badge && (
                        <Badge tone={window.badge.includes("Hot") ? "green" : window.badge.includes("New") ? "red" : "amber"}>
                          {window.badge}
                        </Badge>
                      )}
                    </div>

                    {/* Window Controls */}
                    <div className="flex items-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => togglePin(window.id)} 
                        title={window.pinned ? "Unlock panel drag" : "Lock panel position"}
                        className="p-1 hover:bg-white/10 rounded-lg text-textMuted hover:text-textPrimary"
                      >
                        {window.pinned ? <PinOff size={14} /> : <Pin size={14} />}
                      </button>
                      <button 
                        onClick={() => toggleWidth(window.id)} 
                        title={isFullWidth ? "Shrink width" : "Expand to full width"}
                        className="p-1 hover:bg-white/10 rounded-lg text-textMuted hover:text-textPrimary"
                      >
                        <LayoutGrid size={14} />
                      </button>
                      <button 
                        onClick={() => resizeHeight(window.id, "inc")}
                        title="Increase height"
                        className="p-1 hover:bg-white/10 rounded-lg text-textMuted hover:text-textPrimary"
                      >
                        +
                      </button>
                      <button 
                        onClick={() => resizeHeight(window.id, "dec")}
                        title="Decrease height"
                        className="p-1 hover:bg-white/10 rounded-lg text-textMuted hover:text-textPrimary"
                      >
                        -
                      </button>
                      <button 
                        onClick={() => setPoppedOut(window.id)} 
                        title="Pop out window"
                        className="p-1 hover:bg-white/10 rounded-lg text-textMuted hover:text-textPrimary"
                      >
                        <Maximize2 size={14} />
                      </button>
                      <button 
                        onClick={() => toggleVisible(window.id)} 
                        title="Minimize / hide"
                        className="p-1 hover:bg-white/10 rounded-lg text-textMuted hover:text-textPrimary"
                      >
                        <EyeOff size={14} />
                      </button>
                    </div>
                  </header>

                  {/* Window Content */}
                  <div className="flex-1 overflow-y-auto custom-scrollbar p-5">
                    {window.id === "gmail" && <GmailContent />}
                    {window.id === "instagram" && (
                      <InstagramContent 
                        messages={igMessages} 
                        onSendReply={handleSendIgReply} 
                        inputValue={chatInputs.instagram || ""}
                        onInputChange={(val) => handleInputChange("instagram", val)}
                      />
                    )}
                    {window.id === "whatsapp" && <WhatsappContent />}
                    {window.id === "facebook" && <FacebookContent />}
                    {window.id === "lead-details" && <LeadDetailsContent />}
                    {window.id === "ai-copilot" && <AiAssistantWidget />}
                  </div>
                </GlassCard>
              </Reorder.Item>
            );
          })}
        </div>
      </Reorder.Group>

      {/* Pop out Modal Overlay */}
      <AnimatePresence>
        {poppedOut && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md grid place-items-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="w-full max-w-4xl max-h-[85vh] overflow-hidden"
            >
              <GlassCard className="flex flex-col max-h-[85vh] !p-0 border-white/20">
                <header className="h-14 bg-white/5 border-b border-white/10 flex items-center justify-between px-6">
                  <span className="font-bold text-lg text-textPrimary">
                    Expanded: {layout.find(w => w.id === poppedOut)?.title}
                  </span>
                  <Button variant="ghost" onClick={() => setPoppedOut(null)} className="!px-3 !py-1">
                    Close
                  </Button>
                </header>
                <div className="overflow-y-auto p-6 max-h-[calc(85vh-56px)]">
                  {poppedOut === "gmail" && <GmailContent />}
                  {poppedOut === "instagram" && (
                    <InstagramContent 
                      messages={igMessages} 
                      onSendReply={handleSendIgReply} 
                      inputValue={chatInputs.instagram || ""}
                      onInputChange={(val) => handleInputChange("instagram", val)}
                    />
                  )}
                  {poppedOut === "whatsapp" && <WhatsappContent />}
                  {poppedOut === "facebook" && <FacebookContent />}
                  {poppedOut === "lead-details" && <LeadDetailsContent />}
                  {poppedOut === "ai-copilot" && <AiAssistantWidget />}
                </div>
              </GlassCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Save Layout Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 right-6 z-50 rounded-2xl bg-cyan/10 border border-cyan/40 px-5 py-3 text-[#c1c1ff] shadow-[0_10px_30px_rgba(45,212,191,0.15)] flex items-center gap-3 backdrop-blur-lg"
          >
            <Sparkles size={18} className="text-cyan animate-spin" />
            <span className="font-bold text-sm">Workspace layout successfully saved!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </AppShell>
  );
}

/* Individual Content Sub-components */

function GmailContent() {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-cyan/20 bg-cyan/5 p-4 flex gap-3 items-start">
        <Sparkles className="text-cyan flex-shrink-0" size={16} />
        <div>
          <strong className="text-xs font-bold text-cyan uppercase tracking-wider">AI Summary</strong>
          <p className="text-xs text-textSecondary leading-relaxed mt-1">
            Sarah Jenkins (TechFlow) requests a proposal contract modification. Recommended action: Approve Q3 design deliverables list and trigger contract send.
          </p>
        </div>
      </div>
      
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 space-y-3 hover:bg-white/[0.06] transition-all">
        <div className="flex justify-between items-center text-xs">
          <strong className="text-textPrimary text-sm">Sarah Jenkins (TechFlow)</strong>
          <span className="text-textMuted">10:42 AM</span>
        </div>
        <div>
          <p className="text-xs font-semibold text-[#c1c1ff] mb-1">Re: Enterprise Tier Expansion</p>
          <p className="text-xs text-textSecondary line-clamp-2">
            Hi Alex, the pricing details are approved on our side. However, our legal team requires a revisions clause in section 4. Can you send the contract with this modification today?
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 opacity-60">
        <div className="flex justify-between items-center text-xs">
          <strong className="text-textPrimary text-sm">Marcus Vance</strong>
          <span className="text-textMuted">Yesterday</span>
        </div>
        <p className="text-xs font-semibold text-textSecondary mt-1">Re: Q3 Campaign Deliverables Review</p>
      </div>
    </div>
  );
}

function InstagramContent({ 
  messages, 
  onSendReply, 
  inputValue, 
  onInputChange 
}: { 
  messages: Array<{ sender: string, body: string, sentAt: string, type: string }>, 
  onSendReply: (text: string) => void, 
  inputValue: string, 
  onInputChange: (val: string) => void 
}) {
  const suggestReply = "Thanks! We're thrilled you liked it. The next collection drops on the 15th. Want early access?";

  return (
    <div className="flex flex-col h-full justify-between gap-4 min-h-[260px]">
      <div className="space-y-4 overflow-y-auto max-h-[160px] custom-scrollbar flex-1 pr-1">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.type === "outbound" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] rounded-2xl p-3.5 text-xs ${
              m.type === "outbound" 
                ? "bg-indigo/25 text-[#c1c1ff] border border-indigo/30 rounded-tr-none" 
                : "bg-white/[0.06] text-textSecondary rounded-tl-none border border-white/5"
            }`}>
              <div className="flex justify-between items-center gap-4 mb-1">
                <strong className="text-[10px] font-bold opacity-75">{m.sender}</strong>
                <span className="text-[9px] text-textMuted">{m.sentAt}</span>
              </div>
              <p className="leading-relaxed">{m.body}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Suggested AI Action */}
      <div className="rounded-2xl border border-cyan/20 bg-cyan/5 p-3.5 space-y-3">
        <div className="flex items-center gap-1.5 text-cyan text-xs font-bold">
          <Sparkles size={14} className="animate-pulse" /> Suggested Reply
        </div>
        <p className="text-xs text-textSecondary leading-relaxed">{suggestReply}</p>
        <div className="flex gap-2">
          <Button 
            className="flex-1 !py-1.5 !px-3 text-xs" 
            onClick={() => {
              onSendReply(suggestReply);
            }}
          >
            Apply & Send
          </Button>
          <Button 
            variant="ghost" 
            className="!py-1.5 !px-3 text-xs" 
            onClick={() => onInputChange(suggestReply)}
          >
            Edit suggestion
          </Button>
        </div>
      </div>

      {/* Input */}
      <div className="flex gap-2 items-center">
        <input 
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onSendReply(inputValue);
              onInputChange("");
            }
          }}
          className="flex-1 rounded-xl bg-white/[0.03] border border-white/10 py-2 px-3.5 text-xs text-textPrimary outline-none focus:border-cyan focus:ring-1 focus:ring-cyan transition-all" 
          placeholder="Reply to DMs..." 
        />
        <button 
          onClick={() => {
            onSendReply(inputValue);
            onInputChange("");
          }}
          className="p-2 rounded-xl bg-indigo/20 text-[#c1c1ff] border border-indigo/40 hover:bg-indigo/35 transition-all"
        >
          <Send size={14} />
        </button>
      </div>
    </div>
  );
}

function WhatsappContent() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center p-3 rounded-2xl bg-white/[0.03] border border-white/5">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-xl bg-indigo/10 border border-indigo/20 flex items-center justify-center text-xs font-bold text-[#c1c1ff]">JD</div>
          <div>
            <h4 className="text-sm font-bold text-textPrimary">John Doe</h4>
            <p className="text-[10px] text-textMuted">+1 555-0198</p>
          </div>
        </div>
        <Badge tone="green">Hot Lead</Badge>
      </div>

      <div className="space-y-3">
        <div className="bg-white/[0.05] rounded-2xl p-4 border border-white/5 text-xs text-textSecondary space-y-1">
          <div className="flex justify-between text-[10px]">
            <strong>John Doe</strong>
            <span className="text-textMuted">09:15 AM</span>
          </div>
          <p>Hi there, we would love to review the agency onboarding deck and discuss retaining your team for growth campaigns.</p>
        </div>

        <div className="bg-white/[0.05] rounded-2xl p-4 border border-white/5 text-xs text-textSecondary space-y-1 opacity-70">
          <div className="flex justify-between text-[10px]">
            <strong>John Doe</strong>
            <span className="text-textMuted">09:17 AM</span>
          </div>
          <p>Do you have slots open tomorrow for a 15 min intro call?</p>
        </div>
      </div>
    </div>
  );
}

function FacebookContent() {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-warning/20 bg-warning/5 p-4 flex gap-3 items-start">
        <Bot className="text-warning flex-shrink-0" size={16} />
        <div>
          <strong className="text-xs font-bold text-warning uppercase tracking-wider">SLA Breach Warning</strong>
          <p className="text-xs text-textSecondary leading-relaxed mt-1">
            Mike Ross has been waiting for a response for over 2 hours. SLA limit: 1 hour.
          </p>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 space-y-3 hover:bg-white/[0.06] transition-all cursor-pointer">
        <div className="flex justify-between items-center text-xs">
          <strong className="text-textPrimary text-sm">Mike Ross</strong>
          <Badge tone="amber">Pending</Badge>
        </div>
        <p className="text-xs text-textSecondary line-clamp-2">
          I haven't received my tracking number yet. Order #4492. Can someone please look into this as it was supposed to ship Monday.
        </p>
      </div>
    </div>
  );
}

function LeadDetailsContent() {
  const progress = 92;
  return (
    <div className="space-y-5">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-2xl font-black bg-gradient-to-r from-white to-[#cbd5e1] bg-clip-text text-transparent">Sarah Jenkins</h3>
          <p className="text-xs text-textMuted font-bold">TechFlow Ltd. (Enterprise Tier)</p>
        </div>
        <Badge tone="indigo">$45,000 Est. Value</Badge>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4">
          <span className="text-[10px] uppercase font-bold text-textMuted tracking-wider">Lead Score</span>
          <div className="flex items-end gap-2 mt-1">
            <strong className="text-3xl font-black text-cyan">{progress}</strong>
            <span className="text-xs text-textMuted pb-1">/100</span>
          </div>
          <div className="w-full bg-white/10 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-cyan h-full rounded-full" style={{ width: `${progress}%` }}></div>
          </div>
        </div>

        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4">
          <span className="text-[10px] uppercase font-bold text-textMuted tracking-wider">Conversion Propensity</span>
          <strong className="text-3xl font-black text-[#c1c1ff] block mt-1">High</strong>
          <span className="text-[10px] text-cyan mt-1 block">✓ 94% forecast success</span>
        </div>
      </div>

      <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 space-y-2 text-xs">
        <strong className="text-textPrimary block">AI Copilot Recommendation</strong>
        <p className="text-textSecondary leading-relaxed">
          High expansion probability. Recommend scheduling a face-to-face demo. Do not let lead cold. Last touchpoint: 10m ago.
        </p>
      </div>
    </div>
  );
}

function AiAssistantWidget() {
  const [askText, setAskText] = useState("");
  const [replies, setReplies] = useState<string[]>([]);

  const handleAsk = () => {
    if (!askText.trim()) return;
    const query = askText.toLowerCase();
    let reply = "I've searched your logs. I can't find direct details about that, but Qchart's live database sync is online.";
    if (query.includes("techflow") || query.includes("sarah")) {
      reply = "Sarah Jenkins (TechFlow) is ready for proposal review. She opened the Q3 scope document 3 times today.";
    } else if (query.includes("overdue") || query.includes("lead")) {
      reply = "You have 3 overdue leads: TechFlow, Global Freight, and Acme Corp. Immediate response is suggested.";
    } else if (query.includes("whatsapp")) {
      reply = "John Doe is a hot lead on WhatsApp. He's asking for a product demo tomorrow morning.";
    }
    setReplies(prev => [...prev, reply]);
    setAskText("");
  };

  return (
    <div className="flex flex-col h-full justify-between gap-4 min-h-[260px]">
      <div className="space-y-4 flex-1 overflow-y-auto max-h-[170px] custom-scrollbar">
        <div className="rounded-2xl border border-white/10 bg-[#12182B] p-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-primary-container/10 blur-xl rounded-full"></div>
          <h3 className="text-xs font-bold text-textPrimary mb-1.5 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-danger animate-pulse"></span> Contextual Alert
          </h3>
          <p className="text-xs text-textSecondary leading-relaxed">
            TechCorp (Gmail) is requesting a pricing upgrade. This aligns with your Q3 expansion goals. Suggest scheduling a call immediately.
          </p>
        </div>

        {replies.map((reply, i) => (
          <div key={i} className="rounded-2xl border border-[#2dd4bf]/20 bg-[#2dd4bf]/5 p-4 text-xs text-textSecondary flex gap-2">
            <Bot size={14} className="text-cyan flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed">{reply}</p>
          </div>
        ))}
      </div>

      {/* Query Bar */}
      <div className="flex gap-2 items-center">
        <input 
          value={askText}
          onChange={(e) => setAskText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleAsk();
          }}
          className="flex-1 rounded-xl bg-white/[0.03] border border-white/10 py-2 px-3.5 text-xs text-textPrimary outline-none focus:border-cyan focus:ring-1 focus:ring-cyan transition-all" 
          placeholder="Ask AI Copilot..." 
        />
        <button 
          onClick={handleAsk}
          className="p-2 rounded-xl bg-[#2dd4bf]/20 text-[#2dd4bf] border border-[#2dd4bf]/40 hover:bg-[#2dd4bf]/35 transition-all"
        >
          <Send size={14} />
        </button>
      </div>
    </div>
  );
}
