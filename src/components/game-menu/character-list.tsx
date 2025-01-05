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
import { Character } from '@/schemas/game';

export const CharacterList: React.FC = () => {
	const { characters, loadCharacter } = useGameStore();

	const renderCharacterCard = (character: Character) => (
		<Box
			key={character.id}
			borderWidth="1px"
			borderRadius="lg"
			p={4}
			bg="white"
			shadow="sm"
		>
			<VStack align="stretch" gap={2}>
				<Heading size="md">{character.name}</Heading>
				<Text>Level {character.stats.level} {character.stats.race} {character.stats.class}</Text>
				<SimpleGrid columns={2} gap={2}>
					<Text>STR: {character.stats.strength}</Text>
					<Text>DEX: {character.stats.dexterity}</Text>
					<Text>CON: {character.stats.constitution}</Text>
					<Text>INT: {character.stats.intelligence}</Text>
					<Text>WIS: {character.stats.wisdom}</Text>
					<Text>CHA: {character.stats.charisma}</Text>
				</SimpleGrid>
				<Button
					colorScheme="blue"
					onClick={() => loadCharacter(character.id)}
				>
					Load Character
				</Button>
			</VStack>
		</Box>
	);

	return (
		<VStack gap={4} align="stretch">
			<Heading size="md">Your Characters</Heading>
			<SimpleGrid columns={[1, 2, 3]} gap={4}>
				{characters.map(renderCharacterCard)}
			</SimpleGrid>
		</VStack>
	);
};
