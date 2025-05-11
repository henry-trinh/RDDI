import { NextRequest } from 'next/server';
import { LumaAI } from 'lumaai';

const client = new LumaAI({
  authToken: process.env.LUMALABS_API_KEY || ""
});

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return new Response(
        JSON.stringify({ error: "Prompt is required" }), 
        { status: 400 }
      );
    }

    console.log("Starting Luma AI Generation...");

    const modelId = "photon-1";

    // Create generation request
    let generation = await client.generations.image.create({
      model: modelId,
      prompt,
      aspect_ratio: "16:9",
    });

    if (!generation.id) {
      throw new Error("Generation ID is undefined");
    }

    let completed = false;
    while (!completed) {
      if (!generation.id) {
        throw new Error("Generation ID is undefined");
      }
      generation = await client.generations.get(generation.id);

      if (generation.state === "completed") {
        completed = true;
      } else if (generation.state === "failed") {
        console.error(`Generation failed: ${generation.failure_reason}`);
        return new Response(
          JSON.stringify({ error: `Generation failed: ${generation.failure_reason}` }), 
          { status: 500 }
        );
      } else {
        console.log("Still generating...");
        await new Promise(r => setTimeout(r, 3000)); // Wait for 3 seconds
      }
    }

    if (!generation.assets || !generation.assets.image) {
      throw new Error("Image URL is undefined");
    }

    const imageUrl = generation.assets.image;
    console.log("Generated Image URL:", imageUrl);

    return new Response(JSON.stringify({ imageUrl }), { status: 200 });

  } catch (error) {
    console.error("Error in Luma AI Generation:", error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: 'Failed to generate image', details: errorMessage }), 
      { status: 500 }
    );
  }
}
