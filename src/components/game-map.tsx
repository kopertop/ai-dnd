import React, { useEffect, useRef } from 'react';
import { Box } from '@chakra-ui/react';
import { useGameStore } from '../stores/gameStore';
import { MapTile } from '../schemas/game';

const TILE_SIZE = 32;

export const GameMap: React.FC = () => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const { gameMap, characters } = useGameStore();

	const drawTile = (
		ctx: CanvasRenderingContext2D,
		tile: MapTile,
		x: number,
		y: number
	) => {
		ctx.fillStyle = tile.type === 'wall' ? '#666'
			: tile.type === 'floor' ? '#fff'
				: tile.type === 'water' ? '#44f'
					: '#964B00';
		ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
	};

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		// Clear canvas
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		// Draw map
		gameMap.tiles.forEach((row, y) => {
			row.forEach((tile, x) => {
				drawTile(ctx, tile, x, y);
			});
		});

		// Draw characters
		characters.forEach((char) => {
			ctx.fillStyle = char.type === 'player' ? '#f00' : '#0f0';
			ctx.beginPath();
			ctx.arc(
				char.position.x * TILE_SIZE + TILE_SIZE / 2,
				char.position.y * TILE_SIZE + TILE_SIZE / 2,
				TILE_SIZE / 3,
				0,
				Math.PI * 2
			);
			ctx.fill();
		});
	}, [gameMap, characters]);

	return (
		<Box border="1px solid" borderColor="gray.200" borderRadius="md" p={2}>
			<canvas
				ref={canvasRef}
				width={gameMap.width * TILE_SIZE}
				height={gameMap.height * TILE_SIZE}
				style={{ background: '#000' }}
			/>
		</Box>
	);
};
