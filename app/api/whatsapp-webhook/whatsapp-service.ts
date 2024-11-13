import axios from "axios";

const PAGE_ACCESS_TOKEN =
  "EAAw17aZAAASkBO0llGDzfITdr1wV069BJ8Fh8hUZAUqtWGHG69cZBc4RZCNKKV6nwtlvcB6DzGx7wDQef7HxjfZARWBskZAZC4K8HDyqMEF0eBn9W8POstAZBUw4B8JCinjowA0NDZBRLAtPn9CcUmntGhVKUh9jwwC3szzp4nhI5R0YZAWEPtBFxA24gBDA6lxdiVzOrnqpKpoXdFZAiUqM3rIKNZC39Pal0DyOYRyB";

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
