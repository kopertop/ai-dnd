import { Character, CharacterEquipment } from '@/schemas/character';
import { Item } from '@/schemas/item';

const DEFAULT_WEAPONS: Record<string, Partial<Item>> = {
	sword: {
		id: 'sword',
		name: 'Longsword',
		description: 'A versatile blade favored by warriors',
		type: 'weapon',
		slot: 'mainHand',
		stats: { damage: 8 },
		value: 15,
	},
	staff: {
		id: 'staff',
		name: 'Quarterstaff',
		description: 'A wooden staff used for both walking and combat',
		type: 'weapon',
		slot: 'mainHand',
		stats: { damage: 6 },
		value: 2,
	},
	dagger: {
		id: 'dagger',
		name: 'Dagger',
		description: 'A quick, concealable blade',
		type: 'weapon',
		slot: 'mainHand',
		stats: { damage: 4 },
		value: 2,
	},
	bow: {
		id: 'bow',
		name: 'Shortbow',
		description: 'A compact bow ideal for hunting and combat',
		type: 'weapon',
		slot: 'mainHand',
		stats: { damage: 6 },
		value: 25,
	},
};

const DEFAULT_ARMOR: Record<string, Partial<Item>> = {
	leather: {
		id: 'leather-armor',
		name: 'Leather Armor',
		description: 'Light armor made of treated leather',
		type: 'armor',
		slot: 'chest',
		stats: { armor: 11 },
		value: 10,
	},
	chainmail: {
		id: 'chainmail',
		name: 'Chain Mail',
		description: 'Heavy armor made of interlocking metal rings',
		type: 'armor',
		slot: 'chest',
		stats: { armor: 16 },
		value: 75,
	},
	robes: {
		id: 'robes',
		name: 'Wizard Robes',
		description: 'Comfortable robes with many pockets for components',
		type: 'armor',
		slot: 'chest',
		stats: { armor: 10, intelligence: 1 },
		value: 10,
	},
};

const CLASS_EQUIPMENT: Record<string, (keyof typeof DEFAULT_WEAPONS | keyof typeof DEFAULT_ARMOR)[]> = {
	Fighter: ['sword', 'chainmail'],
	Wizard: ['staff', 'robes'],
	Rogue: ['dagger', 'leather'],
	Cleric: ['staff', 'chainmail'],
	Ranger: ['bow', 'leather'],
	Paladin: ['sword', 'chainmail'],
};

export const addDefaultEquipment = (character: Character): void => {
	console.log('Adding default equipment for character', character);
	const equipment: CharacterEquipment = {};
	const defaultItems = CLASS_EQUIPMENT[character.class] || [];

	defaultItems.forEach(itemKey => {
		const weaponItem = DEFAULT_WEAPONS[itemKey];
		const armorItem = DEFAULT_ARMOR[itemKey];
		const item = weaponItem || armorItem;

		if (item) {
			const fullItem: Item = {
				...item,
				id: `${item.id}-${crypto.randomUUID()}`,
				quantity: 1,
				stackable: false,
			} as Item;

			if (fullItem.slot && fullItem.slot !== 'none') {
				equipment[fullItem.slot] = fullItem;
			}
		}
	});

	character.equipment = equipment;
};
