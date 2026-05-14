export function toApi(row: any): any {
  if (!row) return null
  if (Array.isArray(row)) return row.map(toApi)
  const out: any = {}
  for (const [k, v] of Object.entries(row)) {
    const camel = k.replace(/_([a-z])/g, (_, c) => c.toUpperCase())
    out[camel] = v
  }
  // MongoDB compat: expose _id alias
  if (out.id) out._id = out.id
  return out
}

export function toDb(obj: any): any {
  if (!obj) return null
  const out: any = {}
  for (const [k, v] of Object.entries(obj)) {
    if (k === '_id') continue
    const snake = k.replace(/([A-Z])/g, '_$1').toLowerCase()
    out[snake] = v
  }
  return out
}
