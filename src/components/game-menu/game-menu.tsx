import React, { useState } from 'react';
import {
	Box,
	Heading,
	VStack,
} from '@chakra-ui/react';
import {
	Tabs,
	TabList,
	TabPanels,
	Tab,
	TabPanel,
} from '@chakra-ui/tabs';
import { CharacterList } from './character-list';
import { CampaignList } from './campaign-list';
import { CreateCharacter } from './create-character';
import { CreateCampaign } from './create-campaign';

export const GameMenu: React.FC = () => {
	const [activeTab, setActiveTab] = useState(0);

	return (
		<Box maxW="800px" w="full" p={4}>
			<VStack gap={6} align="stretch">
				<Heading size="lg" textAlign="center">
					D&D Game Menu
				</Heading>
				<Tabs index={activeTab} onChange={setActiveTab} variant="enclosed">
					<TabList>
						<Tab>Characters</Tab>
						<Tab>Campaigns</Tab>
					</TabList>
					<TabPanels>
						<TabPanel>
							<CharacterList />
							<CreateCharacter />
						</TabPanel>
						<TabPanel>
							<CampaignList />
							<CreateCampaign />
						</TabPanel>
					</TabPanels>
				</Tabs>
			</VStack>
		</Box>
	);
};
