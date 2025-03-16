// services/product.service.ts

import { Types } from "mongoose";
import { TProduct } from "./product.interface";
import Product from "./product.model";

const createProductIntoDb = async (productData: Partial<TProduct>) => {
	const newProduct = new Product(productData);
	await newProduct.save();
	return newProduct;
};

const getProductsByCategory = async (category: string) => {
	const products = await Product.find({ category }).lean().exec();

	if (!products.length) {
		throw new Error("No products found for this category");
	}

	return products;
};


const getProductByCategorySlug = async (category: string, slug: string) => {
	const product = await Product.findOne({ category, slug }).lean().exec();

	if (!product) {
		throw new Error("Product not found");
	}

	return product;
};



const getFilteredProducts = async (category?: string, minPrice?: number, maxPrice?: number) => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const filter: { [key: string]: any } = {};

	if (category) {
		filter.category = category;
	}

	if (minPrice !== undefined || maxPrice !== undefined) {
		filter.price = {};
		if (minPrice !== undefined) {
			filter.price.$gte = minPrice;
		}
		if (maxPrice !== undefined) {
			filter.price.$lte = maxPrice;
		}
	}

	const products = await Product.find(filter);
	return products;
};


const getAllProductsFromDb = async () => {
	return await Product.find(); // Retrieve all products from the database
};

const getProductBySlug = async (slug: string) => {
	const product = await Product.findOne({ slug });
	if (!product) {
		throw new Error('Product not found');
	}
	return product;
};

const getProductById = async (id: string) => {
	if (!Types.ObjectId.isValid(id)) {
		throw new Error("Invalid product ID");
	}

	const product = await Product.findById(id).lean().exec();

	if (!product) {
		throw new Error("Product not found");
	}

	return product;
};
// const getSearchSuggestionsService = async (query: string) => {
// 	const regex = new RegExp(query, "i"); // Case-insensitive match

// 	const suggestions = await Product.find(
// 		{ name: regex }, // ধরে নিচ্ছি আপনার প্রোডাক্টের নাম `name`
// 		"name" // শুধু নাম return করবো suggestion হিসেবে
// 	)
// 		.limit(10)
// 		.lean();

// 	return suggestions;
// };

const updateProductIntoDb = async (id: string, updateData: Partial<TProduct>) => {
	const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true }).lean().exec();
	if (!updatedProduct) {
		throw new Error("Product not found");
	}
	return updatedProduct;
};

const deleteProductFromDb = async (id: string) => {
	if (!Types.ObjectId.isValid(id)) {
		throw new Error("Invalid product ID");
	}

	const product = await Product.findByIdAndDelete(id);

	if (!product) {
		throw new Error("Product not found");
	}
	return product;
};


const getRelatedProducts = async (category: string, excludeId: string) => {
	const relatedProducts = await Product.find({
		category: category,
		_id: { $ne: excludeId }, // Exclude the current product
	}).limit(5); // Limit the number of related products to 5 (or any desired number)

	return relatedProducts;
};

export const ProductService = {
	createProductIntoDb,
	getProductBySlug,
	getProductsByCategory,
	getProductByCategorySlug,
	getFilteredProducts,
	getAllProductsFromDb,
	getProductById,
	updateProductIntoDb,
	deleteProductFromDb,
	getRelatedProducts
};
