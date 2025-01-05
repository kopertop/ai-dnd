import React from 'react';
import { Card, Row, Col, Badge, Stack } from 'react-bootstrap';
import { Character } from '@/schemas/character';
import { CharacterImage } from '@/components/shared/character-image';

interface CharacterCardProps {
	character: Character;
	header?: React.ReactNode;
	footer?: React.ReactNode;
	className?: string;
}

export const CharacterCard: React.FC<CharacterCardProps> = ({
	character,
	header,
	footer,
	className = '',
}) => {
	return (
		<Card className={`shadow-sm ${className}`}>
			{header && <Card.Header>{header}</Card.Header>}
			<Card.Body>
				<Stack gap={3}>
					<div className='d-flex gap-3'>
						<CharacterImage character={character} />
						<div className='flex-grow-1'>
							<h5 className='mb-0'>{character.name}</h5>
							<div className='text-muted'>
								Level {character.level} {character.race} {character.class}
							</div>
							<div className='text-muted small'>
								{character.gender} • HP: {character.hp}/{character.maxHp}
							</div>
						</div>
					</div>

					<Row xs={2} className='g-2 text-muted small'>
						<Col>STR: {character.stats.strength}</Col>
						<Col>DEX: {character.stats.dexterity}</Col>
						<Col>CON: {character.stats.constitution}</Col>
						<Col>INT: {character.stats.intelligence}</Col>
						<Col>WIS: {character.stats.wisdom}</Col>
						<Col>CHA: {character.stats.charisma}</Col>
					</Row>

					{Object.entries(character.equipment || []).length > 0 && (
						<div>
							<div className='text-muted mb-2'>Equipment</div>
							<div className='d-flex gap-2 flex-wrap'>
								{Object.entries(character.equipment).map(([slot, item]) => (
									item && (
										<Badge
											key={slot}
											bg='light'
											text='dark'
											className='text-capitalize'
										>
											{slot}: {item.name}
										</Badge>
									)
								))}
							</div>
						</div>
					)}
				</Stack>
			</Card.Body>
			{footer && <Card.Footer>{footer}</Card.Footer>}
		</Card>
	);
};
