import React, { useState, useEffect } from 'react';
import {
	Container,
	Row,
	Col,
	Navbar,
	Button,
	Modal,
	ButtonGroup,
	Stack,
} from 'react-bootstrap';
import { AIChatInterface } from './chat-interface';
import { CreateCharacter } from './game-menu/create-character';
import { CharacterList } from './game-menu/character-list';
import { useGameStore } from '@/stores/game-store';
import { LuUsers, LuUserPlus, LuLogOut } from 'react-icons/lu';
import { CampaignCharacterList } from './game-menu/campaign-character-list';
import { InventoryList } from './game-menu/inventory-list';
import { OpeningMenu } from './game-menu/opening-menu';
import { AddCharacters } from './game-menu/add-characters';
import { generateInventory } from '@/utils/campaign-inventory';

export const GameInterface: React.FC = () => {
	const { currentCampaign, exitCampaign, updateCampaign } = useGameStore();
	const [showCreateCharacter, setShowCreateCharacter] = useState(false);
	const [showCharacterList, setShowCharacterList] = useState(false);
	const [isGeneratingInventory, setIsGeneratingInventory] = useState(false);

	useEffect(() => {
		if (currentCampaign && !currentCampaign.inventory?.length && !isGeneratingInventory) {
			setIsGeneratingInventory(true);
			generateInventory(currentCampaign).then(() => {
				updateCampaign(currentCampaign.id, { inventory: currentCampaign.inventory });
				setIsGeneratingInventory(false);
			});
		}
	}, [currentCampaign, updateCampaign]);

	// If no campaign is loaded, show the opening menu
	if (!currentCampaign) {
		return <OpeningMenu />;
	}

	// If the campaign doesn't have any characters, show the Add Characters menu
	if (!Object.keys(currentCampaign.characters).length) {
		return <AddCharacters />;
	}

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

			<Container fluid style={{ marginTop: '40px', paddingBottom: '2rem' }}>
				<Row className="g-4">
					<Col xl={3} lg={4} md={12}>
						<Stack gap={4}>
							<CampaignCharacterList campaign={currentCampaign || undefined}/>
							<InventoryList campaign={currentCampaign || undefined} />
						</Stack>
					</Col>
					<Col xl={9} lg={8} md={12}>
						<AIChatInterface />
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
