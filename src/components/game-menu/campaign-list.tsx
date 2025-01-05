import React from 'react';
import {
	VStack,
	Heading,
	Box,
	Text,
	Button,
	SimpleGrid,
	Badge,
} from '@chakra-ui/react';
import { useGameStore } from '@/stores/game-store';
import { Campaign } from '@/schemas/menu';

export const CampaignList: React.FC = () => {
	const { campaigns, loadCampaign } = useGameStore();

	const renderCampaignCard = (campaign: Campaign) => (
		<Box
			key={campaign.id}
			borderWidth="1px"
			borderRadius="lg"
			p={4}
			bg="white"
			shadow="sm"
		>
			<VStack align="stretch" gap={2}>
				<Heading size="md">{campaign.name}</Heading>
				<Text>{campaign.description}</Text>
				<Text fontSize="sm" color="gray.600">
					Last played: {new Date(campaign.lastPlayed).toLocaleDateString()}
				</Text>
				<Badge colorScheme="green">
					{campaign.characters.length} Characters
				</Badge>
				<Button
					colorScheme="blue"
					onClick={() => loadCampaign(campaign.id)}
				>
					Load Campaign
				</Button>
			</VStack>
		</Box>
	);

	return (
		<VStack gap={4} align="stretch">
			<Heading size="md">Your Campaigns</Heading>
			<SimpleGrid columns={[1, 2]} gap={4}>
				{campaigns.map(renderCampaignCard)}
			</SimpleGrid>
		</VStack>
	);
};
