import { NextResponse } from "next/server";
import axios from "axios";
import { arrayUnion } from "firebase/firestore";
import waParser, { IParsedResult } from "@/lib/whatsapp/wa-webhook-parser";
import { PAGE_ACCESS_TOKEN } from "@/app/constants";
import wasync from "@/lib/whatsapp/wa-sync-service";

// Function to send a text message

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const msgType = body.entry[0].changes[0].value.messages[0].type;

    let parsed: IParsedResult | null = null;

    if (msgType === "text") {
      parsed = waParser.parseTextMessage(body);
    } else if (msgType === "image") {
      parsed = waParser.parseImageMessage(body);
    }

    if (!parsed) return;

    await wasync.sync(parsed.contact, parsed.msg);

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
