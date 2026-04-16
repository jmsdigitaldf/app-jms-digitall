import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const defaultServices = [
  {
    name: 'Troca de Tela',
    category: 'Laptops',
    description: 'Substituição da tela queimada ou danificada',
    priceMin: 300,
    priceMax: 800,
    estimatedTime: '2-3 dias',
    isActive: true,
  },
  {
    name: 'Troca de Bateria',
    category: 'Laptops',
    description: 'Substituição de bateria por nova original',
    priceMin: 200,
    priceMax: 500,
    estimatedTime: '1-2 dias',
    isActive: true,
  },
  {
    name: 'Troca de Teclado',
    category: 'Laptops',
    description: 'Substituição de teclado danificado',
    priceMin: 150,
    priceMax: 400,
    estimatedTime: '1-2 dias',
    isActive: true,
  },
  {
    name: 'Upgrade SSD',
    category: 'Desktops',
    description: 'Instalação de SSD para melhor desempenho',
    priceMin: 250,
    priceMax: 800,
    estimatedTime: '1 dia',
    isActive: true,
  },
  {
    name: 'Upgrade RAM',
    category: 'Desktops',
    description: 'Instalação de memória RAM adicional',
    priceMin: 180,
    priceMax: 600,
    estimatedTime: '1 dia',
    isActive: true,
  },
  {
    name: 'Formatação Windows',
    category: 'Software',
    description: 'Formatação completa com instalação de Windows',
    priceMin: 100,
    priceMax: 150,
    estimatedTime: '1 dia',
    isActive: true,
  },
  {
    name: 'Remoção de Vírus',
    category: 'Software',
    description: 'Scan e remoção completa de vírus e malware',
    priceMin: 80,
    priceMax: 150,
    estimatedTime: '1-2 dias',
    isActive: true,
  },
  {
    name: 'Recuperação de Dados',
    category: 'Software',
    description: 'Recuperação de dados em disco ou mídia danificada',
    priceMin: 200,
    priceMax: 800,
    estimatedTime: '3-5 dias',
    isActive: true,
  },
  {
    name: 'Limpeza Preventiva',
    category: 'Manutenção',
    description: 'Limpeza interna e remoção de poeira',
    priceMin: 80,
    priceMax: 150,
    estimatedTime: '1 dia',
    isActive: true,
  },
  {
    name: 'Troca Pasta Térmica',
    category: 'Manutenção',
    description: 'Substituição de pasta térmica para melhor refrigeração',
    priceMin: 100,
    priceMax: 180,
    estimatedTime: '1 dia',
    isActive: true,
  },
];

async function main() {
  console.log('🌱 Iniciando seed de dados...');

  try {
    // Limpar serviços existentes
    const deletedServices = await prisma.service.deleteMany({});
    console.log(`Deletado ${deletedServices.count} serviços existentes`);

    // Inserir serviços padrão
    for (const service of defaultServices) {
      const created = await prisma.service.create({
        data: service,
      });
      console.log(`✅ Criado serviço: ${created.name}`);
    }

    console.log('✨ Seed concluído com sucesso!');
  } catch (error) {
    console.error('❌ Erro durante seed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
