import React from 'react';
import {
	Stack,
	Card,
	Button,
	Row,
	Col,
} from 'react-bootstrap';
import { useCharacterStore } from '@/stores/character-store';
import { Character } from '@/schemas/game';

export const CharacterList: React.FC = () => {
	const { characters, loadCharacter } = useCharacterStore();

	const renderCharacterCard = (character: Character) => (
		<Card
			key={character.id}
			className="shadow-sm h-100"
		>
			<Card.Body>
				<Stack gap={3}>
					<div>
						<Card.Title>{character.name}</Card.Title>
						<Card.Subtitle className="text-muted">
							Level {character.level} {character.race} {character.class}
						</Card.Subtitle>
					</div>

					<Row xs={2} className="g-2">
						<Col>
							<small>STR: {character.stats.strength}</small>
						</Col>
						<Col>
							<small>DEX: {character.stats.dexterity}</small>
						</Col>
						<Col>
							<small>CON: {character.stats.constitution}</small>
						</Col>
						<Col>
							<small>INT: {character.stats.intelligence}</small>
						</Col>
						<Col>
							<small>WIS: {character.stats.wisdom}</small>
						</Col>
						<Col>
							<small>CHA: {character.stats.charisma}</small>
						</Col>
					</Row>

					<Button
						variant="primary"
						size="sm"
						onClick={() => loadCharacter(character.id)}
					>
						Load Character
					</Button>
				</Stack>
			</Card.Body>
		</Card>
	);

	return (
		<Stack gap={4}>
			<h4>Your Characters</h4>
			<Row xs={1} md={2} lg={3} className="g-4">
				{characters.map((character) => (
					<Col key={character.id}>
						{renderCharacterCard(character)}
					</Col>
				))}
			</Row>
		</Stack>
	);
};
