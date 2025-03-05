import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { CategoryService } from './category.service';

const createCategory = catchAsync(async (req: Request, res: Response) => {
	const category = await CategoryService.createCategory(req.body);

	sendResponse(res, {
		statusCode: httpStatus.CREATED,
		success: true,
		message: 'Category created successfully',
		data: category,
	});
});

const getAllCategories = catchAsync(async (_req: Request, res: Response) => {
	const categories = await CategoryService.getAllCategories();

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Categories retrieved successfully',
		data: categories,
	});
});

const getCategoryBySlug = catchAsync(async (req: Request, res: Response) => {
	const { slug } = req.params;
	const category = await CategoryService.getCategoryBySlug(slug);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Category retrieved successfully',
		data: category,
	});
});

const deleteCategory = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;
	const deletedCategory = await CategoryService.deleteCategory(id);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Category deleted successfully',
		data: deletedCategory,
	});
});

export const CategoryController = {
	createCategory,
	getAllCategories,
	getCategoryBySlug,
	deleteCategory,
};
