import dotenv from "dotenv";
dotenv.config();
import twilio from "twilio";

const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_PHONE;
console.log("🔑 Twilio Config:", {
    accountSid: process.env.TWILIO_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
    twilioNumber: process.env.TWILIO_PHONE,
});

console.log("🔑 Twilio Config:", { accountSid: !!accountSid, authToken: !!authToken, twilioNumber });

const client = twilio(accountSid, authToken);

export async function sendSMS(to, message) {
    try {
        const msg = await client.messages.create({
            body: message,
            from: twilioNumber,
            to: to.startsWith("+") ? to : `+91${to}`
        });
        console.log("📤 SMS sent:", msg.sid);
        return msg;
    } catch (err) {
        console.error("❌ SMS sending failed:", err.message);
        throw err;
    }
}
