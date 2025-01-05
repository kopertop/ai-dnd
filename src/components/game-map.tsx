import React, { useEffect, useRef, useState } from 'react';
import {
	Card,
	Stack,
} from 'react-bootstrap';
import { useGameStore } from '@/stores/game-store';
import { MapTile } from '@/schemas/game';

const TILE_SIZE = 32;
const tileImages: Record<MapTile['type'], HTMLImageElement> = {
	mountain: new Image(),
	wall: new Image(),
	water: new Image(),
	cave: new Image(),
	entry: new Image(),
	exit: new Image(),
	path: new Image(),
	grass: new Image(),
};

export const GameMap: React.FC = () => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const { gameMap, characters } = useGameStore();
	const [imagesLoaded, setImagesLoaded] = useState(false);

	// Initialize and load images
	useEffect(() => {
		const loadImages = () => {
			const tileTypes: MapTile['type'][] = Object.keys(tileImages) as MapTile['type'][];

			return Promise.all(
				tileTypes.map((type) => {
					return new Promise<void>((resolve, reject) => {
						const img = tileImages[type];
						img.onload = () => {
							tileImages[type] = img;
							resolve();
						};
						img.onerror = () => {
							console.error(`Error loading image for ${type}`);
							reject(new Error(`Error loading image for ${type}`));
						};
						if (type === 'wall') {
							img.src = `/tiles/${type}.png`;
						} else {
							img.src = `/tiles/${type}.svg`;
						}
					});
				})
			);
		};

		console.log('Loading images');
		loadImages().then(() => {
			console.log('Images loaded');
			setImagesLoaded(true);
		});
	}, []);

	const drawTile = (
		ctx: CanvasRenderingContext2D,
		tile: MapTile,
		x: number,
		y: number
	) => {
		const img = tileImages[tile.type];
		if (img.complete) {
			ctx.drawImage(img, x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
		} else {
			// Fallback colors while images load
			ctx.fillStyle = tile.type === 'wall' ? '#666'
				: tile.type === 'mountain' ? '#8B4513'
				: tile.type === 'water' ? '#44f'
				: tile.type === 'grass' ? '#90EE90'
				: '#964B00';
			ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
		}

		// Add path indicator
		if (tile.description?.includes('well-worn path')) {
			ctx.globalAlpha = 0.5;
			ctx.fillStyle = '#D2B48C';
			ctx.fillRect(
				x * TILE_SIZE + TILE_SIZE * 0.2,
				y * TILE_SIZE + TILE_SIZE * 0.2,
				TILE_SIZE * 0.6,
				TILE_SIZE * 0.6
			);
			ctx.globalAlpha = 1;
		}
	};

	useEffect(() => {
		if (!imagesLoaded) return;
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
	}, [gameMap, characters, imagesLoaded]);

	return (
		<Card className="shadow-sm">
			<Card.Body>
				<Stack gap={3}>
					<canvas
						ref={canvasRef}
						width={gameMap.width * TILE_SIZE}
						height={gameMap.height * TILE_SIZE}
						className="bg-dark"
					/>
				</Stack>
			</Card.Body>
		</Card>
	);
};
