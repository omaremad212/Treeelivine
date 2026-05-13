import React from "react"
import { auth } from "@/lib/auth"
import { DashboardLayout } from "@/components/layout/DashboardLayout"

const DEMO_USER = {
  name:  "Demo Admin",
  email: "admin@treelivine.com",
  image: null,
  role:  "ADMIN",
  isDemo: true,
}

export default async function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  const user = session?.user
    ? {
        name:   session.user.name,
        email:  session.user.email,
        image:  session.user.image,
        role:   session.user.role,
        isDemo: false,
      }
    : DEMO_USER

  return (
    <div className="dark">
      <DashboardLayout user={user}>
        {children}
      </DashboardLayout>
    </div>
  )
}
