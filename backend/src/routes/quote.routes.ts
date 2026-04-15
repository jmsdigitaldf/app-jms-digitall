import { Router } from 'express';
import { quoteController } from '../controllers';
import { authMiddleware } from '../middlewares';
import { validate } from '../middlewares';
import { createQuoteSchema, updateQuoteSchema } from '../schemas';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

/**
 * @route GET /api/quotes
 * @desc List quotes with filters
 * @access Private
 */
router.get('/', quoteController.list);

/**
 * @route GET /api/quotes/stats
 * @desc Get quote statistics
 * @access Private
 */
router.get('/stats', quoteController.getStats);

/**
 * @route GET /api/quotes/ticket/:ticketId
 * @desc Get quotes by ticket ID
 * @access Private
 */
router.get('/ticket/:ticketId', quoteController.getByTicketId);

/**
 * @route GET /api/quotes/:id
 * @desc Get quote by ID
 * @access Private
 */
router.get('/:id', quoteController.getById);

/**
 * @route POST /api/quotes
 * @desc Create new quote
 * @access Private
 */
router.post('/', validate(createQuoteSchema), quoteController.create);

/**
 * @route PUT /api/quotes/:id
 * @desc Update quote
 * @access Private
 */
router.put('/:id', validate(updateQuoteSchema), quoteController.update);

/**
 * @route POST /api/quotes/:id/approve
 * @desc Approve quote
 * @access Private
 */
router.post('/:id/approve', quoteController.approve);

/**
 * @route POST /api/quotes/:id/reject
 * @desc Reject quote
 * @access Private
 */
router.post('/:id/reject', quoteController.reject);

/**
 * @route POST /api/quotes/:id/send
 * @desc Send quote to customer via WhatsApp
 * @access Private
 */
router.post('/:id/send', quoteController.sendToCustomer);

/**
 * @route DELETE /api/quotes/:id
 * @desc Delete quote
 * @access Private
 */
router.delete('/:id', quoteController.delete);

export default router;
