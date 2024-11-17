import { PAGE_ACCESS_TOKEN } from "@/app/constants";
import axios from "axios";

export async function sendWATextMessage(psid: string, messageText: string) {
  try {
    const response = await axios.post(
      `https://graph.facebook.com/v20.0/440211032500301/messages`,
      {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: psid,
        type: "text",
        text: { body: messageText },
      },
      {
        headers: {
          Authorization: `Bearer ${PAGE_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log(`Message sent with ID: ${response.data.messages[0].id}`);
  } catch (error) {
    console.error("Error sending message:", error);
  }
}
