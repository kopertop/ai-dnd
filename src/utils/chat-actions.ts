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
	const target = characters.find(c => c.id === action.targetId);
	if (!target) return false;

	switch (action.type) {
		case 'damage':
			if (action.value) {
				updateCharacter(target.id, {
					hp: Math.max(0, target.hp - action.value),
				});
			}
			break;

		case 'heal':
			if (action.value) {
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
				const updatedEquipment = {
					...target.equipment,
					[action.slot]: action.item,
				};
				updateCharacter(target.id, { equipment: updatedEquipment });
			}
			break;

		case 'unequip':
			if (action.slot && target.equipment[action.slot]) {
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
			updateCharacter(target.id, {
				level: target.level + 1,
				maxHp: target.maxHp + 5, // Simple HP increase, adjust as needed
				hp: target.maxHp + 5,
			});
			break;

		case 'startEncounter':
			useEncounterStore.getState().startEncounter(characters);
			break;

		case 'endEncounter':
			useEncounterStore.getState().endEncounter();
			break;

		default:
			return false;
	}

	return true;
}
