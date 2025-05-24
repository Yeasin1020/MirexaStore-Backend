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

const getProductsByCategory = catchAsync(async (req: Request, res: Response) => {
	const { category } = req.params;

	const products = await ProductService.getProductsByCategory(category);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Products retrieved successfully for this category',
		data: products,
	});
});


const getProductByCategorySlug = catchAsync(async (req: Request, res: Response) => {
	const { category, slug } = req.params;

	const product = await ProductService.getProductByCategorySlug(category, slug);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Product retrieved successfully',
		data: product,
	});
});


const getFilteredProducts = catchAsync(async (req: Request, res: Response) => {
	const { category, minPrice, maxPrice } = req.query;

	// Convert minPrice and maxPrice to numbers (if they are present)
	const minPriceNumber = minPrice ? parseFloat(minPrice as string) : undefined;
	const maxPriceNumber = maxPrice ? parseFloat(maxPrice as string) : undefined;

	const filteredProducts = await ProductService.getFilteredProducts(
		category as string,
		minPriceNumber,
		maxPriceNumber
	);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Filtered products retrieved successfully',
		data: filteredProducts,
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

const getAffiliateProducts = catchAsync(async (req: Request, res: Response) => {
	const products = await ProductService.getAffiliateProductsFromDb();
	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Affiliate products retrieved successfully',
		data: products,
	});
});


const getInactiveAndDraftProducts = catchAsync(
	async (req: Request, res: Response) => {
		const products = await ProductService.getInactiveAndDraftProductsFromDb();

		sendResponse(res, {
			statusCode: httpStatus.OK,
			success: true,
			message: 'Inactive and Draft products retrieved successfully',
			data: products,
		});
	}
);
// Get Product by Slug
const getProductBySlug = async (req: Request, res: Response) => {
	try {
		const { slug } = req.params;
		const product = await ProductService.getProductBySlug(slug);
		res.status(200).json({ data: product });
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (error: any) {
		res.status(404).json({ message: error.message });
	}
};

const getProductById = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;
	const product = await ProductService.getProductById(id);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Product retrieved successfully',
		data: product,
	});
});
// const getSearchSuggestions = async (req: Request, res: Response) => {
// 	try {
// 		const { query } = req.query;

// 		if (!query || typeof query !== "string" || query.trim().length === 0) {
// 			return res.status(400).json({ message: "Query parameter is required and should be a non-empty string." });
// 		}

// 		const suggestions = await ProductService.getSearchSuggestionsService(query);

// 		res.status(200).json(suggestions);
// 	} catch (error) {
// 		console.error(error); // This will help you debug if there's an issue
// 		res.status(500).json({ message: "Failed to get suggestions", error });
// 	}
// };

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

const getRelatedProducts = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params; // Get the product ID from request parameters
	const product = await ProductService.getProductById(id); // Fetch the product to get its category
	const relatedProducts = await ProductService.getRelatedProducts(product.category, id); // Get related products

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Related products retrieved successfully',
		data: relatedProducts,
	});
});

const updateProductStatus = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;
	const { status } = req.body;

	const validStatuses = ['active', 'inactive', 'draft'];
	if (!validStatuses.includes(status)) {
		return res.status(httpStatus.BAD_REQUEST).json({
			success: false,
			message: 'Invalid status value. Must be one of: active, inactive, draft.',
		});
	}

	const updatedProduct = await ProductService.updateProductStatus(id, status);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: `Product status updated to ${status}`,
		data: updatedProduct,
	});
});


export const ProductController = {
	createProduct,
	getProductBySlug,
	getProductsByCategory,
	getProductByCategorySlug,
	getFilteredProducts,
	getAllProducts,
	getAffiliateProducts,
	getInactiveAndDraftProducts,
	getProductById,
	updateProduct,
	deleteProduct,
	getRelatedProducts,
	updateProductStatus
};
