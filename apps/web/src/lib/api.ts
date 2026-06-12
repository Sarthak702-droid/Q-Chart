"use client";

import useSWR from "swr";
import { analyticsSummary, channels, conversations, createCsvReport, dashboardSummary, leads, profile, workspace } from "@qchart/shared";

const gatewayUrl = process.env.NEXT_PUBLIC_GATEWAY_URL ?? "";

async function fetcher<T>(path: string, fallback: T): Promise<T> {
  if (!gatewayUrl) return fallback;
  const response = await fetch(`${gatewayUrl}${path}`, { headers: { Authorization: "Bearer dev-token" } });
  return response.ok ? response.json() as Promise<T> : fallback;
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
