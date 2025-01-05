import { Provider } from './components/ui/provider';
import { GameMap } from './components/game-map';
import { ChatInterface } from './components/chat-interface';
import { Center, Grid } from '@chakra-ui/react';
import { CharacterSheet } from './components/character-sheet';

function App() {
	return (
		<Provider>
			<Center className="app-container" width="100vw" height="100vh">
				<Grid templateColumns="auto auto auto" gap={8} alignItems="start">
					<CharacterSheet />
					<GameMap />
					<ChatInterface />
				</Grid>
			</Center>
		</Provider>
	);
}

export default App;
