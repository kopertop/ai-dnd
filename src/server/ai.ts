import { createTogetherAI } from '@ai-sdk/togetherai';
import { generateText } from 'ai';

const together = createTogetherAI({
	apiKey: process.env.TOGETHER_API_KEY!,
});

export async function handleChat(messages: any[]) {
	const model = together('meta-llama/Llama-3.3-70B-Instruct-Turbo');

	return generateText({
		model,
		messages,
		temperature: 0.7,
		maxTokens: 500,
	});
}
