import { Campaign } from '@/schemas/campaign';
import { Item } from '@/schemas/item';

const BASIC_SUPPLIES: Partial<Item>[] = [
	{
		id: 'map',
		name: 'Campaign Map',
		description: 'A detailed map of the region, marked with key locations',
		type: 'misc',
		slot: 'none',
		quantity: 1,
		stackable: false,
		value: 5,
	},
	{
		id: 'rations',
		name: 'Trail Rations',
		description: 'Dried meat, fruit, and hardtack - enough to keep adventurers going',
		type: 'misc',
		slot: 'none',
		quantity: 20,
		stackable: true,
		value: 1,
	},
	{
		id: 'torch',
		name: 'Torches',
		description: 'Standard torches that provide light in dark places',
		type: 'misc',
		slot: 'none',
		quantity: 10,
		stackable: true,
		value: 1,
	},
	{
		id: 'rope',
		name: 'Hemp Rope (50 ft)',
		description: 'Strong rope useful for climbing and binding',
		type: 'misc',
		slot: 'none',
		quantity: 2,
		stackable: true,
		value: 1,
	},
	{
		id: 'waterskin',
		name: 'Waterskins',
		description: 'Leather containers for carrying water',
		type: 'misc',
		slot: 'none',
		quantity: 5,
		stackable: true,
		value: 2,
	},
	{
		id: 'healers-kit',
		name: 'Healer\'s Kit',
		description: 'Bandages and herbs for treating wounds',
		type: 'misc',
		slot: 'none',
		quantity: 2,
		stackable: true,
		value: 5,
	},
];

const generateThematicItems = async (scenario: string): Promise<Partial<Item>[]> => {
	try {
		const response = await fetch('/api/generate-items', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ scenario }),
		});

		const data = await response.json();
		return data.items || [];
	} catch (error) {
		console.error('Failed to generate thematic items:', error);
		return [];
	}
};

const RANDOM_SUPPLIES: Partial<Item>[] = [
	{
		id: 'tinderbox',
		name: 'Tinderbox',
		description: 'Steel, flint, and tinder for starting fires',
		type: 'misc',
		slot: 'none',
		quantity: 1,
		stackable: true,
		value: 5,
	},
	{
		id: 'bedroll',
		name: 'Bedroll',
		description: 'A comfortable sleeping roll for camping',
		type: 'misc',
		slot: 'none',
		quantity: 1,
		stackable: true,
		value: 1,
	},
	{
		id: 'chalk',
		name: 'Chalk Pieces',
		description: 'For marking paths and taking notes',
		type: 'misc',
		slot: 'none',
		quantity: 5,
		stackable: true,
		value: 1,
	},
];

export const generateInventory = async (campaign: Campaign): Promise<void> => {
	// Always include basic supplies
	let inventory: Item[] = BASIC_SUPPLIES.map(item => ({
		...item,
		id: `${item.id}-${crypto.randomUUID()}`,
	})) as Item[];

	// Add 1-2 random common supplies
	const randomSupplies = RANDOM_SUPPLIES
		.sort(() => Math.random() - 0.5)
		.slice(0, 1 + Math.floor(Math.random() * 2));

	inventory = [...inventory, ...randomSupplies.map(item => ({
		...item,
		id: `${item.id}-${crypto.randomUUID()}`,
	})) as Item[]];

	// Add thematic items based on campaign scenario
	if (campaign.description) {
		const thematicItems = await generateThematicItems(campaign.description);
		inventory = [...inventory, ...thematicItems.map(item => ({
			...item,
			id: `${item.id}-${crypto.randomUUID()}`,
		})) as Item[]];
	}

	campaign.inventory = inventory;
};
