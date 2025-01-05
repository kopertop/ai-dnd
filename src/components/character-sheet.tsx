import React, { useState, useEffect } from 'react';
import {
	Box,
	VStack,
	HStack,
	Text,
	Heading,
} from '@chakra-ui/react';
import { Stat, StatLabel, StatNumber, StatHelpText } from '@chakra-ui/stat';
import { useToast } from '@chakra-ui/toast';
import { useGameStore } from '@/stores/game-store';
import {
	NumberInput,
	NumberInputField,
} from '@chakra-ui/number-input';

const BASE_STAT = 5;
const TOTAL_POINTS = 10;
const MIN_STAT = 5;
const MAX_STAT = 15;

type Attribute = 'strength' | 'dexterity' | 'constitution' | 'intelligence' | 'wisdom' | 'charisma';

const getModifier = (value: number): number => Math.floor((value - 10) / 2);

const formatModifier = (mod: number): string => {
	if (mod > 0) return `+${mod}`;
	return mod.toString();
};

export const CharacterSheet: React.FC = () => {
	const { characters, updateCharacter } = useGameStore();
	const player = characters.find(c => c.type === 'player');
	const toast = useToast();

	const [stats, setStats] = useState({
		strength: BASE_STAT,
		dexterity: BASE_STAT,
		constitution: BASE_STAT,
		intelligence: BASE_STAT,
		wisdom: BASE_STAT,
		charisma: BASE_STAT,
	});

	const [remainingPoints, setRemainingPoints] = useState(TOTAL_POINTS);

	useEffect(() => {
		if (player) {
			setStats(player.stats);
			const usedPoints = Object.values(player.stats).reduce(
				(sum, value) => Number(sum) + (Number(value) - BASE_STAT),
				0
			) as number;
			setRemainingPoints(TOTAL_POINTS - usedPoints);
		}
	}, [player]);

	const handleStatChange = (attribute: Attribute, newValue: number) => {
		const oldValue = stats[attribute];
		const pointDiff = newValue - oldValue;

		if (remainingPoints - pointDiff < 0) {
			toast({
				title: 'Not enough points',
				description: `You have ${remainingPoints} points remaining`,
				status: 'error',
				duration: 2000,
			});
			return;
		}

		if (newValue < MIN_STAT || newValue > MAX_STAT) {
			toast({
				title: 'Invalid value',
				description: `Stats must be between ${MIN_STAT} and ${MAX_STAT}`,
				status: 'error',
				duration: 2000,
			});
			return;
		}

		const newStats = { ...stats, [attribute]: newValue };
		setStats(newStats);
		setRemainingPoints(prev => prev - pointDiff);

		if (player) {
			updateCharacter(player.id, { stats: newStats });
		}
	};

	const renderStat = (attribute: Attribute, label: string) => (
		<Stat>
			<StatLabel>{label}</StatLabel>
			<HStack gap={4} align="center">
				<NumberInput
					value={stats[attribute]}
					onChange={(_, value) => handleStatChange(attribute, value)}
					min={MIN_STAT}
					max={MAX_STAT}
					width="80px"
				>
					<NumberInputField />
				</NumberInput>
				<StatNumber>
					{formatModifier(getModifier(stats[attribute]))}
				</StatNumber>
			</HStack>
			<StatHelpText>Modifier</StatHelpText>
		</Stat>
	);

	return (
		<Box
			borderWidth="1px"
			borderRadius="lg"
			p={6}
			m={4}
			bg="white"
			shadow="md"
		>
			<VStack gap={6} align="stretch">
				<Heading size="md" textAlign="center">Character Sheet</Heading>
				<Text textAlign="center" color="gray.600">
					Points Remaining: {remainingPoints}
				</Text>
				<VStack gap={4}>
					{renderStat('strength', 'Strength')}
					{renderStat('dexterity', 'Dexterity')}
					{renderStat('constitution', 'Constitution')}
					{renderStat('intelligence', 'Intelligence')}
					{renderStat('wisdom', 'Wisdom')}
					{renderStat('charisma', 'Charisma')}
				</VStack>
			</VStack>
		</Box>
	);
};
