import { NextResponse } from "next/server";
import axios from "axios";

const PAGE_ACCESS_TOKEN =
  "EAASlSFQSI7wBO4r2WuYx3ZCjH1O2aQtPrBZA0LI2WFd2ZBQU7z5hHkeFpthOhg3AWFBnJ7bd0M4LVOZA62xiq4jSReMLMy7NrL1s5kc7RZAzFqZAf1WvhLFiuMEfn1DdVTOiNArBxOaaJwVmQuwj05w1NHeGvD16MSJvCnluaKWTihwUiZB1qEFn36SGUZCWJONwvlIW6OSZBGh0d0jnnE6sZD";

// Function to send a text message
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

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Extract relevant information from the incoming message
    const psid = body.entry[0].changes[0].value.messages[0].from;
    const messageText = body.entry[0].changes[0].value.messages[0].text.body;

    // Resend the message
    await sendTextMessage(psid, messageText);

    console.log("Received WhatsApp webhook:", body);

    return NextResponse.json(
      { message: "Webhook received and message resent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing WhatsApp webhook:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  // Handle verification request from WhatsApp
  // return new Response("Verification success", { status: 200 });
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  // // TODO: Replace 'YOUR_VERIFY_TOKEN' with your actual verify token
  if (mode === "subscribe" && token === "dawa") {
    console.log(req);
    return new Response(challenge, { status: 200 });
  } else {
    return new Response("Verification failed", { status: 403 });
  }
}

// Function to resend the incoming message to the same number
async function resendMessage(psid: string, messageText: string) {
  try {
    const response = await axios.post(
      `https://graph.facebook.com/v20.0/440211032500301/messages`,
      {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: "918551914432",
        type: "interactive",
      },
      {
        headers: {
          Authorization: `Bearer ${PAGE_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log(`Message sent with ID: ${response.data.message_id}`);
  } catch (error) {
    console.error("Error sending message:", error);
  }
}
