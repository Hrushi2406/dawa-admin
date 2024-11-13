import axios from "axios";

const PAGE_ACCESS_TOKEN =
  "EAASlSFQSI7wBO4r2WuYx3ZCjH1O2aQtPrBZA0LI2WFd2ZBQU7z5hHkeFpthOhg3AWFBnJ7bd0M4LVOZA62xiq4jSReMLMy7NrL1s5kc7RZAzFqZAf1WvhLFiuMEfn1DdVTOiNArBxOaaJwVmQuwj05w1NHeGvD16MSJvCnluaKWTihwUiZB1qEFn36SGUZCWJONwvlIW6OSZBGh0d0jnnE6sZD";

async function sendTextMessage(psid: string, messageText: string) {
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
