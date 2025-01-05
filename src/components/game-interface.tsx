import React, { useState } from 'react';
import {
	Container,
	Row,
	Col,
	Navbar,
	Button,
	Modal,
	ButtonGroup,
} from 'react-bootstrap';
import { GameMap } from './game-map';
import { CharacterSheet } from './character-sheet';
import { ChatInterface } from './chat-interface';
import { CreateCharacter } from './game-menu/create-character';
import { CharacterList } from './game-menu/character-list';
import { useGameStore } from '@/stores/game-store';
import { LuUsers, LuUserPlus, LuLogOut } from 'react-icons/lu';

export const GameInterface: React.FC = () => {
	const { currentCampaign, exitCampaign } = useGameStore();
	const [showCreateCharacter, setShowCreateCharacter] = useState(false);
	const [showCharacterList, setShowCharacterList] = useState(false);

	return (
		<Container fluid className="p-0">
			<Navbar bg="dark" variant="dark" className="px-4 fixed-top">
				<Navbar.Brand>
					{currentCampaign?.name || 'D&D Game'}
				</Navbar.Brand>
				<Navbar.Toggle />
				<Navbar.Collapse className="justify-content-end">
					<ButtonGroup>
						<Button
							variant="outline-light"
							onClick={() => setShowCreateCharacter(true)}
							title="Add Character"
						>
							<LuUserPlus />
						</Button>
						<Button
							variant="outline-light"
							onClick={() => setShowCharacterList(true)}
							title="View Characters"
						>
							<LuUsers />
						</Button>
						<Button
							variant="outline-danger"
							onClick={exitCampaign}
							title="Exit Campaign"
						>
							<LuLogOut />
						</Button>
					</ButtonGroup>
				</Navbar.Collapse>
			</Navbar>

			<Container fluid style={{ marginTop: '72px' }}>
				<Row className="g-4">
					<Col lg={9} md={12}>
						<GameMap />
					</Col>
					<Col lg={3} md={12}>
						<ChatInterface />
					</Col>
				</Row>
			</Container>

			<Modal
				show={showCreateCharacter}
				onHide={() => setShowCreateCharacter(false)}
				size="lg"
				centered
				className="modal-blur"
			>
				<Modal.Header closeButton>
					<Modal.Title>Create New Character</Modal.Title>
				</Modal.Header>
				<Modal.Body className="p-4">
					<CreateCharacter onComplete={() => setShowCreateCharacter(false)} />
				</Modal.Body>
			</Modal>

			<Modal
				show={showCharacterList}
				onHide={() => setShowCharacterList(false)}
				size="lg"
				centered
				className="modal-blur"
			>
				<Modal.Header closeButton>
					<Modal.Title>Campaign Characters</Modal.Title>
				</Modal.Header>
				<Modal.Body className="p-4">
					<CharacterList
						campaign={currentCampaign || undefined}
						onCharacterSelect={() => setShowCharacterList(false)}
					/>
				</Modal.Body>
			</Modal>
		</Container>
	);
};
