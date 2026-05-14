import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { connectDB } from '@/lib/mongodb'
import { signToken, getEffectivePermissions, cookieOptions } from '@/lib/auth'
import User from '@/models/User'
import Setting from '@/models/Setting'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()
    if (!email || !password) return NextResponse.json({ success: false, message: 'Email and password required' }, { status: 400 })

    await connectDB()
    const userDoc = await User.findOne({ email: email.toLowerCase() })
    if (!userDoc || !userDoc.isActive) return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 })

    const valid = await bcrypt.compare(password, userDoc.password)
    if (!valid) return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 })

    const settings = await Setting.findOne()
    const user = userDoc.toObject()
    const effectivePermissions = getEffectivePermissions(user, settings)
    const token = signToken(user._id.toString())

    const { password: _, ...safeUser } = user
    const response = NextResponse.json({ success: true, user: { ...safeUser, effectivePermissions } })
    response.cookies.set('treeelivine_session', token, cookieOptions())
    return response
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 })
  }
}
