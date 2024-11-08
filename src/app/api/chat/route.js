import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req) {
  const { prompt } = await req.json();
  const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/completions",
      {
        model: "text-davinci-003",
        prompt,
        max_tokens: 100,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    const advice = response.data.choices[0].text.trim();
    return NextResponse.json({ text: advice });
  } catch (error) {
    console.error("OpenAI API request failed", error);
    return NextResponse.json(
      { text: "Sorry, something went wrong." },
      { status: 500 }
    );
  }
}
