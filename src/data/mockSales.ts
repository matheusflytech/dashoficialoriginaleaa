import { Sale } from "@/types/sale";

const products = [
  { code: "EAA-001", name: "Curso Completo de Automação", description: "Automação completa com n8n" },
  { code: "EAA-002", name: "Mentoria Premium", description: "Mentoria individual 1:1" },
  { code: "EAA-003", name: "Pack Templates n8n", description: "50+ templates prontos" },
  { code: "EAA-004", name: "Curso APIs Avançadas", description: "Integrações avançadas" },
  { code: "EAA-005", name: "Comunidade VIP", description: "Acesso comunidade exclusiva" },
];

const sources = ["google", "instagram", "facebook", "youtube", "organic", "email", "tiktok"];
const sckCodes = ["utm_001", "utm_002", "utm_003", "utm_004", "utm_005", "direct", "ref_partner"];

const firstNames = ["João", "Maria", "Pedro", "Ana", "Carlos", "Fernanda", "Lucas", "Julia", "Gabriel", "Beatriz", "Rafael", "Camila", "Thiago", "Larissa", "Bruno", "Amanda"];
const lastNames = ["Silva", "Santos", "Oliveira", "Souza", "Rodrigues", "Ferreira", "Almeida", "Costa", "Gomes", "Martins", "Pereira", "Lima", "Araújo", "Barbosa"];

function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function generateSales(count: number): Sale[] {
  const sales: Sale[] = [];
  const endDate = new Date();
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 6);

  for (let i = 0; i < count; i++) {
    const orderDate = randomDate(startDate, endDate);
    const approvedDate = new Date(orderDate.getTime() + Math.random() * 3600000 * 24);
    const receivedAt = new Date(approvedDate.getTime() + Math.random() * 3600000);
    const product = products[Math.floor(Math.random() * products.length)];
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];

    const values = [97, 197, 297, 497, 997, 1497, 1997];
    const value = values[Math.floor(Math.random() * values.length)];

    sales.push({
      transaction: `TXN${String(100000 + i).padStart(8, '0')}`,
      order_date: orderDate.toISOString(),
      approved_date: approvedDate.toISOString(),
      offer_code: product.code,
      offer_description: product.description,
      product_name: product.name,
      buyer_name: `${firstName} ${lastName}`,
      buyer_email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`,
      value,
      currency: "BRL",
      src: sources[Math.floor(Math.random() * sources.length)],
      sck: sckCodes[Math.floor(Math.random() * sckCodes.length)],
      received_at: receivedAt.toISOString(),
    });
  }

  return sales.sort((a, b) => new Date(b.order_date).getTime() - new Date(a.order_date).getTime());
}

export const mockSales = generateSales(250);
