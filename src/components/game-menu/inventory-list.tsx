import React from 'react';
import { Stack, Card, Badge } from 'react-bootstrap';
import { Campaign } from '@/schemas/campaign';
import { Item } from '@/schemas/item';

interface InventoryListProps {
	campaign?: Campaign;
}

export const InventoryList: React.FC<InventoryListProps> = ({ campaign }) => {
	if (!campaign) return null;

	if (!campaign.inventory?.length) {
		return (
			<Stack gap={2} className='text-center p-4'>
				<p className='text-muted mb-0'>No items found</p>
				<small className='text-muted'>
					Items collected during the campaign will appear here
				</small>
			</Stack>
		);
	}

	return (
		<Stack gap={3}>
			<h5>Campaign Inventory</h5>
			{campaign.inventory.map((item: Item) => (
				<Card key={item.id} className='shadow-sm'>
					<Card.Body>
						<Stack gap={2}>
							<div className='d-flex justify-content-between align-items-center'>
								<div>
									<h6 className='mb-0'>
										{item.name}
										{item.quantity > 1 && (
											<Badge bg='secondary' className='ms-2'>
												${item.quantity}
											</Badge>
										)}
									</h6>
									<small className='text-muted'>
										{item.type} {item.slot !== 'none' && `• ${item.slot}`}
									</small>
								</div>
							</div>
							<small className='text-muted'>{item.description}</small>
							{item.stats && (
								<div className='d-flex gap-2 flex-wrap'>
									{Object.entries(item.stats).map(([stat, value]) => (
										<Badge
											key={stat}
											bg='light'
											text='dark'
											className='text-capitalize'
										>
											{stat}: {value}
										</Badge>
									))}
								</div>
							)}
						</Stack>
					</Card.Body>
				</Card>
			))}
		</Stack>
	);
};
