import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create Admin
  const adminPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@smartseason.com" },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@smartseason.com",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  // Create Agent
  const agentPassword = await bcrypt.hash("agent123", 10);
  const agent = await prisma.user.upsert({
    where: { email: "agent@smartseason.com" },
    update: {},
    create: {
      name: "John Kamau",
      email: "agent@smartseason.com",
      password: agentPassword,
      role: "AGENT",
    },
  });

  // Create Fields
  await prisma.field.upsert({
    where: { id: "field-001" },
    update: {},
    create: {
      id: "field-001",
      name: "North Maize Field",
      cropType: "Maize",
      plantingDate: new Date("2026-01-01"),
      expectedHarvestDate: new Date("2026-04-30"),
      stage: "GROWING",
      status: "AT_RISK",
      agentId: agent.id,
    },
  });

  await prisma.field.upsert({
    where: { id: "field-002" },
    update: {},
    create: {
      id: "field-002",
      name: "East Tea Field",
      cropType: "Tea",
      plantingDate: new Date("2026-01-15"),
      expectedHarvestDate: new Date("2028-12-31"),
      stage: "PLANTED",
      status: "ACTIVE",
      agentId: agent.id,
    },
  });

  console.log("Seeding complete!");
  console.log("Admin:", admin.email, "/ admin123");
  console.log(" Agent:", agent.email, "/ agent123");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());