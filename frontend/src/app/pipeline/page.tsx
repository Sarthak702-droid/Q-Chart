"use client";

import { useState } from "react";
import { SlidersHorizontal, Plus, Search, Sparkles, Filter, ChevronRight, Zap, Target } from "lucide-react";

import { AppShell } from "@/components/AppShell";
import { GlassPanel, StatusBadge } from "@/components/ui";
import { pipelineColumns } from "@/lib/app-data";

export default function PipelinePage() {
  const [columns, setColumns] = useState(pipelineColumns);
  const [selectedCard, setSelectedCard] = useState<any>(pipelineColumns[0].cards[0]);

  return (
    <AppShell
      title="Sales Pipeline"
      description="Track deals, lead scores, and AI recommendations across your customer acquisition pipeline."
      showAiPanel
      aiPanel={<PipelineAiPanel card={selectedCard} />}
      action={
        <button className="app-action text-xs font-bold py-1.5 px-4 rounded-xl flex items-center gap-1">
          <Plus size={14} /> Add Deal
        </button>
      }
    >
      <div className="space-y-6">
        {/* Kanban Board Container */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 overflow-x-auto pb-4">
          {columns.map((column) => (
            <div key={column.title} className="flex flex-col gap-4 min-w-[250px]">
              {/* Column Header */}
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                  <span 
                    className="w-2.5 h-2.5 rounded-full" 
                    style={{ backgroundColor: column.color }}
                  />
                  <h3 className="font-display text-sm font-bold text-white">{column.title}</h3>
                </div>
                <span className="text-xs text-slate-500 font-bold bg-white/5 px-2 py-0.5 rounded-full">
                  {column.cards.length}
                </span>
              </div>

              {/* Column Body / Dropzone */}
              <div className="glass-panel p-3 rounded-2xl bg-white/[0.02] border border-white/5 min-h-[400px] flex flex-col gap-3">
                {column.cards.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-xl p-4 text-center text-slate-500 text-xs">
                    <Target className="w-8 h-8 mb-2 opacity-30" />
                    <span>No active deals</span>
                  </div>
                ) : (
                  column.cards.map((card) => (
                    <div
                      key={card.name}
                      onClick={() => setSelectedCard(card)}
                      className={`glass-card p-4 rounded-xl cursor-pointer border transition-all ${
                        selectedCard?.name === card.name 
                          ? "border-[#5b5ceb] bg-white/10" 
                          : "border-white/5 bg-white/[0.04] hover:bg-white/[0.08]"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-bold text-white">{card.name}</span>
                        <StatusBadge tone={card.tone as any}>{card.score}/100</StatusBadge>
                      </div>
                      <p className="text-[11px] text-slate-400 mb-2">{card.company}</p>
                      <div className="flex justify-between items-center pt-2 border-t border-white/5 text-[10px] text-slate-500">
                        <span>{card.value}</span>
                        <span>{card.age}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}

function PipelineAiPanel({ card }: { card: any }) {
  if (!card) {
    return (
      <article className="ai-card border border-[#2dd4bf]/20 bg-[#2dd4bf]/5 p-4 rounded-xl text-center">
        <span className="font-sans text-xs text-slate-400">Select a lead card to view AI lead intelligence.</span>
      </article>
    );
  }

  return (
    <div className="space-y-6">
      {/* Lead Intel */}
      <article className="ai-card border border-[#2dd4bf]/20 bg-[#2dd4bf]/5 p-4 rounded-xl">
        <span className="font-display text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-2">
          Lead Intelligence
        </span>
        <h3 className="font-display text-base font-bold text-white mb-1">{card.name}</h3>
        <p className="text-xs text-slate-400 mb-4">{card.company}</p>

        <div className="space-y-3 pt-3 border-t border-white/5 text-xs">
          <div className="flex justify-between">
            <span className="text-slate-400">Estimated Value:</span>
            <span className="text-white font-semibold">{card.value}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">AI Engagement Score:</span>
            <span className="text-emerald-500 font-semibold">{card.score}/100</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Relative Age:</span>
            <span className="text-white">{card.age}</span>
          </div>
        </div>
      </article>

      {/* AI Recommendation */}
      <article className="ai-card border border-[#5b5ceb]/20 bg-[#5b5ceb]/5 p-4 rounded-xl">
        <span className="font-display text-xs font-semibold text-[#2dd4bf] uppercase tracking-widest block mb-2">
          Suggested Action
        </span>
        {card.score > 80 ? (
          <>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              This lead has high engagement and sentiment. Send a calendar proposal to finalize seats.
            </p>
            <button className="app-action w-full py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1">
              <Sparkles size={12} /> Draft Proposal Invite
            </button>
          </>
        ) : (
          <>
            <p className="text-xs text-slate-300 leading-relaxed">
              Maintain follow-up pattern. Ensure the last query regarding project delivery timeline has been addressed.
            </p>
          </>
        )}
      </article>
    </div>
  );
}
