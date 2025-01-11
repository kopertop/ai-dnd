import { create } from 'zustand';
import { Character } from '@/schemas/character';
import { MapPosition } from '@/schemas/game';

export interface Encounter {
	id: string;
	currentTurn: number;
	initiative: Record<string, number>; // character ID to initiative roll
	participants: {
		id: string;
		type: 'player' | 'enemy';
		position: MapPosition;
		health: number;
		maxHealth: number;
	}[];
	log: {
		turn: number;
		message: string;
		timestamp: number;
	}[];
}

export type EncounterAction = {
	type: 'attack' | 'item' | 'spell' | 'move';
	actor: string;
	target?: string;
	item?: string;
	spell?: string;
	position?: MapPosition;
};

interface EncounterStore {
	activeEncounter: Encounter | null;
	startEncounter: (participants: Character[]) => void;
	endEncounter: () => void;
	performAction: (action: EncounterAction) => void;
	updateParticipant: (id: string, updates: Partial<Encounter['participants'][0]>) => void;
	addLogEntry: (message: string) => void;
}

export const useEncounterStore = create<EncounterStore>((set, get) => ({
	activeEncounter: null,

	startEncounter: (participants) => {
		const encounter: Encounter = {
			id: crypto.randomUUID(),
			currentTurn: 1,
			initiative: {},
			participants: participants.map(p => ({
				id: p.id,
				type: p.type as 'player' | 'enemy',
				position: p.position || { x: 0, y: 0 },
				health: p.stats.constitution * 2,
				maxHealth: p.stats.constitution * 2,
			})),
			log: [],
		};

		// Roll initiative for all participants
		participants.forEach(p => {
			encounter.initiative[p.id] = Math.floor(Math.random() * 20) + 1;
		});

		set({ activeEncounter: encounter });
	},

	endEncounter: () => {
		set({ activeEncounter: null });
	},

	performAction: (action) => {
		const { activeEncounter } = get();
		if (!activeEncounter) return;

		// Handle different action types
		switch (action.type) {
			case 'move':
				if (action.position) {
					get().updateParticipant(action.actor, { position: action.position });
					get().addLogEntry(`${action.actor} moved to position (${action.position.x}, ${action.position.y})`);
				}
				break;
			case 'attack':
				// Implement attack logic
				break;
			case 'spell':
				// Implement spell casting logic
				break;
			case 'item':
				// Implement item usage logic
				break;
		}
	},

	updateParticipant: (id, updates) => {
		set(state => {
			if (!state.activeEncounter) return state;

			return {
				activeEncounter: {
					...state.activeEncounter,
					participants: state.activeEncounter.participants.map(p =>
						p.id === id ? { ...p, ...updates } : p
					),
				},
			};
		});
	},

	addLogEntry: (message) => {
		set(state => {
			if (!state.activeEncounter) return state;

			return {
				activeEncounter: {
					...state.activeEncounter,
					log: [
						...state.activeEncounter.log,
						{
							turn: state.activeEncounter.currentTurn,
							message,
							timestamp: Date.now(),
						},
					],
				},
			};
		});
	},
}));
