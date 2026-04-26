export const sendChatMessage = async (message) => {
  const res = await fetch("/api/chatbot", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });

  if (!res.ok) {
    throw new Error("Failed to communicate with counselor");
  }

  return res.json();
};
