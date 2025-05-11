import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt,
      n: 1,
      size: "1024x1024",
    });

    const imageUrl = response.data && response.data[0]?.url ? response.data[0].url : "";

    if (!imageUrl) {
      throw new Error("No image URL generated");
    }

    return new Response(JSON.stringify({ imageUrl }), { status: 200 });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error generating image:", errorMessage);
    return new Response(JSON.stringify({ error: "Failed to generate image", details: errorMessage }), { status: 500 });
  }
}
