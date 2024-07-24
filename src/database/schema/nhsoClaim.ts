import { isNotNull } from "drizzle-orm"
import { boolean, integer, pgEnum, pgTable, timestamp, varchar, } from "drizzle-orm/pg-core"

const nhsoClaimStatusTyeps = pgEnum('status', ['new', 'claimed', 'cancel', 'canceled'])

export const nhsoClaim = pgTable('t_nhso_claim', {
    t_nhso_claim_id: varchar('t_nhso_claim_id'),
    hn: varchar('hn'),
    vn: varchar('vn'),
    pid: varchar('pid'),
    visit_date_time: varchar('visit_date_time').notNull(),
    t_billing_id: varchar('t_billing_id'),
    billing_date_time: timestamp('billing_date_time').notNull(),
    transaction_id: varchar('transaction_id'),
    total_amount: integer('total_amount').notNull(),
    paid_amount: integer('paid_amount').notNull(),
    privilege_amount: integer('privilege_amount').notNull(),
    status: nhsoClaimStatusTyeps('status'),
    main_inscl_code: varchar('main_inscl_code'),
    claim_service_code: varchar('claim_service_code').notNull(),
    seq: integer('seq'),
    authen_code: varchar('authen_code').notNull(),
    record_date_time: timestamp('record_date_time'),
    claim_date_time: timestamp('claim_date_time'),
    user_claim_id: varchar('user_claim_id'),
    user_claim_pid: varchar('user_claim_pid'),
    cancel_date_time: timestamp('cancel_date_time'),
    user_cancel_id: varchar('user_cancel_id'),
    cancel_reason: varchar('cancel_reason'),
    no_smc_reason: varchar('no_smc_reason'),
    is_billing_deleted: boolean('is_billing_deleted'),
})

export type SelectNhsoClaim = typeof nhsoClaim.$inferSelect
export type InsertNhsoClaim = typeof nhsoClaim.$inferInsert