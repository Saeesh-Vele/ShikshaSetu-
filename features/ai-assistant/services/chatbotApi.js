import { authFetch } from "@/lib/firebase/authFetch";

export const sendChatMessage = async (message) => {
  const res = await authFetch("/api/chatbot", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Failed to communicate with counselor");
  }

  return res.json();
};
