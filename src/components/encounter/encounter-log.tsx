import React from 'react';
import { Stack } from 'react-bootstrap';
import { useEncounterStore } from '@/stores/encounter-store';

export const EncounterLog: React.FC = () => {
	const { activeEncounter } = useEncounterStore();

	if (!activeEncounter) return null;

	return (
		<Stack gap={2}>
			<h6>Combat Log</h6>
			<div className='encounter-log' style={{ maxHeight: '200px', overflowY: 'auto' }}>
				{activeEncounter.log.map((entry, i) => (
					<div key={i} className='small mb-1'>
						<span className='text-muted'>Turn {entry.turn}:</span>{' '}
						{entry.message}
					</div>
				))}
			</div>
		</Stack>
	);
};
