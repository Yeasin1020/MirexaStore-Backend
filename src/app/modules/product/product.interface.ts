import { Document, Types } from 'mongoose';

export type TProduct = {
	name: string; // Product name
	description: string; // Product description
	price: number; // Product price
	stockQuantity: number; // Available stock quantity
	category: string; // Product category
	productImages: string[]; // Array of image URLs for the product
	reviews: Types.ObjectId[]; // Array of Review IDs (ObjectId references to the Review model)
} & Document; // Extend the Document interface to include Mongoose document properties
