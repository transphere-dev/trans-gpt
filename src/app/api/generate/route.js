
import { OpenAIStream } from "../../lib/OpenAIStream";

export const config = {
    runtime: "edge",
  };


  export async function POST(req) {
  const { payload } = (await req.json())


  
    const stream = await OpenAIStream(payload);

    const res = new Response(stream)
    console.info(`API - ${res.status}`)

    return res;
  };

