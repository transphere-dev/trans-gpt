
import { OpenAIStream } from "../../lib/OpenAIStream";
import { NextRequest, NextResponse } from "next/server";

export const config = {
  runtime: "edge",
};


export async function POST(req) {
  const { prompt, temperature, model } = (await req.json())

  const payload = {
    messages: prompt,
    // max_tokens: 100,
    temperature: temperature,
    n: 1,
    // stop: '\nGlossary',
    model: model,
    stream: true
  };

try {
  const stream = await OpenAIStream(payload);

  const res = new Response(stream)



  return res;
} catch (error) {



  return NextResponse.json({ error: error.message }, { status: 500 });
}
};

