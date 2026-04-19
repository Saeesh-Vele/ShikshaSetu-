"use client";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle, X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";

export default function CareerChatbot() {
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
    if (!userMessage) return;

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

  return (
    <>
      {/* Floating Button */}
      <Button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-xl flex items-center justify-center z-[1000]"
        style={{ backgroundColor: "oklch(0.637 0.237 275)" }}
      >
        {open ? (
          <X className="h-6 w-6 text-white" />
        ) : (
          <MessageCircle className="h-6 w-6 text-white" />
        )}
      </Button>

      {/* Chat Window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-20 right-6 w-96 h-[500px] shadow-2xl rounded-2xl overflow-hidden flex flex-col z-[1000]"
            style={{ backgroundColor: "white" }}
          >
            {/* Header */}
            <div
              className="text-white p-3 flex justify-between items-center"
              style={{ backgroundColor: "oklch(0.637 0.237 275)" }}
            >
              <h2 className="font-semibold">🎓 Career Counselor</h2>
              <button onClick={() => setOpen(false)} className="hover:opacity-80">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-3 space-y-2 overflow-y-auto bg-gray-50">
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: msg.role === "user" ? 50 : -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`px-3 py-2 rounded-xl max-w-xs prose prose-sm`}
                    style={{
                      backgroundColor:
                        msg.role === "user"
                          ? "oklch(0.637 0.237 275)"
                          : "oklch(0.95 0 0)", // light gray bubble
                      color: msg.role === "user" ? "white" : "black",
                    }}
                  >
                    {msg.role === "bot" ? (
                      <ReactMarkdown>{msg.text}</ReactMarkdown>
                    ) : (
                      msg.text
                    )}
                  </div>
                </motion.div>
              ))}
              {loading && (
                <div className="flex items-center space-x-2 text-gray-500">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Typing...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestions */}
            <div className="flex flex-wrap gap-2 p-2 border-t bg-white">
              {[
                "Career options after 12th",
                "Top colleges for engineering",
                "Future in AI & Data Science",
                "Scholarships available",
              ].map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => sendMessage(q)}
                  className="text-xs px-2 py-1 rounded-lg"
                  style={{
                    backgroundColor: "oklch(0.637 0.237 275)", // lighter shade
                    color: "white",
                  }}
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Input Box */}
            <div className="flex border-t p-2">
              <input
                className="flex-1 border rounded-l-lg px-2 py-1 focus:outline-none"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask your career question..."
                style={{ borderColor: "oklch(0.637 0.237 275)", color: "black" }}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />
              <button
                onClick={() => sendMessage()}
                className="text-white px-3 py-1 rounded-r-lg"
                style={{ backgroundColor: "oklch(0.637 0.237 275)" }}
              >
                Send
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
