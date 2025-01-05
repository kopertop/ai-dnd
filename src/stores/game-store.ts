import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GameState } from '@/schemas/game';
import { Campaign } from '@/schemas/menu';
import { generateMap } from '@/utils/map-generator';

interface GameStore extends GameState {
	campaigns: Campaign[];
	currentCampaign: Campaign | null;
	createCampaign: (campaign: Omit<Campaign, 'id' | 'createdAt' | 'lastPlayed'>) => void;
	loadCampaign: (id: string) => void;
	updateCampaign: (id: string, updates: Partial<Campaign>) => void;
	exitCampaign: () => void;
	syncWithRemote: () => Promise<void>;
}

export const useGameStore = create<GameStore>()(
	persist(
		(set, get) => ({
			campaigns: [],
			currentCampaign: null,
			characters: [],
			currentTurn: '',
			gameMap: generateMap(),
			messages: [],

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
					currentCampaign: campaign,
					gameMap: generateMap(),
					messages: [],
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

			exitCampaign: () => {
				set({ currentCampaign: null });
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
