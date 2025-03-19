import express from 'express';
import authenticate from '../../middlewares/authenticate';
import adminMiddleware from '../../middlewares/adminAuthorization';
import { ProductController } from './product.controller';

const router = express.Router();

router.post('/', authenticate, adminMiddleware, ProductController.createProduct);
router.get('/filter', ProductController.getFilteredProducts);
router.get('/', ProductController.getAllProducts);
router.get('/history/:id', ProductController.getProductById);
router.get('/details/:id', ProductController.getProductById);
router.get('/category/:category', ProductController.getProductsByCategory);
router.get('/:slug', ProductController.getProductBySlug);

router.get('/category/:category/:slug', ProductController.getProductByCategorySlug); // Category -> Slug URL structure
// router.get("/search-suggestions", ProductController.getSearchSuggestions);
router.put('/:id', authenticate, ProductController.updateProduct);
router.patch('/status/:id', authenticate, ProductController.updateProductStatus);
router.delete('/:id', authenticate, ProductController.deleteProduct);
router.get('/:id/related', ProductController.getRelatedProducts);

export const ProductRoutes = router;
