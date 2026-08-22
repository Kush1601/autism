"use client";

import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Send, Bot, Stethoscope, AlertCircle, Loader2, ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";

interface Message {
  role: "user" | "ai";
  content: string;
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-1 py-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-2 w-2 rounded-full bg-emerald-400 animate-bounce"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  );
}

export function ChatClient({ childId, childName }: { childId: string | null; childName: string | null }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      content: childName
        ? `Hello! I'm your **AI Developmental Assistant**. I can see **${childName}'s** profile and am ready to help you.\n\nWhat would you like to know?`
        : "Hello! I'm your **AI Developmental Assistant**, specialised in autism spectrum disorders for children aged 4–11.\n\nHow can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const history = messages.map((m) => ({ role: m.role, content: m.content }));
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage, history, childContext: { childId } }),
      });

      const data = await response.json();
      const text =
        typeof data.response === "string" && data.response.length > 0
          ? data.response
          : typeof data.error === "string"
          ? data.error
          : "I'm sorry, I encountered an error. Please try again.";
      setMessages((prev) => [...prev, { role: "ai", content: text }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: "Sorry, I'm having trouble connecting right now. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-emerald-50/40 to-white">
      {/* Header */}
      <header className="flex-none flex items-center gap-3 px-5 py-3.5 bg-white border-b border-neutral-100 shadow-sm z-10">
        <Link
          href="/dashboard"
          className="flex items-center gap-1.5 text-neutral-400 hover:text-emerald-600 transition-colors text-sm font-medium mr-1"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>

        <div className="w-px h-5 bg-neutral-200" />

        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-sm">
            <Stethoscope className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-neutral-900 leading-none">AI Doctor Assistant</p>
            <p className="text-[11px] text-neutral-400 mt-0.5">
              {childName ? `Viewing: ${childName}` : "Pediatric Development & ASD"}
            </p>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-1.5 text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
          <Sparkles className="h-3 w-3" />
          AI Powered
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-2xl mx-auto space-y-4">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex items-end gap-2.5 ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {m.role === "ai" && (
                <div className="h-7 w-7 shrink-0 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-sm mb-0.5">
                  <Bot className="h-3.5 w-3.5 text-white" />
                </div>
              )}

              <div
                className={`max-w-[78%] px-4 py-3 text-sm leading-relaxed ${
                  m.role === "ai"
                    ? "bg-white rounded-2xl rounded-bl-sm shadow-sm border border-neutral-100 text-neutral-800"
                    : "bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-2xl rounded-br-sm shadow-md"
                }`}
              >
                {m.role === "ai" ? (
                  <div className="prose prose-sm prose-neutral max-w-none prose-p:my-1 prose-ul:my-1.5 prose-li:my-0.5 prose-headings:mt-2 prose-headings:mb-1 prose-strong:text-emerald-700">
                    <ReactMarkdown>{m.content}</ReactMarkdown>
                  </div>
                ) : (
                  <span>{m.content}</span>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-end gap-2.5 justify-start">
              <div className="h-7 w-7 shrink-0 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-sm">
                <Bot className="h-3.5 w-3.5 text-white" />
              </div>
              <div className="bg-white rounded-2xl rounded-bl-sm shadow-sm border border-neutral-100 px-4 py-3">
                <TypingDots />
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input bar */}
      <div className="flex-none bg-white border-t border-neutral-100 px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.04)]">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-2 bg-neutral-50 border border-neutral-200 rounded-2xl px-4 py-2 focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-100 transition-all">
            <input
              className="flex-1 bg-transparent text-sm text-neutral-800 placeholder:text-neutral-400 outline-none py-1.5 min-w-0"
              placeholder={childName ? `Ask about ${childName}'s progress, therapies, or concerns…` : "Ask about screening results, therapies, or concerns…"}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="h-8 w-8 flex items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-sm disabled:opacity-40 disabled:cursor-not-allowed hover:from-emerald-600 hover:to-emerald-700 transition-all shrink-0"
            >
              {isLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
            </button>
          </div>

          <p className="flex items-center gap-1.5 mt-2 text-[11px] text-neutral-400 px-1">
            <AlertCircle className="h-3 w-3 shrink-0" />
            Not a substitute for professional medical advice. Always consult a specialist.
          </p>
        </div>
      </div>
    </div>
  );
}
