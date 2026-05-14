import { cookies } from 'next/headers'

export async function POST() {
  const cookieStore = cookies()
  cookieStore.delete('treeelivine_session')
  return Response.json({ success: true })
}
