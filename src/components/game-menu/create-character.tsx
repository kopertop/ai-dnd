import React from 'react';
import {
	Box,
	Button,
	FormControl,
	FormLabel,
	Input,
	VStack,
	Select,
	NumberInput,
	NumberInputField,
	NumberInputStepper,
	NumberIncrementStepper,
	NumberDecrementStepper,
	useToast,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CharacterSchema, Character } from '@/schemas/game';
import { useGameStore } from '@/stores/game-store';

type CharacterFormData = Omit<Character, 'id'>;

const CLASSES = ['Fighter', 'Wizard', 'Rogue', 'Cleric', 'Ranger', 'Paladin'];
const RACES = ['Human', 'Elf', 'Dwarf', 'Halfling', 'Gnome', 'Half-Orc', 'Half-Elf'];

export const CreateCharacter: React.FC = () => {
	const { createCharacter } = useGameStore();
	const toast = useToast();
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<CharacterFormData>({
		resolver: zodResolver(CharacterSchema.omit({ id: true })),
		defaultValues: {
			type: 'player',
			stats: {
				hp: 10,
				maxHp: 10,
				level: 1,
				strength: 10,
				dexterity: 10,
				constitution: 10,
				intelligence: 10,
				wisdom: 10,
				charisma: 10,
			},
		},
	});

	const onSubmit = (data: CharacterFormData) => {
		createCharacter(data);
		toast({
			title: 'Character Created',
			description: `${data.name} has been created successfully!`,
			status: 'success',
			duration: 3000,
		});
		reset();
	};

	return (
		<Box as="form" onSubmit={handleSubmit(onSubmit)} mt={8}>
			<VStack gap={4} align="stretch">
				<FormControl isRequired isInvalid={!!errors.name}>
					<FormLabel>Character Name</FormLabel>
					<Input {...register('name')} />
				</FormControl>

				<FormControl isRequired>
					<FormLabel>Race</FormLabel>
					<Select {...register('stats.race')}>
						{RACES.map((race) => (
							<option key={race} value={race}>
								{race}
							</option>
						))}
					</Select>
				</FormControl>

				<FormControl isRequired>
					<FormLabel>Class</FormLabel>
					<Select {...register('stats.class')}>
						{CLASSES.map((cls) => (
							<option key={cls} value={cls}>
								{cls}
							</option>
						))}
					</Select>
				</FormControl>

				<Button type="submit" colorScheme="blue">
					Create Character
				</Button>
			</VStack>
		</Box>
	);
};
