import { Provider } from './components/ui/provider';
import { GameMap } from './components/game-map';
import { ChatInterface } from './components/chat-interface';

function App() {
	return (
		<Provider>
			<div className="app-container">
				<GameMap />
				<ChatInterface />
			</div>
		</Provider>
	);
}

export default App;
