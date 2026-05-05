# AI Assistant

Embeddable chatbot powered by Groq/Gemini that answers career and education questions in real time.

## Exports (via index.js)

- `CareerChatbot` — Full chatbot UI component with message history
- `useChat` — Hook managing chat state, message sending, and loading
- `chatbotApi` — Client-side fetch wrapper for `/api/chatbot`

## API Routes

- `POST /api/chatbot` — Sends a user message, returns AI reply

## External Dependencies

- Groq SDK (LLaMA models) with Gemini fallback
- Firebase Auth (authenticated requests via `authFetch`)
