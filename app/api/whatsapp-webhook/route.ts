import { NextResponse } from "next/server";
import axios from "axios";
import { arrayUnion } from "firebase/firestore";
import waParser from "@/lib/whatsapp/wa-webhook-parser";

const PAGE_ACCESS_TOKEN =
  "EAAw17aZAAASkBO0llGDzfITdr1wV069BJ8Fh8hUZAUqtWGHG69cZBc4RZCNKKV6nwtlvcB6DzGx7wDQef7HxjfZARWBskZAZC4K8HDyqMEF0eBn9W8POstAZBUw4B8JCinjowA0NDZBRLAtPn9CcUmntGhVKUh9jwwC3szzp4nhI5R0YZAWEPtBFxA24gBDA6lxdiVzOrnqpKpoXdFZAiUqM3rIKNZC39Pal0DyOYRyB";

// Function to send a text message

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const msgType = body.entry[0].changes[0].value.messages[0].type;

    const contactInfo = body.entry[0].changes[0].value.contacts[0];
    const message = body.entry[0].changes[0].value.messages[0];
    const metadata = body.entry[0].changes[0].value.metadata;
    if (msgType === "text") {
      let msg = waParser.parseTextMessage(body);
    } else if (msgType === "image") {
      let msg = waParser.parseImageMessage(body);
    }

    // Extract relevant information from the incoming message
    const psid = body.entry[0].changes[0].value.messages[0].from;
    const messageText = body.entry[0].changes[0].value.messages[0].text.body;

    // Resend the message
    // await sendTextMessage(psid, messageText);
    // Save message to whatsappSync collection
    const { setDoc, doc, serverTimestamp } = await import("firebase/firestore");
    const { db } = await import("@/lib/firebase");

    try {
      await setDoc(
        doc(db, "whatsappSync", psid),
        {
          contactInfo,
          message,
          metadata,
          name: psid, // Using phone number as name for now
          lastMessage: messageText,
          timestamp: serverTimestamp(),
          messages: arrayUnion({
            content: messageText,
            timestamp: new Date().toISOString(),
            sender: "other",
          }),
        },
        { merge: true }
      );

      console.log("Message saved to whatsappSync collection");
    } catch (error) {
      console.error("Error saving message to Firestore:", error);
    }

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
