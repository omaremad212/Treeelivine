import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { connectDB } from './mongodb'
import User from '@/models/User'
import Setting from '@/models/Setting'
import { NextRequest } from 'next/server'

const JWT_SECRET = process.env.JWT_SECRET || 'treeelivine-secret-dev'
const COOKIE_NAME = 'treeelivine_session'

export function signToken(userId: string) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '24h' })
}

export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET) as { userId: string }
}

export function getPermissionsForRole(role: string, settings: any): string[] {
  const roleObj = (settings?.roles || []).find((r: any) => r.role === role)
  return roleObj?.permissions || []
}

export function getEffectivePermissions(user: any, settings: any): string[] {
  let perms = getPermissionsForRole(user.role, settings)
  const override = (settings?.userPermissionOverrides || []).find(
    (o: any) => o.userId?.toString() === user._id?.toString()
  )
  if (override) {
    const merged = perms.concat(override.permissions || [])
    perms = merged.filter((v: string, i: number, a: string[]) => a.indexOf(v) === i)
    perms = perms.filter(p => !(override.deniedPermissions || []).includes(p))
  }
  return perms
}

export async function getAuthUser(req?: NextRequest) {
  try {
    let token: string | undefined
    if (req) {
      token = req.cookies.get(COOKIE_NAME)?.value
    } else {
      const cookieStore = cookies()
      token = cookieStore.get(COOKIE_NAME)?.value
    }
    if (!token) return null

    const decoded = verifyToken(token)
    await connectDB()
    const user = await User.findById(decoded.userId) as any
    if (!user || !user.isActive) return null

    const settings = await Setting.findOne()
    user.effectivePermissions = getEffectivePermissions(user, settings)
    return user
  } catch {
    return null
  }
}

export function hasPermission(user: any, perm: string) {
  if (!user) return false
  if (user.role === 'admin') return true
  return (user.effectivePermissions || []).includes(perm)
}

export function unauthorizedResponse() {
  return Response.json({ success: false, message: 'Not authenticated' }, { status: 401 })
}

export function forbiddenResponse() {
  return Response.json({ success: false, message: 'Permission denied' }, { status: 403 })
}

export function cookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60,
    path: '/',
  }
}
