import { Container } from 'react-bootstrap';
import { OpeningMenu } from './components/game-menu/opening-menu';
import { GameInterface } from './components/game-interface';
import { useGameStore } from './stores/game-store';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
	const { currentCampaign } = useGameStore();
	const isGameActive = currentCampaign !== null;

	return (
		<Container fluid className="vh-100 d-flex align-items-center justify-content-center bg-light">
			{isGameActive ? <GameInterface /> : <OpeningMenu />}
		</Container>
	);
}

export default App;
