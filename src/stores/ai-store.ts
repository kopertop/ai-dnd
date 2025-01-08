import { create } from 'zustand';
import { createTogetherAI } from '@ai-sdk/togetherai';
import type { Message } from 'ai';

interface AIStore {
	isProcessing: boolean;
	error: string | null;
	provider: ReturnType<typeof createTogetherAI>;
	messages: Message[];
	addMessage: (content: string, role: Message['role']) => void;
}

export const useAIStore = create<AIStore>((set) => ({
	isProcessing: false,
	error: null,
	provider: createTogetherAI({
		apiKey: import.meta.env.VITE_TOGETHER_API_KEY,
	}),
	messages: [{
		id: 'system-1',
		role: 'system',
		content: `You are a Dungeon Master in a D&D game. Respond in character, making the game engaging and fun.
When in combat encounters:
- Describe combat actions vividly but concisely
- Track and mention relevant conditions affecting characters
- Suggest tactical options to players when appropriate
- Make enemy actions feel strategic and challenging
- Keep the pace moving by being decisive with enemy actions
- Use D&D 5e rules for combat mechanics`,
	}],

	addMessage: (content, role) => {
		set(state => ({
			messages: [...state.messages, {
				id: crypto.randomUUID(),
				content,
				role,
			}],
		}));
	},
}));