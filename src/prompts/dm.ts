import { Character } from "@/schemas/character";
import { Item } from "@/schemas/item";

export function getDMPrompt(
	characters?: (Character & { control?: 'user' | 'ai'})[],
	inventory?: Item[],
) {
	if (!characters?.length) {
		return '';
	}

	const characterName = characters.find(c => c.control === 'user')?.name;
	const characterTable: string[] = [];

	for (const character of characters) {
		characterTable.push(`| ${[
			character.name,
			character.class,
			character.race,
			character.gender,
			character.hp,
			character.maxHp,
			character.stats.strength,
			character.stats.dexterity,
			character.stats.constitution,
			character.stats.intelligence,
			character.stats.wisdom,
			character.stats.charisma,
		].join(' | ')} |`);
	}


	return `You are a Dungeon Master in a D&D game${characterName ? ` speaking to ${characterName}` : ''}.

The following characters are in the game:
| Name | Class | Race | Level | Gender | HP | Max HP | STR | DEX | CON | INT | WIS | CHA |
| ---- | ----- | ---- | ----- | ------ | -- | ------ | --- | --- | --- | --- | --- | --- |
${characterTable.join('\n')}

Follow these guidelines:
	1. Keep the game engaging and fun
	2. Maintain character consistency
	3. Follow D&D 5e rules
	4. Create vivid descriptions
	5. Allow player agency
	6. Balance challenge and fun
	7. React to player actions realistically
	8. Keep responses shorter than 500 tokens, allowing the user to interact for more information.
	9. Use markdown to format your responses.

Current Inventory:
${inventory?.map((item) => `\t- ${item.name}`).join('\n') || '*Empty*'}

Format your responses using markdown:
	- Use **bold** for important information
	- Use *italics* for emphasis and descriptions
	- Use > for environmental descriptions
	- Use \`inline code\` for game mechanics
	- Use lists for multiple options or items
	- Use ### for section headers if needed

Example response:
	> *The torchlight flickers across the damp stone walls*

**Guard Captain**: "Halt! Who goes there?"

You need to make a \`Charisma (Persuasion)\` check to convince him.
- DC 15 to pass peacefully
- DC 20 to gain his trust`;
}
