import { CharacterStats } from '@/schemas/character';

const RACE_NAMES = {
	Human: {
		first: ['William', 'James', 'Eleanor', 'Rose', 'Thomas', 'Edward', 'Margaret', 'Alice'],
		last: ['Smith', 'Cooper', 'Fletcher', 'Wright', 'Miller', 'Baker', 'Mason'],
	},
	Elf: {
		first: ['Aelindra', 'Caelynn', 'Thaelar', 'Sylvaris', 'Faelyn', 'Aeris', 'Galad'],
		last: ['Moonweaver', 'Starwhisper', 'Silverleaf', 'Nightwind', 'Dawnweaver'],
	},
	Dwarf: {
		first: ['Thorin', 'Dwalin', 'Balin', 'Gimli', 'Thrain', 'Durin', 'Dain'],
		last: ['Ironbeard', 'Stonefist', 'Goldforge', 'Steelhand', 'Hammerfell'],
	},
	'Half-Orc': {
		first: ['Grok', 'Thokk', 'Karg', 'Azka', 'Rorg', 'Grash', 'Kord'],
		last: ['Skullcrusher', 'Bonegrinder', 'Steelclaw', 'Bloodfist', 'Ironhide'],
	},
	Halfling: {
		first: ['Bilbo', 'Frodo', 'Sam', 'Pippin', 'Merry', 'Rosie', 'Elanor'],
		last: ['Proudfoot', 'Goodbarrel', 'Greenhand', 'Brandybuck', 'Took'],
	},
	Gnome: {
		first: ['Fizwick', 'Zook', 'Gimble', 'Glim', 'Nix', 'Blink', 'Twinkle'],
		last: ['Geargrinder', 'Tinkertop', 'Sparksprocket', 'Clockwork', 'Gadgetspring'],
	},
	'Half-Elf': {
		first: ['Aiden', 'Lyra', 'Kael', 'Sera', 'Theron', 'Aria', 'Finn'],
		last: ['Windwalker', 'Moonshadow', 'Sunseeker', 'Dawnstar', 'Twilightborn'],
	},
};

const CLASS_STAT_PRIORITIES: Record<string, (keyof CharacterStats)[]> = {
	Fighter: ['strength', 'constitution', 'dexterity', 'wisdom', 'intelligence', 'charisma'],
	Wizard: ['intelligence', 'constitution', 'dexterity', 'wisdom', 'charisma', 'strength'],
	Rogue: ['dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma', 'strength'],
	Cleric: ['wisdom', 'constitution', 'strength', 'charisma', 'intelligence', 'dexterity'],
	Ranger: ['dexterity', 'wisdom', 'constitution', 'intelligence', 'strength', 'charisma'],
	Paladin: ['strength', 'charisma', 'constitution', 'wisdom', 'intelligence', 'dexterity'],
};

const STAT_VALUES = [15, 14, 13, 12, 10, 8];

export const generateRandomCharacter = (race: string, characterClass: string) => {
	// Generate name
	const raceNames = RACE_NAMES[race as keyof typeof RACE_NAMES];
	const firstName = raceNames.first[Math.floor(Math.random() * raceNames.first.length)];
	const lastName = raceNames.last[Math.floor(Math.random() * raceNames.last.length)];

	// Allocate stats based on class priorities
	const statPriorities = CLASS_STAT_PRIORITIES[characterClass];
	const stats = {} as CharacterStats;
	statPriorities.forEach((stat, index) => {
		stats[stat] = STAT_VALUES[index];
	});

	return {
		name: `${firstName} ${lastName}`,
		stats,
	};
};
