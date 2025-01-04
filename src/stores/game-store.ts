import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { generateMap } from '../utils/map-generator';
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
	regenerateMap: (width?: number, height?: number) => void;
}

const DEFAULT_MAP_WIDTH = window.innerWidth < 768 ? 20 : 40;
const DEFAULT_MAP_HEIGHT = window.innerWidth < 768 ? 20 : 30;

const initialState: GameState = {
	characters: [],
	currentTurn: '',
	gameMap: {
		...generateMap(DEFAULT_MAP_WIDTH, DEFAULT_MAP_HEIGHT)
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

			regenerateMap: (width?: number, height?: number) =>
				set((state) => ({
					gameMap: generateMap(width || state.gameMap.width, height || state.gameMap.height),
					characters: state.characters.map(char => ({
						...char,
						position: { x: 1, y: 1 } // Reset characters to safe starting position
					}))
				})),
		}),
		{ name: 'game-store' }
	)
);
