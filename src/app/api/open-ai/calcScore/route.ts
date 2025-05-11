import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY });

export async function POST(req: Request) {
  try {
    console.log("HERE");
    const { question, userAnswer, subject } = await req.json();

    // Step 1: Evaluate how well the user answered the question
    const evaluationResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are an AI evaluator that assigns a score from 1-100 based on how well the user's response answers the given question, in the context of the given subject. If the answer is not in relation to the subject at all, then give a score of 1. Consider relevance, clarity, and completeness. Allow room for improvement with subsequent attempts. Return only the number, with no extra text.",
        },
        {
          role: "user",
          content: `Subject: "${subject}"\nQuestion: "${question}"\nUser's Answer: "${userAnswer}"\nScore (0-100):`,
        },
      ],
      max_tokens: 10,
    });

    console.log(evaluationResponse);

    const newScore = evaluationResponse.choices[0]?.message?.content 
      ? parseInt(evaluationResponse.choices[0].message.content.trim(), 10) 
      : 0;

    return new Response(JSON.stringify({ score: newScore }), { status: 200 });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error calculating score:", errorMessage);
    return new Response(JSON.stringify({ error: "Failed to calculate score", details: errorMessage }), { status: 500 });
  }
}
