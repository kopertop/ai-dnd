import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Character } from '@/schemas/character';

interface CharacterStore {
	characters: Character[];
	activeCharacter: Character | null;
	createCharacter: (character: Omit<Character, 'id'>) => void;
	loadCharacter: (id: string) => void;
	updateCharacter: (id: string, updates: Partial<Character>) => void;
	deleteCharacter: (id: string) => void;
	getCharactersByIds: (ids: string[]) => Character[];
	syncWithRemote: () => Promise<void>;
}

export const useCharacterStore = create<CharacterStore>()(
	persist(
		(set, get) => ({
			characters: [],
			activeCharacter: null,

			createCharacter: (characterData) => {
				const character: Character = {
					...characterData,
					id: crypto.randomUUID(),
				};
				set((state) => ({
					characters: [...state.characters, character],
				}));
				queueSync();
			},

			loadCharacter: (id) => {
				const character = get().characters.find((c) => c.id === id);
				if (!character) return;

				set(() => ({
					activeCharacter: character,
				}));
			},

			updateCharacter: (id, updates) => {
				set((state) => ({
					characters: state.characters.map((c) =>
						c.id === id ? { ...c, ...updates } : c
					),
					activeCharacter: state.activeCharacter?.id === id
						? { ...state.activeCharacter, ...updates }
						: state.activeCharacter,
				}));
				queueSync();
			},

			deleteCharacter: (id) => {
				set((state) => ({
					characters: state.characters.filter((c) => c.id !== id),
					activeCharacter: state.activeCharacter?.id === id
						? null
						: state.activeCharacter,
				}));
				queueSync();
			},

			getCharactersByIds: (ids) => {
				return get().characters.filter((c) => ids.includes(c.id));
			},

			syncWithRemote: async () => {
				// TODO: Implement remote sync
				console.log('Syncing characters with remote database...');
			},
		}),
		{
			name: 'dnd-character-storage',
		}
	)
);

// Debounced sync with remote
let syncTimeout: number | null = null;
const queueSync = () => {
	if (syncTimeout) {
		window.clearTimeout(syncTimeout);
	}
	syncTimeout = window.setTimeout(() => {
		useCharacterStore.getState().syncWithRemote();
	}, 5000);
};
