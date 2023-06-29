
import { OpenAIStream } from "../../lib/OpenAIStream";

export const config = {
    runtime: "edge",
  };


  export async function POST(req) {
  const { prompt ,temperature } = (await req.json())

  const payload = {
    messages: prompt,
    // max_tokens: 100,
    temperature: temperature,
    n: 1,
    // stop: '\nGlossary',
    model: "gpt-3.5-turbo",
    stream:true
  };
  
    const stream = await OpenAIStream(payload);

    const res = new Response(stream)
    console.info(`API - ${res.status}`)

    return res;
  };

