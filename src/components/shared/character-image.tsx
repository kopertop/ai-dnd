import React from 'react';
import { Image } from 'react-bootstrap';
import { Character } from '@/schemas/game';

interface CharacterImageProps {
	character: Character;
	size?: number;
	className?: string;
}

export const CharacterImage: React.FC<CharacterImageProps> = ({
	character,
	size = 48,
	className = '',
}) => {
	const imageUrl = character.imageUrl || `/characters/${character.race.toLowerCase()}/${character.class.toLowerCase()}.png`;

	return (
		<div
			className={`rounded-circle bg-secondary ${className}`}
			style={{
				width: `${size}px`,
				height: `${size}px`,
				flexShrink: 0,
				overflow: 'hidden',
			}}
		>
			<Image
				src={imageUrl}
				alt={character.name}
				width={size}
				height={size}
				onError={(e) => {
					const target = e.target as HTMLImageElement;
					target.src = `/characters/${character.race.toLowerCase()}/generic.png`;
					target.onerror = null;
				}}
				className="object-fit-cover w-100 h-100"
			/>
		</div>
	);
};
