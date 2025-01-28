export type TProduct = {
	name: string; // Product name
	description: string; // Product description
	price: number; // Product price
	stockQuantity: number; // Available stock quantity
	category: string; // Product category
	productImages: string[]; // Array of image URLs for the product
} & Document;
