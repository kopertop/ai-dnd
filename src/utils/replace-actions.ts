/**
 * Replace actions in a string message with Markdown
 */
export function replaceActions(message: string) {
	// Handle incomplete streaming tags first
	const streamingTags = ['startEncounter', 'endEncounter', 'damage', 'heal', 'equip', 'unequip', 'addItem', 'removeItem', 'levelUp'];

	for (const tag of streamingTags) {
		const startPattern = new RegExp(`\\[${tag}\\](?!.*\\[\\/${tag}\\])`, 'g');
		message = message.replace(startPattern, (match) => {
			switch (tag) {
				case 'startEncounter':
					return '**Starting Encounter**';
				case 'endEncounter':
					return '**Ending Encounter**';
				case 'damage':
					return '**Dealing Damage**';
				case 'heal':
					return '**Healing**';
				case 'equip':
					return '**Equipping Item**';
				case 'unequip':
					return '**Unequipping Item**';
				case 'addItem':
					return '**Adding Item**';
				case 'removeItem':
					return '**Removing Item**';
				case 'levelUp':
					return '**Leveling Up**';
				default:
					return match;
			}
		});
	}
	console.log('Message:', message);
	return message.replace(/\[([^\]]+)\]([^[]+)\[\/\1\]/g, (match, type, value) => {
		console.log('Match:', match);
		console.log('Type:', type);
		console.log('Value:', value);
		return `[${type}](/${type}?data=${value})`;
	});
}
