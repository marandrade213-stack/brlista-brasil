import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { serviceSubmissions } from '@/lib/db/schema'

const allowedCategories = new Set([
  'Borracharia',
  'Mecânica',
  'Auto Elétrica',
  'Mecânica Pesada',
  'Guincho / Socorro',
  'Lavador de Carreta',
])

function getText(value: unknown) {
  return typeof value === 'string' ? value.trim() : ''
}

export async function POST(request: Request) {
  const origin = request.headers.get('origin')
  if (origin) {
    try {
      const requestUrl = new URL(request.url)
      const requestHost = (request.headers.get('x-forwarded-host') ?? request.headers.get('host') ?? requestUrl.host).split(',')[0].trim()
      const requestProtocol = (request.headers.get('x-forwarded-proto') ?? requestUrl.protocol.replace(':', '')).split(',')[0].trim()
      const originUrl = new URL(origin)

      if (originUrl.host.toLowerCase() !== requestHost.toLowerCase() || originUrl.protocol !== `${requestProtocol}:`) {
        return NextResponse.json({ error: 'Não foi possível enviar este cadastro.' }, { status: 403 })
      }
    } catch {
      return NextResponse.json({ error: 'Não foi possível enviar este cadastro.' }, { status: 403 })
    }
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Envie os dados do serviço em formato válido.' }, { status: 400 })
  }

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return NextResponse.json({ error: 'Confira os dados e tente novamente.' }, { status: 400 })
  }

  const values = body as Record<string, unknown>
  if (getText(values.website)) {
    return NextResponse.json({ success: true }, { status: 202 })
  }

  const name = getText(values.name)
  const category = getText(values.category)
  const city = getText(values.city)
  const address = getText(values.address)
  const phone = getText(values.phone)
  const phoneDigits = phone.replace(/\D/g, '')

  if (
    name.length < 2 || name.length > 120 ||
    !allowedCategories.has(category) ||
    city.length < 2 || city.length > 100 ||
    address.length < 3 || address.length > 240 ||
    phone.length > 32 || phoneDigits.length < 10 || phoneDigits.length > 13
  ) {
    return NextResponse.json({ error: 'Confira os campos e o telefone informado.' }, { status: 400 })
  }

  try {
    await db.insert(serviceSubmissions).values({ name, category, city, address, phone })
    return NextResponse.json({ success: true }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Não foi possível salvar agora. Tente novamente em instantes.' }, { status: 503 })
  }
}
