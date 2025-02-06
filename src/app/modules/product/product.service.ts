// services/product.service.ts

import { Types } from "mongoose";
import { TProduct } from "./product.interface";
import Product from "./product.model";

const createProductIntoDb = async (productData: Partial<TProduct>) => {
	const newProduct = new Product(productData);
	await newProduct.save();
	return newProduct;
};

const getAllProductsFromDb = async () => {
	return await Product.find(); // Retrieve all products from the database
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
	getAllProductsFromDb,
	getProductById,
	updateProductIntoDb,
	deleteProductFromDb,
	getRelatedProducts
};
