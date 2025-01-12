import { Character } from '@/schemas/character';
import { Campaign } from '@/schemas/campaign';
import { Item } from '@/schemas/item';
import { useEncounterStore } from '@/stores/encounter-store';

export type ChatAction = {
	type: 'damage' | 'heal' | 'equip' | 'unequip' | 'addItem' | 'removeItem' | 'levelUp' | 'startEncounter' | 'endEncounter';
	targetId: string;
	value?: number;
	item?: Item;
	slot?: keyof Character['equipment'];
};

export function handleChatAction(
	action: ChatAction,
	campaign: Campaign,
	characters: Character[],
	updateCampaign: (id: string, updates: Partial<Campaign>) => void,
	updateCharacter: (id: string, updates: Partial<Character>) => void,
) {
	console.log('Handling chat action:', action);

	const target = characters.find(c => c.id === action.targetId);
	if (!target && action.type !== 'startEncounter' && action.type !== 'endEncounter') {
		console.warn('Target character not found:', action.targetId);
		return false;
	}

	switch (action.type) {
		case 'startEncounter': {
			console.log('Starting encounter with characters:', characters);
			useEncounterStore.getState().startEncounter({
				type: 'combat',
				difficulty: 'medium',
				map: {
					type: 'dungeon',
					width: 10,
					height: 10,
					obstacles: [],
					exits: [],
					description: 'A simple battle arena',
				},
				combatants: characters.map(c => ({
					id: c.id,
					name: c.name,
					type: c.type === 'player' ? 'player' : 'enemy',
					position: c.position,
					stats: {
						hp: c.hp,
						maxHp: c.maxHp,
						ac: 10 + Math.floor((c.stats.dexterity - 10) / 2),
						strength: c.stats.strength,
						dexterity: c.stats.dexterity,
						constitution: c.stats.constitution,
					},
					abilities: [],
				})),
				description: 'Combat has begun!',
			});
			return true;
		}

		case 'endEncounter': {
			console.log('Ending encounter');
			useEncounterStore.getState().endEncounter();
			return true;
		}

		case 'damage': {
			if (!target || !action.value) return false;
			console.log('Applying damage:', action.value, 'to:', target.name);
			updateCharacter(target.id, {
				hp: Math.max(0, target.hp - action.value),
			});
			return true;
		}

		case 'heal':
			if (action.value && target) {
				updateCharacter(target.id, {
					hp: Math.min(target.maxHp, target.hp + action.value),
				});
			}
			break;

		case 'equip':
			if (action.item && action.slot) {
				// Remove from campaign inventory
				const updatedInventory = campaign.inventory.filter(i => i.id !== action.item?.id);
				updateCampaign(campaign.id, { inventory: updatedInventory });

				// Add to character equipment
				if (target) {
					const updatedEquipment = {
						...target.equipment,
						[action.slot]: action.item,
					};
					updateCharacter(target.id, { equipment: updatedEquipment });
				}
			}
			break;

		case 'unequip':
			if (action.slot && target?.equipment[action.slot]) {
				// Add to campaign inventory
				const item = target.equipment[action.slot];
				if (item) {
					updateCampaign(campaign.id, {
						inventory: [...campaign.inventory, item],
					});

					// Remove from character equipment
					const updatedEquipment = { ...target.equipment };
					delete updatedEquipment[action.slot];
					updateCharacter(target.id, { equipment: updatedEquipment });
				}
			}
			break;

		case 'addItem':
			if (action.item) {
				updateCampaign(campaign.id, {
					inventory: [...campaign.inventory, action.item],
				});
			}
			break;

		case 'removeItem':
			if (action.item) {
				updateCampaign(campaign.id, {
					inventory: campaign.inventory.filter(i => i.id !== action.item?.id),
				});
			}
			break;

		case 'levelUp':
			if (target) {
				updateCharacter(target.id, {
					level: target.level + 1,
					maxHp: target.maxHp + 5, // Simple HP increase, adjust as needed
					hp: target.maxHp + 5,
				});
			}
			break;

		default:
			return false;
	}

	return false;
}
