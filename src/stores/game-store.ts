import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Character, GameState } from '@/schemas/game';
import { Campaign } from '@/schemas/menu';
import { generateMap } from '@/utils/map-generator';

interface GameStore extends GameState {
	campaigns: Campaign[];
	createCharacter: (character: Omit<Character, 'id'>) => void;
	loadCharacter: (id: string) => void;
	updateCharacter: (id: string, updates: Partial<Character>) => void;
	createCampaign: (campaign: Omit<Campaign, 'id' | 'createdAt' | 'lastPlayed'>) => void;
	loadCampaign: (id: string) => void;
	updateCampaign: (id: string, updates: Partial<Campaign>) => void;
	syncWithRemote: () => Promise<void>;
}

export const useGameStore = create<GameStore>()(
	persist(
		(set, get) => ({
			characters: [],
			campaigns: [],
			currentTurn: '',
			gameMap: generateMap(),
			messages: [],

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

				set((state) => ({
					characters: [
						character,
						...state.characters.filter((c) => c.id !== id && c.type === 'npc'),
					],
					currentTurn: character.id,
				}));
			},

			updateCharacter: (id, updates) => {
				set((state) => ({
					characters: state.characters.map((c) =>
						c.id === id ? { ...c, ...updates } : c
					),
				}));
				queueSync();
			},

			createCampaign: (campaignData) => {
				const campaign: Campaign = {
					...campaignData,
					id: crypto.randomUUID(),
					createdAt: Date.now(),
					lastPlayed: Date.now(),
				};
				set((state) => ({
					campaigns: [...state.campaigns, campaign],
				}));
				queueSync();
			},

			loadCampaign: (id) => {
				const campaign = get().campaigns.find((c) => c.id === id);
				if (!campaign) return;

				// Update last played timestamp
				set((state) => ({
					campaigns: state.campaigns.map((c) =>
						c.id === id ? { ...c, lastPlayed: Date.now() } : c
					),
				}));

				// Load associated characters
				const campaignCharacters = get().characters.filter((c) =>
					campaign.characters.includes(c.id)
				);
				set(() => ({
					characters: campaignCharacters,
					currentTurn: campaignCharacters[0]?.id || '',
					gameMap: generateMap(),
					messages: [],
				}));
				queueSync();
			},

			updateCampaign: (id, updates) => {
				set((state) => ({
					campaigns: state.campaigns.map((c) =>
						c.id === id ? { ...c, ...updates } : c
					),
				}));
				queueSync();
			},

			syncWithRemote: async () => {
				// TODO: Implement remote sync
				console.log('Syncing with remote database...');
			},
		}),
		{
			name: 'dnd-game-storage',
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
		useGameStore.getState().syncWithRemote();
	}, 5000);
};
