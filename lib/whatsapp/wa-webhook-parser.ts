class WAWebhookParser {
  parseTextMessage(body: any) {
    const msg = body.entry[0].changes[0].value.messages[0];
    const contactInfo = body.entry[0].changes[0].value.contacts[0];

    const psid = msg.from;

    const temp = {
      ...msg,
    };

    return temp;
  }

  parseImageMessage(body: any) {
    const msg = body.entry[0].changes[0].value.messages[0];
    const contactInfo = body.entry[0].changes[0].value.contacts[0];

    const temp = {
      ...msg,
    };

    return temp;
  }
}

const waParser = new WAWebhookParser();
export default waParser;
