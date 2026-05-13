import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("Seeding database...")

  // Create admin user
  const adminPassword = await bcrypt.hash("admin123", 12)
  const admin = await prisma.user.upsert({
    where: { email: "admin@treelivine.com" },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@treelivine.com",
      password: adminPassword,
      role: "ADMIN",
      department: "Management",
    },
  })

  // Create manager user
  const managerPassword = await bcrypt.hash("manager123", 12)
  const manager = await prisma.user.upsert({
    where: { email: "manager@treelivine.com" },
    update: {},
    create: {
      name: "Sarah Manager",
      email: "manager@treelivine.com",
      password: managerPassword,
      role: "MANAGER",
      department: "Operations",
    },
  })

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "software" },
      update: {},
      create: { name: "Software", slug: "software", description: "Software licenses and subscriptions" },
    }),
    prisma.category.upsert({
      where: { slug: "services" },
      update: {},
      create: { name: "Services", slug: "services", description: "Professional and support services" },
    }),
    prisma.category.upsert({
      where: { slug: "hardware" },
      update: {},
      create: { name: "Hardware", slug: "hardware", description: "Physical hardware products" },
    }),
  ])

  // Create supplier
  const supplier = await prisma.supplier.upsert({
    where: { email: "supply@techsupply.com" },
    update: {},
    create: {
      name: "TechSupply Co",
      email: "supply@techsupply.com",
      phone: "+1 (555) 100-2000",
      company: "TechSupply Corporation",
      city: "Austin",
      country: "USA",
    },
  })

  // Create products
  const products = await Promise.all([
    prisma.product.upsert({
      where: { sku: "ERP-001" },
      update: {},
      create: {
        name: "Premium ERP License",
        sku: "ERP-001",
        description: "Full enterprise ERP system license",
        price: 4999,
        costPrice: 1200,
        stock: 999,
        minStock: 1,
        unit: "license",
        status: "ACTIVE",
        categoryId: categories[0].id,
        supplierId: supplier.id,
      },
    }),
    prisma.product.upsert({
      where: { sku: "CSP-1TB" },
      update: {},
      create: {
        name: "Cloud Storage Pro (1TB)",
        sku: "CSP-1TB",
        description: "1TB cloud storage subscription",
        price: 299,
        costPrice: 45,
        stock: 500,
        minStock: 10,
        unit: "subscription",
        status: "ACTIVE",
        categoryId: categories[1].id,
        supplierId: supplier.id,
      },
    }),
    prisma.product.upsert({
      where: { sku: "SP-BASIC" },
      update: {},
      create: {
        name: "Support Package - Basic",
        sku: "SP-BASIC",
        description: "Basic support 24/7",
        price: 199,
        costPrice: 40,
        stock: 100,
        minStock: 5,
        unit: "subscription",
        status: "ACTIVE",
        categoryId: categories[1].id,
        supplierId: supplier.id,
      },
    }),
  ])

  // Create customers
  const customer = await prisma.customer.upsert({
    where: { email: "billing@acme.com" },
    update: {},
    create: {
      name: "Acme Corporation",
      email: "billing@acme.com",
      phone: "+1 (555) 100-2000",
      company: "Acme Corp",
      city: "New York",
      country: "USA",
      status: "ACTIVE",
    },
  })

  // Create an order
  const orderNumber = `TL-SEED-${Date.now().toString().slice(-5)}`
  const existing = await prisma.order.findFirst({ where: { orderNumber } })
  if (!existing) {
    await prisma.order.create({
      data: {
        orderNumber,
        customerId: customer.id,
        userId: admin.id,
        status: "DELIVERED",
        subtotal: 5298,
        tax: 423.84,
        discount: 0,
        total: 5721.84,
        paidAt: new Date(),
        items: {
          create: [
            { productId: products[0].id, quantity: 1, unitPrice: 4999, subtotal: 4999 },
            { productId: products[2].id, quantity: 1, unitPrice: 199, subtotal: 199 },
          ],
        },
      },
    })
  }

  // Create some transactions
  await prisma.transaction.createMany({
    data: [
      { type: "INCOME", amount: 5721.84, description: "Order payment received", category: "Sales", date: new Date() },
      { type: "EXPENSE", amount: 2500, description: "Monthly office rent", category: "Operations", date: new Date() },
      { type: "INCOME", amount: 1200, description: "Support contract renewal", category: "Services", date: new Date() },
    ],
    skipDuplicates: true,
  })

  console.log("Seed completed successfully!")
  console.log("Demo credentials:")
  console.log("  Admin: admin@treelivine.com / admin123")
  console.log("  Manager: manager@treelivine.com / manager123")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
