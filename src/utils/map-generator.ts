import { GameMap, MapTile } from '../schemas/game';

type Point = { x: number; y: number };
const MAX_CAVES = 4;
const MIN_CAVES = 1;
let caveCount = 0;
let hasExit = false;

const generateTile = (type: MapTile['type'], description?: string): MapTile => ({
	type,
	walkable: type !== 'wall' && type !== 'water' && type !== 'exit' && type !== 'mountain',
	description: description || `A ${type} tile`,
});

const isAdjacentToPath = (tiles: MapTile[][], point: Point): boolean => {
	const { x, y } = point;
	const adjacentPoints = [
		{ x: x - 1, y },
		{ x: x + 1, y },
		{ x, y: y - 1 },
		{ x, y: y + 1 },
	];

	return adjacentPoints.some(p =>
		p.x >= 0 && p.x < tiles[0].length &&
		p.y >= 0 && p.y < tiles.length &&
		tiles[p.y][p.x].type === 'path'
	);
};

const placeCave = (tiles: MapTile[][], point: Point): void => {
	if (caveCount < MAX_CAVES && isAdjacentToPath(tiles, point)) {
		tiles[point.y][point.x] = generateTile('cave', 'A dark cave entrance');
		caveCount++;
	}
};

const placeExit = (tiles: MapTile[][], point: Point): void => {
	// Always try to place a cave if we haven't met the minimum
	if (caveCount < MIN_CAVES) {
		placeCave(tiles, point);
	// 50% chance for cave if we're between min and max
	} else if (caveCount < MAX_CAVES && Math.random() < 0.5) {
		placeCave(tiles, point);
	} else {
		tiles[point.y][point.x] = generateTile('exit', 'The way forward');
		hasExit = true;
	}
};

const getRandomEdgePoint = (width: number, height: number, edge: 'left' | 'right'): Point => {
	if (edge === 'left') {
		return {
			x: 0,
			y: Math.floor(Math.random() * (height - 4) + 2),
		};
	}
	return {
		x: width - 1,
		y: Math.floor(Math.random() * (height - 4) + 2),
	};
};

const generateControlPoints = (start: Point, end: Point, height: number): Point[] => {
	const midX = Math.floor((start.x + end.x) / 2);
	const direction = Math.random() < 0.5 ? -1 : 1; // Random up or down curve
	const curveHeight = Math.floor(height / 3); // Curve magnitude

	return [
		start,
		{ x: midX, y: Math.max(2, Math.min(height - 3, Math.floor(height / 2) + direction * curveHeight)) },
		end
	];
};

const createPath = (start: Point, end: Point, tiles: MapTile[][], isFork = false): void => {
	let current = { ...start };
	const points = isFork ? [start, end] : generateControlPoints(start, end, tiles.length);

	// Place entry point at start if it's the main path
	if (!isFork) {
		tiles[start.y][start.x] = generateTile('entry', 'The entrance');
	}

	// Create path through control points
	for (let i = 0; i < points.length - 1; i++) {
		current = { ...points[i] };
		const target = points[i + 1];

		while (current.x !== target.x || current.y !== target.y) {
			tiles[current.y][current.x] = generateTile('path', 'A well-worn path');

			// Decide whether to move horizontally or vertically
			if (Math.abs(target.x - current.x) > Math.abs(target.y - current.y)) {
				current.x += Math.sign(target.x - current.x);
			} else {
				current.y += Math.sign(target.y - current.y);
			}
		}
	}

	// Set the endpoint
	if (isFork) {
		placeCave(tiles, end);
	} else if (end.x === tiles[0].length - 2) {
		placeExit(tiles, end);
	} else {
		tiles[end.y][end.x] = generateTile('path', 'A well-worn path');
	}
};

const addRandomFork = (tiles: MapTile[][], width: number, height: number): void => {
	if (Math.random() < 0.4) { // 40% chance of fork
		const pathTiles: Point[] = [];

		// Find existing path tiles
		tiles.forEach((row, y) => {
			row.forEach((tile, x) => {
				if (tile.type === 'path') {
					pathTiles.push({ x, y });
				}
			});
		});

		if (pathTiles.length > 0) {
			const start = pathTiles[Math.floor(Math.random() * pathTiles.length)];
			const end = {
				x: Math.floor(width * (Math.random() < 0.5 ? 0.25 : 0.75)),
				y: Math.floor(height * (Math.random() < 0.5 ? 0.25 : 0.75)),
			};

			createPath(start, end, tiles, true);
		}
	}
};

export const generateMap = (width = 32, height = 32): GameMap => {
	caveCount = 0;
	hasExit = false;
	// Initialize tiles with walls, but leave edges open
	const tiles: MapTile[][] = Array(height)
		.fill(null)
		.map((_, y) => Array(width).fill(null).map((_, x) => {
			// Only create walls for non-edge tiles
			if (y === 0 || y === height - 1 || x === 0 || x === width - 1) {
				return generateTile('wall', 'Edge of the map');
			}
			return generateTile('wall');
		}));

	// Create main path with random start and end points
	const mainPathPoints = [
		getRandomEdgePoint(width, height, 'left'),
		getRandomEdgePoint(width, height, 'right'),
	];
	console.log('Main Path Points', mainPathPoints);

	// Place entry and exit points first
	tiles[mainPathPoints[0].y][mainPathPoints[0].x] = generateTile('entry', 'The entrance');
	tiles[mainPathPoints[1].y][mainPathPoints[1].x] = generateTile('exit', 'The way forward');

	// Create main path
	createPath(mainPathPoints[0], mainPathPoints[1], tiles);

	// Add random fork
	addRandomFork(tiles, width, height);

	// Add surrounding grass and features
	for (let y = 1; y < height - 1; y++) {
		for (let x = 1; x < width - 1; x++) {
			if (tiles[y][x].type === 'wall') {
				const random = Math.random();
				if (random < 0.15) { // Reduced mountain probability
					tiles[y][x] = generateTile('mountain', 'Impassible mountain peak');
				} else if (random < 0.25) { // Reduced water probability
					tiles[y][x] = generateTile('water', 'A small pond');
				} else {
					tiles[y][x] = generateTile('grass', 'Grassy terrain');
				}
			}
		}
	}

	// Add some walls around the edges, but not at entry/exit points
	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			if ((y === 0 || y === height - 1 || x === 0 || x === width - 1)) {
				if (y === mainPathPoints[0].y && x === mainPathPoints[0].x) {
					console.log('Entry', {
						x, y,
						tile: tiles[y][x],
					});
					tiles[y][x] = generateTile('entry', 'The entrance');
				} else if (y === mainPathPoints[1].y && x === mainPathPoints[1].x) {
					console.log('Exit', {
						x, y,
						tile: tiles[y][x],
					});
					tiles[y][x] = generateTile('exit', 'The way forward');
				} else if (tiles[y][x].type === 'exit') {
					console.log('Exit', {
						x, y,
						tile: tiles[y][x],
					});
				} else {
					tiles[y][x] = generateTile('wall', 'Border wall');
				}
			}
		}
	}

	// Ensure minimum number of caves
	if (caveCount < MIN_CAVES) {
		// Find all path tiles
		const pathTiles: Point[] = [];
		tiles.forEach((row, y) => {
			row.forEach((tile, x) => {
				if (tile.type === 'path') {
					pathTiles.push({ x, y });
				}
			});
		});

		// Try to place caves until we meet the minimum
		while (caveCount < MIN_CAVES && pathTiles.length > 0) {
			const index = Math.floor(Math.random() * pathTiles.length);
			const point = pathTiles[index];
			placeCave(tiles, point);
			pathTiles.splice(index, 1);
		}
	}

	return {
		id: Date.now().toString(),
		tiles,
		width,
		height,
		name: 'Generated Dungeon',
	};
};
