import { PAGE_ACCESS_TOKEN } from "@/app/constants";
import { storage } from "@/lib/firebase";
import axios from "axios";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

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
    throw error;
  }
}

export async function retrieveWAMedia(mediaId: string) {
  try {
    // First get the media URL
    const mediaResponse = await axios.get(
      `https://graph.facebook.com/v21.0/${mediaId}`,
      {
        headers: {
          Authorization: `Bearer ${PAGE_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("mediaResponse: ", mediaResponse.data.url);

    if (!mediaResponse.data.url) {
      throw new Error("Media URL not found in response");
    }

    try {
      // Download the media from the URL
      const mediaUrl = mediaResponse.data.url;

      const mediaDownload = await axios.get(mediaUrl, {
        headers: {
          Authorization: `Bearer ${PAGE_ACCESS_TOKEN}`,
        },
        responseType: "arraybuffer",
      });

      console.log("mediaDownload: ", mediaDownload.data);

      // Upload to Firebase Storage
      const storageRef = ref(storage, `whatsapp-media/${mediaId}`);
      const metadata = {
        contentType: mediaResponse.data.mime_type,
      };

      await uploadBytes(storageRef, mediaDownload.data, metadata);
      const downloadUrl = await getDownloadURL(storageRef);

      return {
        // data: mediaDownload.data,
        mimeType: mediaResponse.data.mime_type,
        fileName: mediaResponse.data.id,
        downloadUrl: downloadUrl,
      };
    } catch (error) {
      console.error("Error uploading media to Firebase Storage:", error);
      return {
        mimeType: null,
        fileName: mediaId,
        downloadUrl: null,
      };
    }
  } catch (error) {
    console.error("Error retrieving WhatsApp media:", error);

    return {
      mimeType: null,
      fileName: mediaId,
      downloadUrl: null,
    };
  }
}
