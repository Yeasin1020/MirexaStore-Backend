import express from 'express';
import authenticate from '../../middlewares/authenticate';
import { ProductController } from './product.controller';
import sellerAdminMiddleware from '../../middlewares/sellerAdminAuthorization';
import adminMiddleware from '../../middlewares/adminAuthorization';

const router = express.Router();

router.post('/', authenticate, sellerAdminMiddleware, ProductController.createProduct);
router.get('/filter', ProductController.getFilteredProducts);
router.get('/', ProductController.getAllProducts);
router.get('/affiliate-products', authenticate, sellerAdminMiddleware, ProductController.getAffiliateProducts);
router.get('/inactive-draft', authenticate, sellerAdminMiddleware, ProductController.getInactiveAndDraftProducts);
router.get('/history/:id', ProductController.getProductById);
router.get('/details/:id', ProductController.getProductById);
router.get("/search-suggestions", ProductController.getSearchSuggestions);
router.get('/category/:category', ProductController.getProductsByCategory);
router.get('/:slug', ProductController.getProductBySlug);

router.get('/category/:category/:slug', ProductController.getProductByCategorySlug); // Category -> Slug URL structure

router.put('/:id', authenticate, ProductController.updateProduct);
router.patch('/status/:id', authenticate, adminMiddleware, ProductController.updateProductStatus);
router.delete('/:id', authenticate, ProductController.deleteProduct);
router.get('/:id/related', ProductController.getRelatedProducts);

export const ProductRoutes = router;
