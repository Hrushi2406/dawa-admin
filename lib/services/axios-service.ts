import axios from "axios";
import { PAGE_ACCESS_TOKEN, WA_PHONE_NUMBER_ID } from "@/app/constants";

export const waclient = axios.create({
  baseURL: `https://graph.facebook.com/v21.0/${WA_PHONE_NUMBER_ID}`,
  headers: {
    Authorization: `Bearer ${PAGE_ACCESS_TOKEN}`,
  },
});
