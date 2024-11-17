import axios from "axios";

const PAGE_ACCESS_TOKEN =
  "EAASlSFQSI7wBO1UWCuxofC1RNl2F7q4cEZBIaOIXXeACCBvFvmBWG8Jg2Ip4ZBekOrs2jY3RzNmOMG6bNz5ql4Ti4GmtjZBl27wiqhiPAW6MLLaGvh7nCC0oF4w1NVDoGJl82o24TeF5TuJ3iCU8eKhKQpUIKvqoHzuati4suuPIQVA4eG3qWHeZCJAyGDSzwz9ZCiALf1H9rA3uTAdxujw9Loxa7erFW0OnxH7jEguMZD";

export async function sendWATextMessage(psid: string, messageText: string) {
  try {
    const response = await axios.post(
      `https://graph.facebook.com/v20.0/523203650865446/messages`,
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
