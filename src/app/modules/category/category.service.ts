import { TCategory } from './category.interface';
import Category from './category.model';

const createCategory = async (categoryData: TCategory) => {
	const category = new Category(categoryData);
	await category.save();
	return category;
};

const getAllCategories = async () => {
	return await Category.find().sort({ name: 1 }).lean();
};

const getCategoryBySlug = async (slug: string) => {
	return await Category.findOne({ slug }).lean();
};

const deleteCategory = async (id: string) => {
	return await Category.findByIdAndDelete(id);
};

export const CategoryService = {
	createCategory,
	getAllCategories,
	getCategoryBySlug,
	deleteCategory,
};
