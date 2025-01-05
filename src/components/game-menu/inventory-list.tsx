import React, { useState } from 'react';
import {
	Stack,
	Card,
	Badge,
	Collapse,
} from 'react-bootstrap';
import { Campaign } from '@/schemas/campaign';
import { Item } from '@/schemas/item';
import { LuChevronDown, LuChevronUp } from 'react-icons/lu';

interface InventoryListProps {
	campaign?: Campaign;
}

export const InventoryList: React.FC<InventoryListProps> = ({ campaign }) => {
	const [isOpen, setIsOpen] = useState(true);

	if (!campaign) return null;

	if (!campaign.inventory?.length) {
		return (
			<Card className='shadow-sm p-0'>
				<Card.Header
					className='bg-dark text-white p-0'
					role='button'
					onClick={() => setIsOpen(!isOpen)}
				>
					<div className='d-flex justify-content-between align-items-center p-3'>
						<h5 className='mb-0'>Campaign Inventory</h5>
						{isOpen ? <LuChevronUp /> : <LuChevronDown />}
					</div>
				</Card.Header>
				<Collapse in={isOpen}>
					<div>
						<Stack gap={2} className='text-center p-3'>
							<p className='text-muted mb-0'>No items found</p>
							<small className='text-muted'>
								Items collected during the campaign will appear here
							</small>
						</Stack>
					</div>
				</Collapse>
			</Card>
		);
	}

	return (
		<Card className='shadow-sm p-0'>
			<Card.Header
				className='bg-dark text-white p-0'
				role='button'
				onClick={() => setIsOpen(!isOpen)}
			>
				<div className='d-flex justify-content-between align-items-center p-3'>
					<h5 className='mb-0'>Campaign Inventory</h5>
					{isOpen ? <LuChevronUp /> : <LuChevronDown />}
				</div>
			</Card.Header>
			<Collapse in={isOpen}>
				<div>
					<Card.Body className='p-0'>
						<div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
							<Stack>
								{campaign.inventory.map((item: Item) => (
									<div key={item.id} className='border-bottom p-2'>
										<div className='d-flex justify-content-between align-items-start'>
											<div>
												<div className='d-flex align-items-center gap-2'>
													<span className='fw-medium'>{item.name}</span>
													{item.quantity > 1 && (
														<Badge bg='secondary' pill>
															×{item.quantity}
														</Badge>
													)}
												</div>
												<small className='text-muted d-block'>
													{item.description}
												</small>
												{item.stats && (
													<div className='d-flex gap-1 flex-wrap mt-1'>
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
											</div>
											<small className='text-muted text-capitalize'>
												{item.type}
											</small>
										</div>
									</div>
								))}
							</Stack>
						</div>
					</Card.Body>
				</div>
			</Collapse>
		</Card>
	);
};
