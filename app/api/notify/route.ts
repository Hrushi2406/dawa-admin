import { NextResponse } from "next/server";
import { db } from "../../../lib/firebase";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";

interface NotificationRequest {
  to: string; // Expo push token
  msg: string; // Message content
  phone: string; // Phone number
}

export async function POST(request: Request) {
  try {
    const body: NotificationRequest = await request.json();

    if (!body.to || !body.msg || !body.phone) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    let { to, msg, phone } = body as any;

    if (to === "dawa") {
      const dawa = await getDocs(collection(db, "agents"));
      const dawaData = dawa.docs.map((doc) => doc.data());
      const dawaTokens = dawaData
        .map((agent) => agent.pushTokens)
        .flat()
        .filter((token) => token !== undefined);

      to = dawaTokens;
    } else if (to === "mythri") {
      const mythri = await getDoc(
        doc(db, "p-stores/mythrimedicals2024@gmail.com")
      );
      const mythriData = mythri.data();
      const mythriTokens = mythriData?.pushTokens;
      to = mythriTokens;
    }

    // Construct the message
    const message = {
      to,
      title: "New Message",
      body: msg,
      sound: "default",
      data: {
        type: "new-message",
        navigateTo: `/chat/${phone}`,
      },
    };

    console.log("message: ", message);

    const response = await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });

    const result = await response.json();

    if (response.ok) {
      return NextResponse.json(
        { success: true, data: result },
        { status: 200 }
      );
    } else {
      console.log("result: ", result);
      return NextResponse.json(
        { error: "Failed to send notification", details: result },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Notification error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
