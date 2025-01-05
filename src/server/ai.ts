import { createTogetherAI } from '@ai-sdk/togetherai';
import { streamText } from 'ai';
import type { Message } from 'ai';

const DM_SYSTEM_PROMPT = `You are a Dungeon Master in a D&D game. Follow these guidelines:
1. Keep the game engaging and fun
2. Maintain character consistency
3. Follow D&D 5e rules
4. Create vivid descriptions
5. Allow player agency
6. Balance challenge and fun
7. React to player actions realistically
8. Keep track of context from previous messages`;

const together = createTogetherAI({
	apiKey: process.env.TOGETHER_API_KEY!,
});

export async function handleChat(messages: Message[]) {
	const model = together('meta-llama/Llama-3.3-70B-Instruct-Turbo');

	const systemMessage: Message = {
		id: 'system-1',
		role: 'system',
		content: DM_SYSTEM_PROMPT,
	};

	const result = streamText({
		model,
		messages: [systemMessage, ...messages],
		temperature: 0.7,
		maxTokens: 500,
	});

	return result.toDataStreamResponse();
}
