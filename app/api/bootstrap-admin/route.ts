import { NextRequest } from 'next/server'
import bcrypt from 'bcryptjs'
import { supabase } from '@/lib/supabase'

const TARGET_EMAIL = 'oemad8637@gmail.com'
const TARGET_PASS  = 'ehmoz24252541'
const TARGET_NAME  = 'Omar'

export async function POST(_req: NextRequest) {
  try {
    const hash = await bcrypt.hash(TARGET_PASS, 10)

    // Check if already exists
    const { data: existing } = await supabase
      .from('users')
      .select('id, role')
      .eq('email', TARGET_EMAIL)
      .single()

    if (existing) {
      // Update password + ensure admin role
      await supabase
        .from('users')
        .update({ password: hash, role: 'admin', is_active: true })
        .eq('id', existing.id)
      return Response.json({ success: true, message: 'Admin account updated', email: TARGET_EMAIL })
    }

    // Create new admin
    const { data: user, error } = await supabase
      .from('users')
      .insert({
        email:      TARGET_EMAIL,
        password:   hash,
        name:       TARGET_NAME,
        role:       'admin',
        is_active:  true,
        is_demo:    false,
      })
      .select()
      .single()

    if (error) return Response.json({ success: false, message: error.message }, { status: 500 })

    return Response.json({ success: true, message: 'Admin account created', email: user.email })
  } catch (e: any) {
    return Response.json({ success: false, message: e.message }, { status: 500 })
  }
}
