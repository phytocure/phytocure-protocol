import { AppLayout } from "@/components/layout/AppLayout";
import { useListResearch } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import {
  Microscope,
  Plus,
  ArrowUpRight,
  Bot,
  Send,
  Trash2,
  ChevronDown,
  ChevronUp,
  Loader2,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useState, useRef, useEffect, useCallback } from "react";

function statusClass(status: string) {
  switch (status) {
    case "published":
      return "border-emerald-500/30 text-emerald-500/70";
    case "peer-review":
      return "border-blue-500/30 text-blue-500/70";
    case "in-progress":
      return "border-amber-500/30 text-amber-500/70";
    default:
      return "border-white/[0.20] text-white/30";
  }
}

type Message = {
  role: "user" | "assistant";
  content: string;
};

type Conversation = {
  id: number;
  title: string;
  createdAt: string;
  messages?: Message[];
};

function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchConversations = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/openai/conversations");
      if (res.ok) setConversations(await res.json());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchConversations();
  }, [fetchConversations]);

  return { conversations, loading, refetch: fetchConversations };
}

function AIAssistantPanel() {
  const { conversations, loading: convsLoading, refetch } = useConversations();
  const [activeConvId, setActiveConvId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [expanded, setExpanded] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadConversation = useCallback(async (id: number) => {
    setLoadingMessages(true);
    setActiveConvId(id);
    try {
      const res = await fetch(`/api/openai/conversations/${id}`);
      if (res.ok) {
        const data: { messages?: Message[] } = await res.json();
        setMessages(data.messages ?? []);
      }
    } finally {
      setLoadingMessages(false);
    }
  }, []);

  const createConversation = useCallback(async (firstMessage: string) => {
    const title =
      firstMessage.length > 50
        ? firstMessage.slice(0, 47) + "…"
        : firstMessage;
    const res = await fetch("/api/openai/conversations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    if (!res.ok) return null;
    const conv: Conversation = await res.json();
    await refetch();
    return conv.id;
  }, [refetch]);

  const deleteConversation = useCallback(async (id: number) => {
    await fetch(`/api/openai/conversations/${id}`, { method: "DELETE" });
    if (activeConvId === id) {
      setActiveConvId(null);
      setMessages([]);
    }
    await refetch();
  }, [activeConvId, refetch]);

  const sendMessage = useCallback(async () => {
    const content = input.trim();
    if (!content || streaming) return;

    setInput("");
    setStreaming(true);

    let convId = activeConvId;
    if (!convId) {
      convId = await createConversation(content);
      if (!convId) { setStreaming(false); return; }
      setActiveConvId(convId);
    }

    setMessages((prev) => [...prev, { role: "user", content }]);

    let assistantMsg = "";
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    try {
      const res = await fetch(`/api/openai/conversations/${convId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      if (!res.ok || !res.body) throw new Error("Stream failed");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        const lines = buf.split("\n");
        buf = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          try {
            const evt: { type: string; content?: string } = JSON.parse(
              line.slice(6)
            );
            if (evt.type === "delta" && evt.content) {
              assistantMsg += evt.content;
              setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = {
                  role: "assistant",
                  content: assistantMsg,
                };
                return updated;
              });
            }
          } catch {}
        }
      }
    } catch {
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "assistant",
          content: "Failed to get response. Please try again.",
        };
        return updated;
      });
    } finally {
      setStreaming(false);
      inputRef.current?.focus();
    }
  }, [input, streaming, activeConvId, createConversation]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void sendMessage();
    }
  };

  const startNew = () => {
    setActiveConvId(null);
    setMessages([]);
    inputRef.current?.focus();
  };

  return (
    <div className="border border-white/[0.16] rounded-sm">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between px-8 py-5 hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-3">
          <Bot className="w-4 h-4 text-primary" />
          <span className="section-label text-[11px]">AI: RESEARCH ASSISTANT</span>
          <span className="text-[10px] font-mono text-white/20 border border-white/[0.16] px-2 py-0.5 rounded-sm">
            PHYTOMIND v1
          </span>
        </div>
        {expanded ? (
          <ChevronUp className="w-3.5 h-3.5 text-white/20" />
        ) : (
          <ChevronDown className="w-3.5 h-3.5 text-white/20" />
        )}
      </button>

      {expanded && (
        <div className="border-t border-white/[0.16] flex" style={{ height: 520 }}>
          {/* Sidebar: conversation list, hidden on mobile */}
          <div className="hidden sm:flex w-56 flex-shrink-0 border-r border-white/[0.16] flex-col">
            <div className="px-4 py-3 flex items-center justify-between border-b border-white/[0.16]">
              <span className="text-[10px] font-mono text-white/50 uppercase tracking-widest">
                Sessions
              </span>
              <button
                onClick={startNew}
                className="text-[10px] font-mono text-primary/80 hover:text-primary transition-colors"
              >
                + New
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {convsLoading ? (
                <div className="p-4 space-y-2">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-8 bg-white/[0.08]" />
                  ))}
                </div>
              ) : conversations.length === 0 ? (
                <div className="p-4 text-center">
                  <p className="text-[10px] font-mono text-white/40">
                    No sessions yet
                  </p>
                </div>
              ) : (
                conversations.map((conv) => (
                  <div
                    key={conv.id}
                    className={`group flex items-center gap-1 px-3 py-2.5 cursor-pointer transition-colors ${
                      activeConvId === conv.id
                        ? "bg-white/[0.06]"
                        : "hover:bg-white/[0.03]"
                    }`}
                    onClick={() => void loadConversation(conv.id)}
                  >
                    <span
                      className={`flex-1 text-[11px] font-mono truncate leading-snug ${
                        activeConvId === conv.id
                          ? "text-white/90"
                          : "text-white/55"
                      }`}
                    >
                      {conv.title}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        void deleteConversation(conv.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 text-white/40 hover:text-red-400/80 transition-all"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Chat area */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
              {loadingMessages ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="w-5 h-5 text-white/20 animate-spin" />
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                  <Bot className="w-8 h-8 text-primary/40" />
                  <div>
                    <p className="text-white/70 text-sm mb-1 font-medium">
                      PhytoMind Research Assistant
                    </p>
                    <p className="text-white/40 text-xs max-w-xs">
                      Ask about cannabinoids, terpenes, clinical applications,
                      dosing protocols, or DeSci research.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 gap-2 mt-2 max-w-sm w-full">
                    {[
                      "What is the entourage effect?",
                      "Best strains for neuropathic pain?",
                      "How does CBD modulate the endocannabinoid system?",
                    ].map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => {
                          setInput(suggestion);
                          inputRef.current?.focus();
                        }}
                        className="text-left text-[11px] font-mono text-white/55 hover:text-white/80 border border-white/[0.10] hover:border-primary/30 px-3 py-2 rounded-sm transition-all"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex gap-3 ${
                      msg.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {msg.role === "assistant" && (
                      <div className="w-6 h-6 rounded-sm bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Bot className="w-3 h-3 text-primary/60" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] text-sm leading-relaxed whitespace-pre-wrap ${
                        msg.role === "user"
                          ? "bg-white/[0.07] border border-white/[0.12] text-white/90 px-4 py-2.5 rounded-sm"
                          : "text-white/80"
                      }`}
                    >
                      {msg.content}
                      {msg.role === "assistant" &&
                        msg.content === "" &&
                        streaming && (
                          <span className="inline-block w-1.5 h-3.5 bg-primary/60 animate-pulse ml-0.5 align-middle" />
                        )}
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-white/[0.16] px-4 py-3 flex gap-2 items-end">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask PhytoMind about cannabis medicine research…"
                disabled={streaming}
                rows={1}
                className="flex-1 bg-transparent text-white/70 text-sm placeholder-white/15 resize-none outline-none border border-white/[0.18] rounded-sm px-3 py-2.5 focus:border-white/[0.15] transition-colors min-h-[40px] max-h-[120px] disabled:opacity-40"
                style={{ scrollbarWidth: "none" }}
                onInput={(e) => {
                  const el = e.currentTarget;
                  el.style.height = "auto";
                  el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
                }}
              />
              <button
                onClick={() => void sendMessage()}
                disabled={!input.trim() || streaming}
                className="w-9 h-9 flex-shrink-0 flex items-center justify-center bg-primary/10 hover:bg-primary/20 border border-primary/20 hover:border-primary/40 rounded-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {streaming ? (
                  <Loader2 className="w-3.5 h-3.5 text-primary animate-spin" />
                ) : (
                  <Send className="w-3.5 h-3.5 text-primary" />
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ResearchHub() {
  const { data: researchProjects, isLoading } = useListResearch();

  return (
    <AppLayout>
      <div className="space-y-12">
        <div className="border-b border-white/[0.16] pb-8">
          <div className="section-label mb-4">DESCI: OPEN SCIENCE</div>
          <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-end">
            <h1
              className="text-4xl md:text-5xl font-bold tracking-tight text-white"
              data-testid="text-research-title"
            >
              Research Hub
            </h1>
            <Link href="/research/new" data-testid="button-submit-research">
              <span className="inline-flex items-center gap-2 text-sm border border-white/[0.20] px-5 py-2.5 rounded text-white/60 hover:border-primary/40 hover:text-primary transition-all cursor-pointer">
                <Plus className="w-3.5 h-3.5" /> Submit Research
              </span>
            </Link>
          </div>
        </div>

        <AIAssistantPanel />

        {isLoading ? (
          <div className="space-y-px bg-white/[0.07]">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-black p-8">
                <Skeleton className="h-5 w-2/3 bg-white/[0.08] mb-3" />
                <Skeleton className="h-4 w-1/2 bg-white/[0.03]" />
              </div>
            ))}
          </div>
        ) : researchProjects?.length ? (
          <div className="space-y-px bg-white/[0.08]">
            {researchProjects.map((project, i) => (
              <Link
                key={project.id}
                href={`/research/${project.id}`}
                data-testid={`row-research-${project.id}`}
              >
                <div className="group bg-black hover:bg-white/[0.02] transition-colors p-8 flex flex-col md:flex-row gap-6 md:items-center cursor-pointer">
                  <span className="index-num w-10 flex-shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <span
                        className={`text-[10px] font-mono border px-2 py-0.5 rounded-sm ${statusClass(project.status)}`}
                      >
                        {project.status.replace("-", " ").toUpperCase()}
                      </span>
                      <span className="text-[10px] font-mono text-white/25 border border-white/[0.16] px-2 py-0.5 rounded-sm">
                        {project.category.toUpperCase()}
                      </span>
                    </div>
                    <h3 className="text-white font-semibold text-lg leading-snug group-hover:text-primary transition-colors mb-2">
                      {project.title}
                    </h3>
                    <p className="text-sm text-white/30 line-clamp-2 leading-relaxed">
                      {project.abstract}
                    </p>
                    <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono text-white/20 mt-3">
                      {project.collaborators && (
                        <span>
                          {project.collaborators.split(",")[0]?.trim()}
                          {project.collaborators.split(",").length > 1
                            ? ` +${project.collaborators.split(",").length - 1}`
                            : ""}
                        </span>
                      )}
                      {project.publishedAt && (
                        <span>
                          Published{" "}
                          {formatDistanceToNow(new Date(project.publishedAt), {
                            addSuffix: true,
                          })}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-8 flex-shrink-0">
                    <div className="text-center">
                      <div className="text-white font-mono font-bold text-xl">
                        {project.upvotes || 0}
                      </div>
                      <div className="section-label text-[9px]">Upvotes</div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-white/10 group-hover:text-primary/60 transition-colors" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="border border-white/[0.16] p-20 text-center">
            <Microscope className="w-8 h-8 text-white/10 mx-auto mb-4" />
            <p className="text-white/25 mb-4">No research published yet.</p>
            <Link href="/research/new">
              <span className="text-xs text-primary/60 hover:text-primary transition-colors cursor-pointer">
                Submit the first paper
              </span>
            </Link>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
