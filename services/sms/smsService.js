import twilio from "twilio";

const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_PHONE;

// Ensure this doesn't run on the client side
if (typeof window !== "undefined") {
  throw new Error("SMS service can only be used on the server side");
}

let client;
if (accountSid && authToken) {
  client = twilio(accountSid, authToken);
}

export async function sendSMS(to, message) {
  if (!client) {
    console.warn("⚠️ Twilio is not configured. SMS will not be sent.");
    return { sid: "mock_sid_123" }; // Mock for dev without env vars
  }

  try {
    const msg = await client.messages.create({
      body: message,
      from: twilioNumber,
      to: to.startsWith("+") ? to : `+91${to}`,
    });
    console.log("📤 SMS sent:", msg.sid);
    return msg;
  } catch (err) {
    console.error("❌ SMS sending failed:", err.message);
    throw err;
  }
}
