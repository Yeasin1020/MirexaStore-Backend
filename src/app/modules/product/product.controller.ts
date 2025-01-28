// controllers/product.controller.ts
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ProductService } from './product.service';

const createProduct = catchAsync(async (req: Request, res: Response) => {
	const newProduct = await ProductService.createProductIntoDb(req.body);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Product added successfully',
		data: newProduct,
	});
});

const getAllProducts = catchAsync(async (req: Request, res: Response) => {
	const products = await ProductService.getAllProductsFromDb();
	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Products retrieved successfully',
		data: products,
	});
});

const updateProduct = catchAsync(async (req: Request, res: Response) => {
	const productId = req.params.id;
	const updatedProductData = req.body;
	const updatedProduct = await ProductService.updateProductIntoDb(productId, updatedProductData);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Product updated successfully',
		data: updatedProduct,
	});
});

const deleteProduct = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;

	const product = await ProductService.deleteProductFromDb(id);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Product deleted successfully',
		data: product,
	});
});

export const ProductController = {
	createProduct,
	getAllProducts,
	updateProduct,
	deleteProduct,
};
