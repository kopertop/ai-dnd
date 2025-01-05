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
	deleteCampaign: (id: string) => void;
	exitCampaign: () => void;
	syncWithRemote: () => Promise<void>;
	sendMessage: (message: string) => void;
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
			inventory: [],

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

				// Load associated characters
				const campaignCharacters = get().characters.filter((c) =>
					campaign.characters[c.id] !== undefined
				).map(char => ({
					...char,
					controlType: campaign.characters[char.id] || 'user'
				}));

				set((state) => ({
					campaigns: state.campaigns.map((c) =>
						c.id === id ? { ...c, lastPlayed: Date.now() } : c
					),
					currentCampaign: campaign,
					characters: campaignCharacters,
					currentTurn: campaignCharacters[0]?.id || '',
					gameMap: generateMap(),
					messages: [],
				}));
				queueSync();
			},

			updateCampaign: (id, updates) => {
				console.log('Updating campaign', id, updates);
				set((state) => ({
					campaigns: state.campaigns.map((c) =>
						c.id === id ? { ...c, ...updates } : c
					),
				}));

				if (get().currentCampaign?.id === id) {
					set({ currentCampaign: get().campaigns.find((c) => c.id === id) });
				}
				queueSync();
			},

			deleteCampaign: (id) => {
				set((state) => ({
					campaigns: state.campaigns.filter((c) => c.id !== id),
					currentCampaign: state.currentCampaign?.id === id ? null : state.currentCampaign,
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

			sendMessage: (message) => {
				console.log('Sending message', message);
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
