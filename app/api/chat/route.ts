import { IMedicine } from "@/lib/types";
import productService from "@/services/product-service";
import { openai } from "@ai-sdk/openai";
import { generateObject, generateText, streamText } from "ai";
import { z } from "zod";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  //   const { object } = await generateObject({
  //     model: openai("gpt-3.5-turbo"),
  //     messages: messages,
  //     schema: z.object({
  //       result: z.array(
  //         z.object({
  //           name: z.string(),
  //           quantity: z.string(),
  //         })
  //       ),
  //     }),
  //     system:
  //       'Act as expert in medicines and it\'s name and identifying medicines names and it\'s quantity based on your trained data. I\'ll give u various/different names sometimes mispelled names for medicines you will have to identify the correct names for medicines and also guess the amount of quantity needed. You\'ll be formating the output as an array in JSON format. Example: {result:[{"name":"Aspirin","quantity":"10"}]} Always include the full name of the medicine and the quantity required',
  //   });

  const result = await generateText({
    model: openai("gpt-3.5-turbo"),
    system:
      'Act as expert in medicines and it\'s name and identifying medicines names and it\'s quantity based on your trained data. I\'ll give u various/different names sometimes mispelled names for medicines you will have to identify the correct names for medicines and also guess the amount of quantity needed. You\'ll be formating the output as an array in JSON format. Example: {result:[{"name":"Aspirin","quantity":"10"}]} Always include the full name of the medicine and the quantity required',
    messages,
  });
  console.log("result.text: ", result.text);

  //Parse the result.text into JSON format also check if the result is valid JSON
  try {
    const parsedResult = JSON.parse(result.text);

    const cartItems = [];
    let identity = "";

    for (const item of parsedResult.result) {
      identity += item.name + ": " + item.quantity + " \n";
      const foundMedicine = (await productService.search(
        item.name
      )) as IMedicine[];

      if (foundMedicine.length > 0) {
        cartItems.push({
          name: foundMedicine[0].name,
          quantity: item.quantity,
        });
      }
    }

    let response = "";

    if (cartItems.length === 0) response = "Given medicines are not available";

    cartItems.forEach((item: any) => {
      response += item.name + ": " + item.quantity + ", ";
    });

    return Response.json({
      messages: [
        { content: identity, role: "assistant" },
        { content: response, role: "assistant" },
      ],
    });
  } catch (error) {
    console.log("error: ", error);

    return Response.json({
      messages: [{ content: result.text, role: "assistant" }],
    });
  }
}
