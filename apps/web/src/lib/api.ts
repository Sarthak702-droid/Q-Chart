"use client";

import useSWR, { mutate } from "swr";
import { analyticsSummary, channels, conversations, createCsvReport, dashboardSummary, leads, profile, workspace } from "@qchart/shared";
import { createSupabaseClient } from "./supabase";

const gatewayUrl = process.env.NEXT_PUBLIC_GATEWAY_URL ?? "http://localhost:4100";

async function getAuthHeader(): Promise<string> {
  try {
    const supabase = createSupabaseClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      return `Bearer ${session.access_token}`;
    }
  } catch (e) {
    // Ignore error in server-side rendering or missing keys
  }
  return "Bearer dev-token";
}

async function fetcher<T>(path: string, fallback: T): Promise<T> {
  if (!gatewayUrl) return fallback;
  try {
    const authHeader = await getAuthHeader();
    const response = await fetch(`${gatewayUrl}${path}`, { 
      headers: { 
        Authorization: authHeader,
        "Content-Type": "application/json"
      } 
    });
    return response.ok ? response.json() as Promise<T> : fallback;
  } catch (err) {
    console.warn(`Gateway fetch failed for ${path}, using local module fallback data.`);
    return fallback;
  }
}

export const useMe = () => useSWR("/me", () => fetcher("/me", { profile, workspace }), { fallbackData: { profile, workspace } });
export const useDashboardSummary = () => useSWR("/dashboard/summary", () => fetcher("/dashboard/summary", dashboardSummary), { fallbackData: dashboardSummary });
export const useConversations = () => useSWR("/conversations", () => fetcher("/conversations", conversations), { fallbackData: conversations });
export const useLeads = () => useSWR("/leads", () => fetcher("/leads", leads), { fallbackData: leads });
export const useAnalytics = () => useSWR("/analytics/personal", () => fetcher("/analytics/personal", analyticsSummary), { fallbackData: analyticsSummary });
export const useChannels = () => useSWR("/channels", () => fetcher("/channels", channels), { fallbackData: channels });

export function exportReport() {
  const blob = new Blob([createCsvReport()], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "qchart-report.csv";
  anchor.click();
  URL.revokeObjectURL(url);
}

// Post message via API gateway
export async function postMessage(conversationId: string, body: string) {
  try {
    const authHeader = await getAuthHeader();
    const response = await fetch(`${gatewayUrl}/messages`, {
      method: "POST",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ conversationId, body })
    });
    if (response.ok) {
      mutate("/conversations"); // Trigger refresh
      return await response.json();
    }
  } catch (err) {
    console.error("Failed to post message", err);
  }
  // In-memory fallback mutation
  const { appendMessage } = await import("@qchart/shared");
  const updated = appendMessage(conversationId, body);
  mutate("/conversations");
  return updated;
}

// Update lead stage via API gateway
export async function updateLeadStage(leadId: string, stage: string) {
  try {
    const authHeader = await getAuthHeader();
    const response = await fetch(`${gatewayUrl}/leads/${leadId}`, {
      method: "PATCH",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ stage })
    });
    if (response.ok) {
      mutate("/leads");
      return await response.json();
    }
  } catch (err) {
    console.error("Failed to update lead stage", err);
  }
  // In-memory fallback mutation
  const { moveLeadStage } = await import("@qchart/shared");
  const updated = moveLeadStage(leadId, stage as never);
  mutate("/leads");
  return updated;
}

// Real-time Supabase Postgres sync subscription
export function setupRealtimeSync() {
  if (typeof window === "undefined") return () => {};
  
  try {
    const supabase = createSupabaseClient();
    
    const channel = supabase
      .channel("qchart-realtime-sync")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "leads" },
        () => {
          console.log("Realtime: leads updated");
          mutate("/leads");
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "conversations" },
        () => {
          console.log("Realtime: conversations updated");
          mutate("/conversations");
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "messages" },
        () => {
          console.log("Realtime: messages updated");
          mutate("/conversations"); // Refresh conversations list/messages
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  } catch (e) {
    console.warn("Supabase real-time subscription is not active (check keys or database connection).");
    return () => {};
  }
}
