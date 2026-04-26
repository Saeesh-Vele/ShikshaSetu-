import { useState } from "react";
import { sendChatMessage } from "../services/chatbotApi";

export function useChat() {
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "👋 Hello! I’m your career counselor. Ask me about courses, colleges, or career opportunities after 10th/12th. I’ll guide you step by step.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async (msgOverride) => {
    const userMessage = msgOverride || input;
    if (!userMessage.trim()) return;

    const newMessages = [...messages, { role: "user", text: userMessage }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const data = await sendChatMessage(userMessage);
      setMessages([...newMessages, { role: "bot", text: data.reply }]);
    } catch (err) {
      setMessages([
        ...newMessages,
        { role: "bot", text: "⚠ Unable to connect to the counselor service." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return {
    messages,
    input,
    setInput,
    loading,
    sendMessage,
  };
}
