import { Router } from 'express';
import { ticketController } from '../controllers';
import { authMiddleware } from '../middlewares';
import { validate } from '../middlewares';
import { createTicketSchema, updateTicketSchema } from '../schemas';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

/**
 * @route GET /api/tickets
 * @desc List tickets with filters and pagination
 * @access Private
 */
router.get('/', ticketController.list);

/**
 * @route GET /api/tickets/stats
 * @desc Get ticket statistics
 * @access Private
 */
router.get('/stats', ticketController.getStats);

/**
 * @route GET /api/tickets/protocol/:protocol
 * @desc Get ticket by protocol number
 * @access Private
 */
router.get('/protocol/:protocol', ticketController.getByProtocol);

/**
 * @route GET /api/tickets/:id
 * @desc Get ticket by ID
 * @access Private
 */
router.get('/:id', ticketController.getById);

/**
 * @route GET /api/tickets/:id/history
 * @desc Get ticket status history
 * @access Private
 */
router.get('/:id/history', ticketController.getStatusHistory);

/**
 * @route POST /api/tickets
 * @desc Create new ticket
 * @access Private
 */
router.post('/', validate(createTicketSchema), ticketController.create);

/**
 * @route PUT /api/tickets/:id
 * @desc Update ticket
 * @access Private
 */
router.put('/:id', validate(updateTicketSchema), ticketController.update);

/**
 * @route PATCH /api/tickets/:id/status
 * @desc Update ticket status
 * @access Private
 */
router.patch('/:id/status', ticketController.updateStatus);

/**
 * @route PATCH /api/tickets/:id/assign
 * @desc Assign ticket to technician
 * @access Private
 */
router.patch('/:id/assign', ticketController.assign);

/**
 * @route DELETE /api/tickets/:id
 * @desc Delete ticket (soft delete)
 * @access Private
 */
router.delete('/:id', ticketController.delete);

export default router;
