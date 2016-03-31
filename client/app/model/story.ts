import {Task} from './task';

export interface Story{
	id: number;
	title: string;
	tasks: Task[];
}
