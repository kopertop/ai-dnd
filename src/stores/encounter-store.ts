import { create } from 'zustand';
import { Position as MapPosition } from '@/schemas/game';
import { EncounterInit, EncounterInitSchema } from '@/schemas/encounter';

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

interface EncounterState {
	init: EncounterInit | null;
	currentTurn: number;
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

interface EncounterStore {
	activeEncounter: EncounterState | null;
	startEncounter: (encounterData: EncounterInit) => void;
	endEncounter: () => void;
	performAction: (action: EncounterAction) => void;
	updateParticipant: (id: string, updates: Partial<Encounter['participants'][0]>) => void;
	addLogEntry: (message: string) => void;
}

export const useEncounterStore = create<EncounterStore>((set, get) => ({
	activeEncounter: null,

	startEncounter: (encounterData) => {
		try {
			const parsed = EncounterInitSchema.parse(encounterData);
			set({
				activeEncounter: {
					init: parsed,
					currentTurn: 1,
					participants: parsed.combatants.map(c => ({
						id: c.id,
						type: c.type,
						position: c.position,
						health: c.stats.hp,
						maxHealth: c.stats.maxHp,
					})),
					log: [],
				},
			});
		} catch (error) {
			console.error('Invalid encounter data:', error);
		}
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
