import express from 'express';
import { CategoryController } from './category.controller';
import authenticate from '../../middlewares/authenticate';
import adminMiddleware from '../../middlewares/adminAuthorization';

const router = express.Router();

router.post('/', authenticate, adminMiddleware, CategoryController.createCategory);
router.get('/', CategoryController.getAllCategories);
router.get('/:slug', CategoryController.getCategoryBySlug);
router.delete('/:id', authenticate, adminMiddleware, CategoryController.deleteCategory);

export const CategoryRoutes = router;
