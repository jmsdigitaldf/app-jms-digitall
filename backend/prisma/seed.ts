import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const BCRYPT_ROUNDS = 12;

async function main() {
  console.log('🌱 Starting database seed...');

  // Hash password
  const hashedPassword = await bcrypt.hash('Admin@123', BCRYPT_ROUNDS);

  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@jmsdigital.com' },
    update: {},
    create: {
      name: 'Administrador',
      email: 'admin@jmsdigital.com',
      password: hashedPassword,
      role: 'ADMIN',
      isActive: true,
      emailVerified: true,
    },
  });

  console.log('✅ Admin user created:', admin.email);

  // Create technician user
  const technician = await prisma.user.upsert({
    where: { email: 'tecnico@jmsdigital.com' },
    update: {},
    create: {
      name: 'João Técnico',
      email: 'tecnico@jmsdigital.com',
      password: hashedPassword,
      role: 'TECHNICIAN',
      isActive: true,
      emailVerified: true,
    },
  });

  console.log('✅ Technician user created:', technician.email);

  // Create sample customers
  const customers = await Promise.all([
    prisma.customer.upsert({
      where: { phone: '11999999999' },
      update: {},
      create: {
        name: 'Maria Silva',
        phone: '11999999999',
        email: 'maria.silva@email.com',
        document: '123.456.789-00',
        address: 'Rua das Flores, 123',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01234-567',
      },
    }),
    prisma.customer.upsert({
      where: { phone: '11988888888' },
      update: {},
      create: {
        name: 'Pedro Santos',
        phone: '11988888888',
        email: 'pedro.santos@email.com',
        address: 'Av. Paulista, 1000',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01310-100',
      },
    }),
    prisma.customer.upsert({
      where: { phone: '21977777777' },
      update: {},
      create: {
        name: 'Ana Costa',
        phone: '21977777777',
        email: 'ana.costa@email.com',
        city: 'Rio de Janeiro',
        state: 'RJ',
      },
    }),
  ]);

  console.log('✅ Sample customers created:', customers.length);

  // Create sample services
  const services = await prisma.service.createMany({
    data: [
      {
        name: 'Troca de Tela Laptop',
        description: 'Substituição de tela para laptops',
        category: 'HARDWARE',
        basePrice: 550,
        minPrice: 300,
        maxPrice: 800,
        estimatedTime: '2-3 dias',
      },
      {
        name: 'Troca de Bateria',
        description: 'Substituição de bateria para laptops',
        category: 'HARDWARE',
        basePrice: 350,
        minPrice: 200,
        maxPrice: 500,
        estimatedTime: '1-2 dias',
      },
      {
        name: 'Upgrade SSD',
        description: 'Instalação de SSD com migração de dados',
        category: 'UPGRADE',
        basePrice: 525,
        minPrice: 250,
        maxPrice: 800,
        estimatedTime: '1 dia',
      },
      {
        name: 'Formatação Windows',
        description: 'Formatação completa com instalação do Windows',
        category: 'SOFTWARE',
        basePrice: 125,
        minPrice: 100,
        maxPrice: 150,
        estimatedTime: '1 dia',
      },
      {
        name: 'Limpeza Preventiva',
        description: 'Limpeza completa e troca de pasta térmica',
        category: 'MAINTENANCE',
        basePrice: 115,
        minPrice: 80,
        maxPrice: 150,
        estimatedTime: '1 dia',
      },
    ],
  });

  console.log('✅ Sample services created');

  // Create sample ticket
  const ticket = await prisma.ticket.create({
    data: {
      protocol: '0124-0001',
      customerId: customers[0].id,
      whatsappMessage: 'Meu notebook está com a tela quebrada, preciso de um orçamento',
      problemType: 'SCREEN',
      problemDetails: 'Notebook Dell Inspiron 15, tela trincada',
      deviceType: 'LAPTOP',
      deviceBrand: 'Dell',
      deviceModel: 'Inspiron 15',
      status: 'PENDING',
      priority: 'MEDIUM',
      assignedToId: technician.id,
    },
  });

  console.log('✅ Sample ticket created:', ticket.protocol);

  // Create quote for the ticket
  const quote = await prisma.quote.create({
    data: {
      ticketId: ticket.id,
      service: 'Troca de Tela Laptop',
      description: 'Substituição da tela danificada por nova, incluindo mão de obra especializada',
      price: 550,
      status: 'PENDING',
      createdById: technician.id,
    },
  });

  console.log('✅ Sample quote created');

  console.log('\n🎉 Database seeded successfully!');
  console.log('\n📝 Login credentials:');
  console.log('   Admin: admin@jmsdigital.com / Admin@123');
  console.log('   Technician: tecnico@jmsdigital.com / Admin@123');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
