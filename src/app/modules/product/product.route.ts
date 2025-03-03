import express from 'express';
import authenticate from '../../middlewares/authenticate';
import adminMiddleware from '../../middlewares/adminAuthorization';
import { ProductController } from './product.controller';

const router = express.Router();

router.post('/', authenticate, adminMiddleware, ProductController.createProduct);
router.get('/', ProductController.getAllProducts);
router.get('/:id', ProductController.getProductById);
// router.get("/search-suggestions", ProductController.getSearchSuggestions);
router.put('/:id', authenticate, ProductController.updateProduct);
router.delete('/:id', authenticate, ProductController.deleteProduct);
router.get('/:id/related', ProductController.getRelatedProducts);

export const ProductRoutes = router;
