import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { GameMap } from './game-map';
import { CharacterSheet } from './character-sheet';
import { ChatInterface } from './chat-interface';

export const GameInterface: React.FC = () => {
	return (
		<Container fluid>
			<Row className="g-4">
				<Col md={3}>
					<CharacterSheet />
				</Col>
				<Col md={6}>
					<GameMap />
				</Col>
				<Col md={3}>
					<ChatInterface />
				</Col>
			</Row>
		</Container>
	);
};
