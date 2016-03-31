import {Story} from './story';

export interface Sprint{
	id: number;
	product: string;
	startDate: date;
	endDate: date;
	stories: Story[];
}
