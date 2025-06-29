import { InferenceClient } from "@huggingface/inference";

const client = new InferenceClient("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");

const chatCompletion = await client.chatCompletion({
    provider: "nebius",
    model: "deepseek-ai/DeepSeek-V3",
    messages: [
        {
            role: "user",
            content: "What is the capital of France?",
        },
    ],
    temperature: 2,
    top_p: 1,
});

console.log(chatCompletion.choices[0].message);
