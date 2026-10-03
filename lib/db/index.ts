import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema'

const globalForPg = globalThis as typeof globalThis & { pgPool?: Pool }

export const pool = globalForPg.pgPool ?? new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 5,
})

if (process.env.NODE_ENV !== 'production') globalForPg.pgPool = pool

export const db = drizzle(pool, { schema })
