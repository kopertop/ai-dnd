import React, { useState } from 'react';
import {
	Card,
	Stack,
	Button,
	ButtonGroup,
	Row,
	Col,
} from 'react-bootstrap';
import { GameMap } from './game-map';
import { useGameStore } from '@/stores/game-store';
import { useCharacterStore } from '@/stores/character-store';
import { LuSword, LuBackpack, LuWand, LuMove } from 'react-icons/lu';
import { ActionMenu } from './encounter/action-menu';
import { useEncounterStore } from '@/stores/encounter-store';
import { EncounterLog } from './encounter/encounter-log';

export const EncounterInterface: React.FC = () => {
	const [selectedAction, setSelectedAction] = useState<'attack' | 'item' | 'spell' | 'move' | null>(null);
	const { currentCampaign } = useGameStore();
	const { activeEncounter, performAction } = useEncounterStore();
	const { getCharactersByIds } = useCharacterStore();

	if (!currentCampaign || !activeEncounter) return null;

	const characters = getCharactersByIds(Object.keys(currentCampaign.characters));
	const activeCharacter = characters.find(c =>
		currentCampaign.characters[c.id] === 'user'
	);

	if (!activeCharacter) return null;

	return (
		<Card className='shadow-sm'>
			<Card.Header className='bg-dark text-white d-flex justify-content-between align-items-center'>
				<h5 className='mb-0'>Combat Encounter</h5>
				<span>Turn: {activeEncounter.currentTurn}</span>
			</Card.Header>
			<Card.Body className='p-0'>
				<Row className='g-0'>
					<Col md={8}>
						<GameMap />
					</Col>
					<Col md={4} className='border-start'>
						<Stack gap={3} className='p-3'>
							<div>
								<h6>Actions</h6>
								<ButtonGroup className='w-100'>
									<Button
										variant={selectedAction === 'attack' ? 'primary' : 'outline-primary'}
										onClick={() => setSelectedAction('attack')}
										title='Attack'
									>
										<LuSword />
									</Button>
									<Button
										variant={selectedAction === 'item' ? 'primary' : 'outline-primary'}
										onClick={() => setSelectedAction('item')}
										title='Use Item'
									>
										<LuBackpack />
									</Button>
									<Button
										variant={selectedAction === 'spell' ? 'primary' : 'outline-primary'}
										onClick={() => setSelectedAction('spell')}
										title='Cast Spell'
									>
										<LuWand />
									</Button>
									<Button
										variant={selectedAction === 'move' ? 'primary' : 'outline-primary'}
										onClick={() => setSelectedAction('move')}
										title='Move'
									>
										<LuMove />
									</Button>
								</ButtonGroup>
							</div>

							{selectedAction && (
								<ActionMenu
									actionType={selectedAction}
									character={activeCharacter}
									onAction={(action) => {
										performAction(action);
										setSelectedAction(null);
									}}
									onCancel={() => setSelectedAction(null)}
								/>
							)}

							<EncounterLog />
						</Stack>
					</Col>
				</Row>
			</Card.Body>
		</Card>
	);
};
