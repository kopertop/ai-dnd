import React from 'react';
import { Stack, Button, ListGroup } from 'react-bootstrap';
import { Character } from '@/schemas/character';
import { EncounterAction } from '@/stores/encounter-store';

interface ActionMenuProps {
	actionType: 'attack' | 'item' | 'spell' | 'move';
	character: Character;
	onAction: (action: EncounterAction) => void;
	onCancel: () => void;
}

export const ActionMenu: React.FC<ActionMenuProps> = ({
	actionType,
	character,
	onAction,
	onCancel,
}) => {
	return (
		<Stack gap={2}>
			<h6>{actionType.charAt(0).toUpperCase() + actionType.slice(1)} Action</h6>

			<ListGroup>
				{actionType === 'item' && character.equipment && Object.entries(character.equipment).map(([id, item]) => (
					<ListGroup.Item
						key={id}
						action
						onClick={() => onAction({
							type: 'item',
							actor: character.id,
							item: id,
						})}
					>
						{item.name}
					</ListGroup.Item>
				))}

				{actionType === 'spell' && character.spells?.map(spell => (
					<ListGroup.Item
						key={spell.id}
						action
						onClick={() => onAction({
							type: 'spell',
							actor: character.id,
							spell: spell.id,
						})}
					>
						{spell.name}
					</ListGroup.Item>
				))}
			</ListGroup>

			<Button variant='outline-secondary' onClick={onCancel}>
				Cancel
			</Button>
		</Stack>
	);
};
