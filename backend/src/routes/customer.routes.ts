import { Router } from 'express';
import { customerController } from '../controllers';
import { authMiddleware } from '../middlewares';
import { validate } from '../middlewares';
import { createCustomerSchema, updateCustomerSchema } from '../schemas';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

/**
 * @route GET /api/customers
 * @desc List customers with pagination
 * @access Private
 */
router.get('/', customerController.list);

/**
 * @route GET /api/customers/stats
 * @desc Get customer statistics
 * @access Private
 */
router.get('/stats', customerController.getStats);

/**
 * @route GET /api/customers/search
 * @desc Search customer by phone
 * @access Private
 */
router.get('/search', customerController.searchByPhone);

/**
 * @route GET /api/customers/:id
 * @desc Get customer by ID
 * @access Private
 */
router.get('/:id', customerController.getById);

/**
 * @route POST /api/customers
 * @desc Create new customer
 * @access Private
 */
router.post('/', validate(createCustomerSchema), customerController.create);

/**
 * @route PUT /api/customers/:id
 * @desc Update customer
 * @access Private
 */
router.put('/:id', validate(updateCustomerSchema), customerController.update);

/**
 * @route DELETE /api/customers/:id
 * @desc Delete customer (soft delete)
 * @access Private
 */
router.delete('/:id', customerController.delete);

export default router;
