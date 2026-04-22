"use client";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle, X, Loader2, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { usePathname } from "next/navigation";

export default function CareerChatbot() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "👋 Hello! I’m your career counselor. Ask me about courses, colleges, or career opportunities after 10th/12th. I’ll guide you step by step.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (msg) => {
    const userMessage = msg || input;
    if (!userMessage.trim()) return;

    const newMessages = [...messages, { role: "user", text: userMessage }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await res.json();
      setMessages([...newMessages, { role: "bot", text: data.reply }]);
    } catch (err) {
      setMessages([
        ...newMessages,
        { role: "bot", text: "⚠ Unable to connect to the counselor service." },
      ]);
    }

    setLoading(false);
  };

  // Hide chatbot on auth pages
  if (pathname && (pathname.includes("sign-in") || pathname.includes("sign-up"))) {
    return null;
  }

  return (
    <>
      {/* Floating Button */}
      <Button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-xl flex items-center justify-center z-[1000] bg-primary hover:bg-primary-hover hover:scale-105 transition-all duration-200 ease-out"
      >
        {open ? (
          <X className="h-6 w-6 text-primary-foreground" />
        ) : (
          <MessageCircle className="h-6 w-6 text-primary-foreground" />
        )}
      </Button>

      {/* Chat Window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed bottom-24 right-6 w-[22rem] h-[500px] bg-card border border-border shadow-2xl rounded-2xl overflow-hidden flex flex-col z-[1000]"
          >
            {/* Header */}
            <div className="bg-primary text-primary-foreground p-4 flex justify-between items-center shadow-sm">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                <h2 className="font-semibold text-sm tracking-wide">Career Counselor</h2>
              </div>
              <button 
                onClick={() => setOpen(false)} 
                className="hover:opacity-80 transition-opacity p-1 rounded-md hover:bg-black/10"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-background/50 scroll-smooth">
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: msg.role === "user" ? 10 : -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`px-4 py-2.5 max-w-[85%] text-sm shadow-sm ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground rounded-2xl rounded-br-sm"
                        : "bg-muted text-foreground border border-border rounded-2xl rounded-bl-sm"
                    }`}
                  >
                    {msg.role === "bot" ? (
                      <div className="prose prose-sm dark:prose-invert max-w-none break-words leading-relaxed">
                        <ReactMarkdown>{msg.text}</ReactMarkdown>
                      </div>
                    ) : (
                      msg.text
                    )}
                  </div>
                </motion.div>
              ))}
              {loading && (
                <div className="flex items-center space-x-2 text-muted-foreground p-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-xs font-medium">Typing...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestions */}
            <div className="flex flex-wrap gap-2 p-3 bg-card border-t border-border">
              {[
                "Career options after 12th",
                "Top colleges for engineering",
                "Future in AI & Data Science",
                "Scholarships available",
              ].map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => sendMessage(q)}
                  className="text-xs px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary-hover transition-colors border border-border"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Input Box */}
            <div className="flex gap-2 p-3 bg-card border-t border-border">
              <input
                className="flex-1 bg-input text-foreground border border-border/50 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all placeholder:text-muted-foreground/50"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question..."
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />
              <Button
                onClick={() => sendMessage()}
                size="icon"
                className="rounded-full bg-primary hover:bg-primary-hover shrink-0 w-10 h-10 shadow-sm transition-transform active:scale-95"
                disabled={!input.trim() || loading}
              >
                <Send className="h-4 w-4 text-primary-foreground" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
