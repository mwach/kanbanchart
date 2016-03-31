import {Sprint} from ./sprint;

export interface Product{
	id: number;
	code: string;
	name: string;
	description: string;
	sprints: Sprint[];
}
