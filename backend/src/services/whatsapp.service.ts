import axios from 'axios';
import config from '../config';
import { aiService } from './ai.service';
import { customerRepository, ticketRepository, quoteRepository } from '../repositories';
import type { WhatsAppMessage } from '../types';
import { logger } from '../utils';

export const whatsappService = {
  /**
   * Verify webhook token (for WhatsApp Cloud API setup)
   */
  verifyWebhook: (
    mode?: string,
    verifyToken?: string,
    challenge?: string
  ): string | null => {
    if (
      mode === 'subscribe' &&
      verifyToken === config.whatsapp.verifyToken
    ) {
      return challenge || null;
    }
    return null;
  },

  /**
   * Process incoming WhatsApp message
   */
  processMessage: async (data: WhatsAppMessage): Promise<void> => {
    try {
      const entry = data.entry[0];
      if (!entry?.changes?.[0]?.value?.messages) {
        return;
      }

      const messages = entry.changes[0].value.messages;

      for (const message of messages) {
        // Only process text messages
        if (message.type !== 'text' || !message.text) {
          continue;
        }

        const from = message.from;
        const text = message.text.body;
        const msgId = message.id;

        logger.info({ from, text, msgId }, 'Processing WhatsApp message');

        // Find or create customer
        const customer = await customerRepository.findOrCreate(from, {
          phone: from,
          name: `Cliente WhatsApp (${from})`,
        });

        // Analyze message with AI
        const aiResponse = await aiService.generateWhatsAppResponse(text);

        // Create ticket
        const ticket = await ticketRepository.create({
          customerId: customer.id,
          whatsappMessage: text,
          whatsappMsgId: msgId,
          problemType: aiResponse.analysis.problemType.toUpperCase(),
          problemDetails: text,
          deviceType: aiResponse.analysis.deviceType?.toUpperCase() || 'LAPTOP',
          aiResponse: aiResponse.responseText,
        });

        // Create quote
        for (const service of aiResponse.quote.services) {
          await quoteRepository.create({
            ticketId: ticket.id,
            service: service.name,
            description: service.description,
            price: service.price,
          });
        }

        // Send response via WhatsApp
        await this.sendMessage(from, aiResponse.responseText);

        logger.info({ ticketId: ticket.id }, 'Ticket created from WhatsApp');
      }
    } catch (error) {
      logger.error({ error }, 'Error processing WhatsApp message');
      throw error;
    }
  },

  /**
   * Send message via WhatsApp Cloud API
   */
  sendMessage: async (to: string, text: string): Promise<boolean> => {
    try {
      const url = `https://graph.facebook.com/v18.0/${config.whatsapp.phoneId}/messages`;
      
      const response = await axios.post(
        url,
        {
          messaging_product: 'whatsapp',
          to,
          type: 'text',
          text: { body: text },
        },
        {
          headers: {
            'Authorization': `Bearer ${config.whatsapp.token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.status === 200;
    } catch (error) {
      logger.error({ error, to }, 'Error sending WhatsApp message');
      return false;
    }
  },

  /**
   * Send template message (for notifications)
   */
  sendTemplate: async (
    to: string,
    templateName: string,
    language: string,
    components?: Array<{
      type: string;
      parameters: Array<{
        type: string;
        text?: string;
      }>;
    }>
  ): Promise<boolean> => {
    try {
      const url = `https://graph.facebook.com/v18.0/${config.whatsapp.phoneId}/messages`;
      
      const response = await axios.post(
        url,
        {
          messaging_product: 'whatsapp',
          to,
          type: 'template',
          template: {
            name: templateName,
            language: { code: language },
            components,
          },
        },
        {
          headers: {
            'Authorization': `Bearer ${config.whatsapp.token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.status === 200;
    } catch (error) {
      logger.error({ error, to }, 'Error sending WhatsApp template');
      return false;
    }
  },

  /**
   * Send ticket update notification
   */
  sendTicketUpdate: async (
    phone: string,
    protocol: string,
    status: string,
    message?: string
  ): Promise<boolean> => {
    const statusLabels: Record<string, string> = {
      PENDING: 'Aguardando análise',
      QUOTED: 'Orçamento enviado',
      APPROVED: 'Aprovado',
      REJECTED: 'Rejeitado',
      IN_PROGRESS: 'Em andamento',
      WAITING_PART: 'Aguardando peça',
      COMPLETED: 'Concluído',
      CANCELLED: 'Cancelado',
    };

    const text = `📋 *Atualização do Atendimento*

Protocolo: *${protocol}*
Status: *${statusLabels[status] || status}*

${message || 'Acompanhe pelo seu painel do cliente.'}

Dúvidas? Responda esta mensagem!`;

    return this.sendMessage(phone, text);
  },

  /**
   * Send quote approval request
   */
  sendQuoteRequest: async (
    phone: string,
    protocol: string,
    total: number,
    estimatedTime: string
  ): Promise<boolean> => {
    const text = `💰 *Orçamento Disponível*

Protocolo: *${protocol}*

Valor total: *R$ ${total.toFixed(2)}*
Tempo estimado: *${estimatedTime}*

Para *APROVAR*, responda: APROVAR ${protocol}
Para *REJEITAR*, responda: REJEITAR ${protocol}

Ou entre em contato para mais informações!`;

    return this.sendMessage(phone, text);
  },
};

export default whatsappService;
