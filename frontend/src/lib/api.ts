const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000";

export type GmailStatus = {
  connected: boolean;
  email?: string | null;
};

export type GmailMessage = {
  id: string;
  thread_id: string;
  from_email: string;
  subject: string;
  snippet: string;
  date: string;
};

export type TelegramStatus = {
  connected: boolean;
  bot_username?: string | null;
};

export type TelegramMessage = {
  message_id: string;
  chat_id: string;
  from_name: string;
  text: string;
  date?: number | null;
};

export type AiStatus = {
  configured: boolean;
  provider: string;
  model: string;
};

export type AiTone = "professional" | "friendly" | "short" | "detailed" | "helpful";

export type AiReplySuggestion = {
  provider: string;
  model: string;
  suggestion: string;
};

export type AiImprovedReply = {
  provider: string;
  model: string;
  improved_reply: string;
};

export type AiConversationInsights = {
  provider: string;
  model: string;
  insights: {
    summary: string;
    intent: string;
    sentiment: string;
    urgency: string;
    suggested_next_action: string;
  };
};

export type RequestOtpResponse = {
  status: string;
  delivery: "terminal";
};

export type VerifyOtpResponse = {
  status: string;
  access_token: string;
  token_type: string;
};

export async function apiGet<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(await response.text());
  }
  return response.json() as Promise<T>;
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  if (!response.ok) {
    throw new Error(await response.text());
  }
  return response.json() as Promise<T>;
}

export async function connectGmail(): Promise<void> {
  const payload = await apiGet<{ auth_url: string }>("/integrations/gmail/auth-url");
  window.location.href = payload.auth_url;
}

export async function generateReplySuggestion(payload: {
  platform: string;
  customer_message: string;
  recent_context?: string[];
  tone?: AiTone;
}): Promise<AiReplySuggestion> {
  return apiPost<AiReplySuggestion>("/ai/reply-suggestion", payload);
}

export async function improveReply(payload: {
  draft: string;
  customer_message: string;
  tone?: AiTone;
}): Promise<AiImprovedReply> {
  return apiPost<AiImprovedReply>("/ai/improve-reply", payload);
}

export async function getConversationInsights(payload: {
  platform: string;
  customer_message: string;
  recent_context?: string[];
}): Promise<AiConversationInsights> {
  return apiPost<AiConversationInsights>("/ai/conversation-insights", payload);
}

export async function requestOtp(phone: string): Promise<RequestOtpResponse> {
  return apiPost<RequestOtpResponse>("/auth/request-otp", { phone });
}

export async function verifyOtp(phone: string, otp: string): Promise<VerifyOtpResponse> {
  return apiPost<VerifyOtpResponse>("/auth/verify-otp", { phone, otp });
}
