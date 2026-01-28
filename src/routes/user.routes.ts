import { Router } from 'express';
import { getAllUsers, getUserById, updateUser, patchUser, deleteUser } from '../controllers/user.controller';
import { authenticate, adminOnly } from '../middlewares/auth.middleware';
import { mongoIdValidation, updateUserValidation } from '../utils/validation';

const router = Router();

router.use(authenticate);

router.get('/', adminOnly, getAllUsers);
router.get('/:id', mongoIdValidation, getUserById);
router.put('/:id', mongoIdValidation, updateUserValidation, updateUser);
router.patch('/:id', mongoIdValidation, updateUserValidation, patchUser);
router.delete('/:id', mongoIdValidation, adminOnly, deleteUser);

export default router;
