import { Router } from 'express';
import {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    patchProduct,
    deleteProduct,
} from '../controllers/product.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { mongoIdValidation, createProductValidation, updateProductValidation } from '../utils/validation';

const router = Router();

router.get('/', getAllProducts);
router.get('/:id', mongoIdValidation, getProductById);
router.post('/', authenticate, createProductValidation, createProduct);
router.put('/:id', authenticate, mongoIdValidation, updateProductValidation, updateProduct);
router.patch('/:id', authenticate, mongoIdValidation, updateProductValidation, patchProduct);
router.delete('/:id', authenticate, mongoIdValidation, deleteProduct);

export default router;
