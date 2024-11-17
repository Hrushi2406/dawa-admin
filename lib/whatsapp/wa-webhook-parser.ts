class WAWebhookParser {
  parseTextMessage(body: any): IParsedResult {
    const msg = body.entry[0].changes[0].value.messages[0];
    const waContact = body.entry[0].changes[0].value.contacts[0];

    const contact = {
      id: waContact.wa_id,
      cname: waContact.profile.name,
      cphone: waContact.wa_id,
    };

    return {
      contact,
      msg,
    };
  }

  parseImageMessage(body: any): IParsedResult {
    const msg = body.entry[0].changes[0].value.messages[0];
    const waContact = body.entry[0].changes[0].value.contacts[0];

    const contact = {
      id: waContact.wa_id,
      cname: waContact.profile.name,
      cphone: waContact.wa_id,
    };

    return {
      contact,
      msg,
    };
  }
}

const waParser = new WAWebhookParser();
export default waParser;

export type IParsedResult = {
  contact: {
    id: string;
    cname: string;
    cphone: string;
  };
  msg: any;
};
