import { Request, Response } from 'express';
import { whatsappService } from '../services';
import { logger } from '../utils';
import type { WhatsAppMessage } from '../types';

export const webhookController = {
  /**
   * WhatsApp webhook verification (GET)
   */
  verify: async (req: Request, res: Response): Promise<void> => {
    try {
      const { 'hub.mode': mode, 'hub.verify_token': verifyToken, 'hub.challenge': challenge } = req.query;

      const response = whatsappService.verifyWebhook(
        mode as string,
        verifyToken as string,
        challenge as string
      );

      if (response) {
        res.status(200).send(response);
      } else {
        res.status(403).send('Forbidden');
      }
    } catch (error) {
      logger.error({ error }, 'Webhook verification error');
      res.status(500).send('Internal Server Error');
    }
  },

  /**
   * WhatsApp webhook message handler (POST)
   */
  handleMessage: async (req: Request, res: Response): Promise<void> => {
    try {
      const body = req.body as WhatsAppMessage;

      logger.info({ object: body.object }, 'WhatsApp webhook received');

      // Process message asynchronously (don't block response)
      whatsappService.processMessage(body).catch((error) => {
        logger.error({ error }, 'Error processing WhatsApp message');
      });

      // Respond immediately to WhatsApp
      res.status(200).send('EVENT_RECEIVED');
    } catch (error) {
      logger.error({ error }, 'Webhook message handling error');
      res.status(500).send('Internal Server Error');
    }
  },
};

export default webhookController;
