"use client";

import { useState, useEffect } from "react";
import { Plus, Sparkles, TrendingUp, AlertCircle, CheckCircle, ArrowRight } from "lucide-react";
import type { Lead, LeadStage } from "@qchart/shared";
import { AppShell } from "@/components/app-shell";
import { Badge, Button, GlassCard, SectionHeader } from "@/components/ui";
import { useLeads } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";

const stages: Array<{ id: LeadStage; label: string }> = [
  { id: "new", label: "New" }, 
  { id: "contacted", label: "Contacted" }, 
  { id: "qualified", label: "Qualified" }, 
  { id: "proposal", label: "Proposal" }, 
  { id: "won", label: "Won" }
];

export default function PipelinePage() {
  const { data = [] } = useLeads(); 
  const [items, setItems] = useState<Lead[]>([]);
  const [draggedOverColumn, setDraggedOverColumn] = useState<LeadStage | null>(null);

  // Sync state with SWR data when loaded
  useEffect(() => {
    if (data.length > 0 && items.length === 0) {
      setItems(data);
    }
  }, [data, items.length]);

  const moveLead = (id: string, stage: LeadStage) => {
    setItems(prev => prev.map((lead) => lead.id === id ? { ...lead, stage } : lead));
  };

  const handleDragStart = (e: React.DragEvent, leadId: string) => {
    e.dataTransfer.setData("text/plain", leadId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, stageId: LeadStage) => {
    e.preventDefault();
  };

  const handleDragEnter = (e: React.DragEvent, stageId: LeadStage) => {
    e.preventDefault();
    setDraggedOverColumn(stageId);
  };

  const handleDragLeave = () => {
    setDraggedOverColumn(null);
  };

  const handleDrop = (e: React.DragEvent, stageId: LeadStage) => {
    e.preventDefault();
    const leadId = e.dataTransfer.getData("text/plain");
    if (leadId) {
      moveLead(leadId, stageId);
    }
    setDraggedOverColumn(null);
  };

  const autoPrioritize = () => {
    // Custom sort: Hot leads first, high score first
    const sorted = [...items].sort((a, b) => {
      if (a.status === "hot" && b.status !== "hot") return -1;
      if (a.status !== "hot" && b.status === "hot") return 1;
      return b.score - a.score;
    });
    setItems(sorted);
  };

  const addNewLead = () => {
    const names = ["Aria Smith", "Devon Cole", "Leah Vance", "Riley Croft"];
    const companies = ["OmniMedia", "Vertex Lab", "Nexa Corp", "Core AI"];
    const randomIdx = Math.floor(Math.random() * names.length);
    
    const newLead: Lead = {
      id: `lead_${Date.now()}`,
      name: names[randomIdx],
      company: companies[randomIdx],
      stage: "new",
      score: Math.floor(Math.random() * 40) + 60,
      value: (Math.floor(Math.random() * 10) + 1) * 10000,
      status: Math.random() > 0.5 ? "hot" : "warm",
      lastActivity: "Just now"
    };
    
    setItems(prev => [newLead, ...prev]);
  };

  const visibleLeads = items.length ? items : data;

  return (
    <AppShell>
      <SectionHeader 
        title="Q3 Sales Pipeline" 
        description="Drag and drop cards across stages. AI auto-prioritizes deals based on response SLA and propensity score." 
        action={
          <div className="flex gap-3">
            <Button variant="ghost" onClick={autoPrioritize} className="flex items-center gap-2">
              <Sparkles className="text-cyan" size={18} /> AI Prioritize
            </Button>
            <Button onClick={addNewLead} className="flex items-center gap-2">
              <Plus size={18} /> New Lead
            </Button>
          </div>
        }
      />

      <section className="grid gap-5 overflow-x-auto pb-4 grid-cols-1 md:grid-cols-3 lg:grid-cols-5 min-h-[600px]">
        {stages.map((stage) => {
          const stageLeads = visibleLeads.filter((l) => l.stage === stage.id);
          const isOver = draggedOverColumn === stage.id;
          
          return (
            <GlassCard 
              key={stage.id} 
              className={`min-h-[520px] min-w-[240px] !p-4 flex flex-col justify-start transition-all duration-300 border ${
                isOver ? "border-cyan/40 bg-cyan/[0.04] shadow-[0_0_20px_rgba(45,212,191,0.08)]" : "border-white/10"
              }`}
              onDragOver={(e) => handleDragOver(e, stage.id)}
              onDragEnter={(e) => handleDragEnter(e, stage.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, stage.id)}
            >
              {/* Stage Header */}
              <div className="mb-5 flex justify-between items-center">
                <h2 className="font-bold text-xs uppercase tracking-[0.14em] text-textSecondary flex items-center gap-1.5">
                  <span className={`size-2 rounded-full ${
                    stage.id === "won" ? "bg-success" : stage.id === "proposal" ? "bg-indigo" : "bg-textMuted"
                  }`} />
                  {stage.label}
                </h2>
                <Badge tone={stage.id === "won" ? "green" : "cyan"}>{stageLeads.length}</Badge>
              </div>

              {/* Lead Cards List */}
              <div className="space-y-4 flex-1">
                <AnimatePresence mode="popLayout">
                  {stageLeads.map((lead) => {
                    const isHot = lead.status === "hot";
                    const isRisk = lead.status === "risk";
                    
                    return (
                      <motion.div
                        key={lead.id}
                        layout
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 350, damping: 25 }}
                        draggable
                        onDragStart={(e) => handleDragStart(e, lead.id)}
                        className="cursor-grab active:cursor-grabbing rounded-2xl border border-white/10 bg-white/[0.04] p-4.5 hover:bg-white/[0.08] hover:border-white/20 transition-all group relative overflow-hidden"
                      >
                        {isHot && (
                          <div className="absolute top-0 right-0 w-8 h-8 bg-success/20 blur-md rounded-full"></div>
                        )}
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-base font-bold text-textPrimary group-hover:text-[#c1c1ff] transition-colors">{lead.name}</h3>
                            <p className="text-xs text-textMuted font-bold mt-0.5">{lead.company}</p>
                          </div>
                          <span className={`size-2.5 rounded-full ${
                            isHot ? "bg-success" : isRisk ? "bg-danger" : "bg-warning"
                          }`} title={lead.status} />
                        </div>

                        <div className="mt-4 flex items-center justify-between text-xs">
                          <Badge tone={lead.score >= 80 ? "indigo" : "cyan"}>
                            Score: {lead.score}
                          </Badge>
                          <span className="text-[10px] text-textMuted">{lead.lastActivity}</span>
                        </div>

                        <div className="mt-4 border-t border-white/5 pt-3 flex items-center justify-between">
                          <span className="text-xs font-bold text-textSecondary">
                            ${lead.value.toLocaleString()}
                          </span>
                          <span className="text-[10px] text-textMuted font-medium uppercase tracking-wider">Est. Value</span>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>

                {stageLeads.length === 0 && (
                  <div className="h-full min-h-[300px] flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 text-textMuted p-4 text-center">
                    <span className="text-xs opacity-50">Drag deals here</span>
                  </div>
                )}
              </div>
            </GlassCard>
          );
        })}
      </section>
    </AppShell>
  );
}
