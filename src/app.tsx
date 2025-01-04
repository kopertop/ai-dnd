import { Provider } from './components/ui/provider';
import { GameMap } from './components/game-map';
import { ChatInterface } from './components/chat-interface';
import { Center } from '@chakra-ui/react';

function App() {
	return (
		<Provider>
			<Center className="app-container" width="100vw" height="100vh">
				<GameMap />
				<ChatInterface />
			</Center>
		</Provider>
	);
}

export default App;
