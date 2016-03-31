import {Product} from ./product

export interface User{
	id: number;
	name: string;
	surname: string;
	products: Product[];
}
