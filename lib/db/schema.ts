import { pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'

export const serviceSubmissions = pgTable('service_submissions', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 120 }).notNull(),
  category: varchar('category', { length: 80 }).notNull(),
  city: varchar('city', { length: 100 }).notNull(),
  address: varchar('address', { length: 240 }).notNull(),
  phone: varchar('phone', { length: 32 }).notNull(),
  status: text('status').notNull().default('pending'),
  submittedAt: timestamp('submitted_at', { withTimezone: true }).notNull().defaultNow(),
})
