// ============================================
// TABELA DE PREÇOS BASE DE SERVIÇOS
// ============================================

export const servicesPricing = {
  // Laptops
  'screen-laptop': { min: 300, max: 800, time: '2-3 dias' },
  'battery-laptop': { min: 200, max: 500, time: '1-2 dias' },
  'keyboard-laptop': { min: 150, max: 400, time: '1-2 dias' },
  'power-jack-laptop': { min: 150, max: 350, time: '1-2 dias' },
  
  // Desktops
  'screen-desktop': { min: 400, max: 1200, time: '2-4 dias' },
  'hd-ssd-upgrade': { min: 250, max: 800, time: '1 dia' },
  'ram-upgrade': { min: 180, max: 600, time: '1 dia' },
  
  // Software
  'format-windows': { min: 100, max: 150, time: '1 dia' },
  'format-linux': { min: 80, max: 120, time: '1 dia' },
  'virus-removal': { min: 80, max: 150, time: '1-2 dias' },
  'software-install': { min: 50, max: 100, time: '2-4 horas' },
  'data-recovery': { min: 200, max: 800, time: '3-5 dias' },
  
  // Manutenção
  'cleaning': { min: 80, max: 150, time: '1 dia' },
  'thermal-paste': { min: 100, max: 180, time: '1 dia' },
  'diagnostic': { min: 50, max: 100, time: '2-4 horas' },
  
  // Hardware
  'motherboard-repair': { min: 300, max: 800, time: '3-5 dias' },
  'gpu-repair': { min: 250, max: 600, time: '2-4 dias' },
  'cooling-system': { min: 150, max: 400, time: '1-2 dias' },
  
  // Rede
  'wifi-adapter': { min: 80, max: 200, time: '1 dia' },
  'network-config': { min: 100, max: 200, time: '2-4 horas' },
} as const;

export type ServicePricing = typeof servicesPricing[keyof typeof servicesPricing];

// ============================================
// MAPEAMENTO DE PROBLEMAS PARA SERVIÇOS
// ============================================

export const problemToServiceMap: Record<string, string[]> = {
  screen: ['screen-laptop', 'screen-desktop'],
  battery: ['battery-laptop'],
  keyboard: ['keyboard-laptop'],
  slow: ['hd-ssd-upgrade', 'ram-upgrade', 'cleaning'],
  virus: ['virus-removal', 'format-windows'],
  format: ['format-windows', 'format-linux'],
  software: ['software-install', 'format-windows'],
  hardware: ['diagnostic', 'motherboard-repair'],
  power: ['power-jack-laptop', 'battery-laptop'],
  cooling: ['cooling-system', 'thermal-paste', 'cleaning'],
  network: ['wifi-adapter', 'network-config'],
  data: ['data-recovery'],
};

// ============================================
// MENSAGENS PADRÃO
// ============================================

export const defaultMessages = {
  greeting: `Olá! 👋 Bem-vindo à JMS Digital!

Sou o assistente virtual e vou te ajudar com seu equipamento.

Por favor, me conte:
• Qual é o problema?
• Qual é a marca e modelo do aparelho?

Vou analisar e gerar um orçamento prévio para você! 😊`,

  analysisInProgress: '🔍 Analisando seu problema... Aguarde um momento!',
  
  quoteGenerated: `✅ **Orçamento Prévio Gerado!**

Com base na sua descrição, aqui está nossa estimativa:

{services}

💰 *Valor estimado:* R$ {total}
⏱️ *Tempo estimado:* {time}

⚠️ Este é um orçamento *prévio*. Após análise técnica completa, podemos ajustar o valor.

Deseja agendar uma visita técnica ou trazer o equipamento para análise?`,

  appointmentOptions: `Ótimo! 🎉

Você pode:
1️⃣ Trazer o equipamento na nossa loja
2️⃣ Agendar visita técnica (taxa adicional)

Qual opção prefere?`,

  ticketCreated: `✅ **Atendimento Criado!**

Protocolo: *{protocol}*

Em breve um de nossos técnicos entrará em contato para confirmar os detalhes.

Obrigado por escolher a JMS Digital! 🚀`,
};

// ============================================
// VALIDAÇÕES
// ============================================

export const validationRules = {
  phone: {
    min: 10,
    max: 11,
    regex: /^\d{10,11}$/,
  },
  document: {
    cpf: /^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/,
    cnpj: /^\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2}$/,
  },
  password: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumber: true,
    requireSpecial: false,
  },
};

// ============================================
// LIMITES E PAGINAÇÃO
// ============================================

export const paginationDefaults = {
  defaultPage: 1,
  defaultLimit: 10,
  maxLimit: 100,
};

export const uploadLimits = {
  maxFileSize: 5 * 1024 * 1024, // 5MB
  allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
};
