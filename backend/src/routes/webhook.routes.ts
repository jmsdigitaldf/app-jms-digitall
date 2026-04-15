import { Router } from 'express';
import { webhookController } from '../controllers';

const router = Router();

/**
 * @route GET /api/webhooks/whatsapp
 * @desc WhatsApp webhook verification
 * @access Public (WhatsApp Cloud API)
 */
router.get('/whatsapp', webhookController.verify);

/**
 * @route POST /api/webhooks/whatsapp
 * @desc WhatsApp webhook message handler
 * @access Public (WhatsApp Cloud API)
 */
router.post('/whatsapp', webhookController.handleMessage);

export default router;
