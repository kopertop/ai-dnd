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
		content: 'You are a Dungeon Master in a D&D game. Respond in character, making the game engaging and fun.',
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
