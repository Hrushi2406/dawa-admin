import { storage } from "@/lib/firebase";
import { waclient } from "@/lib/services/axios-service";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

class WaService {
  private body = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
  };

  async sendWATextMessage(to: string, text: string) {
    try {
      const response = await waclient.post(`/messages`, {
        ...this.body,
        to: to,
        type: "text",
        text: { body: text },
      });
      console.log(`Message sent with ID: ${response.data.messages[0].id}`);
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  }

  async sendWAMediaMessage(to: string, url: string) {
    try {
      const response = await waclient.post(`/messages`, {
        ...this.body,
        to: to,
        type: "image",
        image: {
          link: url,
        },
      });
      console.log(`Message sent with ID: ${response.data.messages[0].id}`);
    } catch (error) {
      console.error("Error sending media message:", error);
      throw error;
    }
  }

  async retrieveWAMedia(mediaId: string) {
    try {
      // First get the media URL
      const mediaResponse = await waclient.get(`/${mediaId}`);

      console.log("mediaResponse: ", mediaResponse.data.url);

      if (!mediaResponse.data.url) {
        throw new Error("Media URL not found in response");
      }

      try {
        // Download the media from the URL
        const mediaUrl = mediaResponse.data.url;
        const mediaDownload = await waclient.get(mediaUrl, {
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

        console.log("downloadUrl: ", downloadUrl);

        return {
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
}

const waService = new WaService();
export default waService;
