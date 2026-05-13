import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { userSchema } from "@/lib/validations"
import bcrypt from "bcryptjs"

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { default: prisma } = await import("@/lib/prisma")
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        department: true,
        isActive: true,
        lastLogin: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json({ success: true, data: users })
  } catch {
    return NextResponse.json({ success: true, data: [] })
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const schema = userSchema.extend({
    password: userSchema.shape.password ?? undefined,
  })
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", details: parsed.error.format() }, { status: 400 })
  }

  const { password, ...userData } = parsed.data

  try {
    const { default: prisma } = await import("@/lib/prisma")
    const exists = await prisma.user.findUnique({ where: { email: userData.email } })
    if (exists) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 })
    }

    const hashed = await bcrypt.hash(password || "defaultpassword", 12)
    const user = await prisma.user.create({
      data: {
        ...userData,
        password: hashed,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    })
    return NextResponse.json({ success: true, data: user }, { status: 201 })
  } catch {
    // Mock registration
    const mock = {
      id: String(Date.now()),
      name: userData.name,
      email: userData.email,
      role: userData.role,
      createdAt: new Date().toISOString(),
    }
    return NextResponse.json({ success: true, data: mock }, { status: 201 })
  }
}
