import { servicesPricing, problemToServiceMap } from '../config/constants';
import type { AIAnalysisResult, AIQuoteResult } from '../types';

/**
 * Serviço de IA para análise de mensagens e geração de orçamentos
 * 
 * Em produção, integrar com OpenAI API ou similar
 * Esta implementação usa regras baseadas em palavras-chave como fallback
 */

export const aiService = {
  /**
   * Analyze WhatsApp message to identify problem type
   */
  analyzeMessage: async (message: string): Promise<AIAnalysisResult> => {
    const lowerMessage = message.toLowerCase();

    // Keywords mapping for problem detection
    const problemKeywords: Record<string, string[]> = {
      screen: ['tela', 'display', 'quebrada', 'trinca', 'rachada', 'mancha', 'pixel', 'lcd', 'led'],
      battery: ['bateria', 'carregar', 'carregando', 'descarrega', 'viciada', 'energia', 'tomada'],
      keyboard: ['teclado', 'tecla', 'não digita', 'teclas', 'keyboard'],
      slow: ['lento', 'travando', 'demora', 'lentidão', 'pesado', 'engasgando'],
      virus: ['vírus', 'virus', 'malware', 'lento', 'pop-up', 'propaganda', 'infectado'],
      hardware: ['placa', 'hardware', 'queimou', 'fumaça', 'curto', 'não liga', 'morto'],
      software: ['software', 'programa', 'aplicativo', 'windows', 'sistema', 'atualizar'],
      format: ['formatar', 'formatação', 'instalar', 'windows', 'linux', 'sistema operacional'],
      power: ['não liga', 'ligar', 'power', 'energia', 'fonte', 'carregador'],
      cooling: ['quente', 'aquecendo', 'ventoinha', 'fan', 'cooling', 'superaquecendo'],
      network: ['wifi', 'internet', 'rede', 'conexão', 'wireless', 'bluetooth'],
      data: ['dados', 'recuperar', 'backup', 'arquivos', 'fotos', 'recuperação'],
    };

    // Device type detection
    let deviceType: AIAnalysisResult['deviceType'] = 'laptop';
    if (lowerMessage.includes('desktop') || lowerMessage.includes('pc') || lowerMessage.includes('computador de mesa')) {
      deviceType = 'desktop';
    } else if (lowerMessage.includes('all in one') || lowerMessage.includes('all-in-one')) {
      deviceType = 'all-in-one';
    } else if (lowerMessage.includes('tablet') || lowerMessage.includes('ipad')) {
      deviceType = 'tablet';
    }

    // Score each problem type
    const scores: Record<string, number> = {};
    
    for (const [problem, keywords] of Object.entries(problemKeywords)) {
      scores[problem] = 0;
      for (const keyword of keywords) {
        if (lowerMessage.includes(keyword)) {
          scores[problem] += 1;
        }
      }
    }

    // Find best match
    let bestMatch = 'other';
    let bestScore = 0;
    
    for (const [problem, score] of Object.entries(scores)) {
      if (score > bestScore) {
        bestScore = score;
        bestMatch = problem;
      }
    }

    // Calculate confidence based on score and message length
    const confidence = Math.min(
      0.5 + (bestScore * 0.15) + (message.length > 20 ? 0.1 : 0),
      0.95
    );

    // Get suggested services
    const suggestedServices = problemToServiceMap[bestMatch] || ['diagnostic'];

    return {
      problemType: bestMatch as AIAnalysisResult['problemType'],
      confidence: Math.round(confidence * 100) / 100,
      suggestedServices,
      deviceType,
    };
  },

  /**
   * Generate quote based on problem analysis
   */
  generateQuote: async (
    problemType: string,
    details?: string
  ): Promise<AIQuoteResult> => {
    const services: AIQuoteResult['services'] = [];
    
    // Map problem type to service key
    const serviceKeyMap: Record<string, string> = {
      screen: 'screen-laptop',
      battery: 'battery-laptop',
      keyboard: 'keyboard-laptop',
      slow: 'hd-ssd-upgrade',
      virus: 'virus-removal',
      hardware: 'diagnostic',
      software: 'software-install',
      format: 'format-windows',
      power: 'power-jack-laptop',
      cooling: 'cooling-system',
      network: 'wifi-adapter',
      data: 'data-recovery',
    };

    const serviceKey = serviceKeyMap[problemType] || 'diagnostic';
    const pricing = servicesPricing[serviceKey as keyof typeof servicesPricing];

    if (pricing) {
      // Calculate price based on complexity (mock logic)
      const basePrice = (pricing.min + pricing.max) / 2;
      const adjustedPrice = Math.round(basePrice * 100) / 100;

      services.push({
        name: this.getServiceName(serviceKey),
        description: this.getServiceDescription(serviceKey, details),
        price: adjustedPrice,
      });
    }

    // Add diagnostic fee if problem is complex
    if (problemType === 'hardware' || problemType === 'data') {
      const diagnosticPricing = servicesPricing.diagnostic;
      services.push({
        name: 'Diagnóstico Técnico',
        description: 'Análise completa do equipamento para identificação precisa do problema',
        price: diagnosticPricing.min,
      });
    }

    // Calculate total
    const totalEstimate = services.reduce((acc, service) => acc + service.price, 0);

    // Get estimated time from first service or default
    const estimatedTime = pricing?.time || '1-2 dias';

    return {
      services,
      totalEstimate: Math.round(totalEstimate * 100) / 100,
      estimatedTime,
    };
  },

  /**
   * Get human-readable service name
   */
  getServiceName: (serviceKey: string): string => {
    const names: Record<string, string> = {
      'screen-laptop': 'Reparo/Troca de Tela',
      'screen-desktop': 'Reparo/Troca de Monitor',
      'battery-laptop': 'Troca de Bateria',
      'keyboard-laptop': 'Reparo/Troca de Teclado',
      'power-jack-laptop': 'Reparo de Jack de Energia',
      'hd-ssd-upgrade': 'Upgrade para SSD',
      'ram-upgrade': 'Upgrade de Memória RAM',
      'format-windows': 'Formatação Windows',
      'format-linux': 'Formatação Linux',
      'virus-removal': 'Remoção de Vírus/Malware',
      'software-install': 'Instalação de Software',
      'data-recovery': 'Recuperação de Dados',
      'cleaning': 'Limpeza Preventiva',
      'thermal-paste': 'Troca de Pasta Térmica',
      'diagnostic': 'Diagnóstico Técnico',
      'motherboard-repair': 'Reparo de Placa-Mãe',
      'gpu-repair': 'Reparo de GPU/Vídeo',
      'cooling-system': 'Reparo do Sistema de Refrigeração',
      'wifi-adapter': 'Reparo/Instalação WiFi',
      'network-config': 'Configuração de Rede',
    };

    return names[serviceKey] || 'Serviço Técnico';
  },

  /**
   * Get service description
   */
  getServiceDescription: (serviceKey: string, details?: string): string => {
    const baseDescriptions: Record<string, string> = {
      'screen-laptop': 'Substituição da tela danificada por nova, incluindo mão de obra especializada',
      'battery-laptop': 'Troca da bateria por equivalente nova, com teste de autonomia',
      'keyboard-laptop': 'Substituição do teclado completo ou reparo das teclas defeituosas',
      'hd-ssd-upgrade': 'Instalação de SSD com migração de dados do HD antigo',
      'ram-upgrade': 'Instalação de memória RAM adicional com teste de estabilidade',
      'format-windows': 'Formatação completa com instalação do Windows e drivers atualizados',
      'virus-removal': 'Remoção completa de vírus e malware, com instalação de antivírus',
      'data-recovery': 'Tentativa de recuperação de dados de disco danificado',
      'diagnostic': 'Análise técnica completa para identificação do problema',
    };

    return baseDescriptions[serviceKey] || `Serviço técnico especializado para ${serviceKey.replace(/-/g, ' ')}`;
  },

  /**
   * Generate response message for WhatsApp
   */
  generateWhatsAppResponse: async (message: string): Promise<{
    analysis: AIAnalysisResult;
    quote: AIQuoteResult;
    responseText: string;
  }> => {
    // Analyze message
    const analysis = await this.analyzeMessage(message);
    
    // Generate quote
    const quote = await this.generateQuote(analysis.problemType, message);

    // Format response
    const servicesList = quote.services
      .map(s => `• ${s.name}: R$ ${s.price.toFixed(2)}`)
      .join('\n');

    const responseText = `✅ *Orçamento Prévio Gerado!*

Com base na sua descrição, aqui está nossa estimativa:

${servicesList}

💰 *Valor estimado:* R$ ${quote.totalEstimate.toFixed(2)}
⏱️ *Tempo estimado:* ${quote.estimatedTime}

⚠️ Este é um orçamento *prévio*. Após análise técnica completa, podemos ajustar o valor.

Deseja agendar uma visita técnica ou trazer o equipamento para análise?`;

    return {
      analysis,
      quote,
      responseText,
    };
  },
};

export default aiService;
