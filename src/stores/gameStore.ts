import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import {
	GameState,
	GameStateSchema,
	GameMessageSchema,
	PositionSchema,
	Character
} from '../schemas/game';

interface GameStore extends GameState {
	sendMessage: (content: string, type?: 'system' | 'player' | 'dm') => void;
	moveCharacter: (characterId: string, x: number, y: number) => void;
	addCharacter: (character: Character) => void;
	removeCharacter: (characterId: string) => void;
}

const initialState: GameState = {
	characters: [],
	currentTurn: '',
	gameMap: {
		id: '1',
		tiles: [],
		width: 20,
		height: 20,
		name: 'Default Map',
	},
	messages: [],
};

// Validate initial state
GameStateSchema.parse(initialState);

export const useGameStore = create<GameStore>()(
	devtools(
		(set) => ({
			...initialState,

			sendMessage: (content: string, type = 'player') =>
				set((state) => {
					const newMessage = {
						id: Date.now().toString(),
						content,
						sender: type === 'player' ? 'Player' : type === 'dm' ? 'DM' : 'System',
						timestamp: Date.now(),
						type,
					};

					GameMessageSchema.parse(newMessage);

					return {
						messages: [...state.messages, newMessage],
					};
				}),

			moveCharacter: (characterId: string, x: number, y: number) =>
				set((state) => {
					const newPosition = { x, y };
					PositionSchema.parse(newPosition);

					return {
						characters: state.characters.map((char) =>
							char.id === characterId
								? { ...char, position: newPosition }
								: char
						),
					};
				}),

			addCharacter: (character: Character) =>
				set((state) => ({
					characters: [...state.characters, character],
				})),

			removeCharacter: (characterId: string) =>
				set((state) => ({
					characters: state.characters.filter((char) => char.id !== characterId),
				})),
		}),
		{ name: 'game-store' }
	)
);
