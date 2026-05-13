import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"

// Demo users for the system (works without database)
const DEMO_USERS = [
  {
    id: "user_admin_01",
    name: "Admin User",
    email: "admin@treelivine.com",
    password: "admin123",
    role: "ADMIN",
    avatar: null,
    department: "Management",
  },
  {
    id: "user_mgr_02",
    name: "Sarah Manager",
    email: "manager@treelivine.com",
    password: "manager123",
    role: "MANAGER",
    avatar: null,
    department: "Operations",
  },
]

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const email = credentials.email as string
        const password = credentials.password as string

        // Try demo users first (works without DB)
        const demoUser = DEMO_USERS.find(
          (u) => u.email.toLowerCase() === email.toLowerCase()
        )

        if (demoUser && demoUser.password === password) {
          return {
            id: demoUser.id,
            name: demoUser.name,
            email: demoUser.email,
            role: demoUser.role,
            department: demoUser.department,
          }
        }

        // Try database (if available) - only import prisma when needed
        try {
          const prismaModule = await import("./prisma")
          const prisma = prismaModule.default
          const user = await prisma.user.findUnique({
            where: { email: email.toLowerCase() },
          })

          if (!user || !user.isActive) return null

          const bcrypt = await import("bcryptjs")
          const isValidPassword = await bcrypt.compare(password, user.password)
          if (!isValidPassword) return null

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role as string,
            department: user.department || undefined,
          }
        } catch {
          // Database not available, demo mode only
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role
        token.department = (user as { department?: string }).department
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub as string
        session.user.role = token.role as string
        session.user.department = token.department as string
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET || "fallback-secret-for-development-only",
})

export type UserRole = "ADMIN" | "MANAGER" | "ACCOUNTANT" | "STAFF"

export function hasPermission(userRole: string, requiredRole: UserRole): boolean {
  const hierarchy: Record<UserRole, number> = {
    ADMIN: 4,
    MANAGER: 3,
    ACCOUNTANT: 2,
    STAFF: 1,
  }
  return (hierarchy[userRole as UserRole] || 0) >= hierarchy[requiredRole]
}
