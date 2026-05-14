import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { connectDB } from '@/lib/mongodb'
import User from '@/models/User'
import Customer from '@/models/Customer'

export async function POST(req: NextRequest) {
  try {
    const { name, phone, email, password } = await req.json()
    if (!name || !email || !password) return NextResponse.json({ success: false, message: 'Name, email and password required' }, { status: 400 })

    await connectDB()
    const exists = await User.findOne({ email: email.toLowerCase() })
    if (exists) return NextResponse.json({ success: false, message: 'Email already registered' }, { status: 409 })

    const hashed = await bcrypt.hash(password, 10)
    const customer = await Customer.create({ name, phone, email, status: 'active' })
    const user = await User.create({ email: email.toLowerCase(), password: hashed, role: 'client', isActive: true, referenceId: customer._id, roleRef: 'Customer' })
    customer.user = user._id
    await customer.save()

    return NextResponse.json({ success: true, message: 'Registered successfully' }, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 })
  }
}
