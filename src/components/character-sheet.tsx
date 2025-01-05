import React, { useState, useEffect } from 'react';
import {
	Card,
	Stack,
	Form,
	Alert,
} from 'react-bootstrap';
import { Character } from '@/schemas/character';
import { useCharacterStore } from '@/stores/character-store';

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
	const { characters, updateCharacter } = useCharacterStore();
	const player = characters.find(c => c.type === 'player');
	const [showError, setShowError] = useState<string | null>(null);

	const [stats, setStats] = useState<Character['stats']>({
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
			setShowError(`You have ${remainingPoints} points remaining`);
			return;
		}

		if (newValue < MIN_STAT || newValue > MAX_STAT) {
			setShowError(`Stats must be between ${MIN_STAT} and ${MAX_STAT}`);
			return;
		}

		setShowError(null);
		const newStats: Character['stats'] = { ...stats, [attribute]: newValue };
		setStats(newStats);
		setRemainingPoints(prev => prev - pointDiff);

		if (player) {
			updateCharacter(player.id, { stats: newStats });
		}
	};

	const renderStat = (attribute: Attribute, label: string) => (
		<Form.Group className="mb-3">
			<Form.Label>{label}</Form.Label>
			<div className="d-flex align-items-center gap-3">
				<Form.Control
					type="number"
					value={stats[attribute]}
					onChange={(e) => handleStatChange(attribute, parseInt(e.target.value))}
					min={MIN_STAT}
					max={MAX_STAT}
					style={{ width: '80px' }}
				/>
				<span className="text-muted">
					Modifier: {formatModifier(getModifier(stats[attribute]))}
				</span>
			</div>
		</Form.Group>
	);

	return (
		<Card className="shadow-sm">
			<Card.Body>
				<Stack gap={3}>
					<div className="text-center">
						<h4 className="mb-2">Character Sheet</h4>
						<p className="text-muted mb-0">
							Points Remaining: {remainingPoints}
						</p>
					</div>

					{showError && (
						<Alert variant="danger" onClose={() => setShowError(null)} dismissible>
							{showError}
						</Alert>
					)}

					<Form>
						{renderStat('strength', 'Strength')}
						{renderStat('dexterity', 'Dexterity')}
						{renderStat('constitution', 'Constitution')}
						{renderStat('intelligence', 'Intelligence')}
						{renderStat('wisdom', 'Wisdom')}
						{renderStat('charisma', 'Charisma')}
					</Form>
				</Stack>
			</Card.Body>
		</Card>
	);
};
