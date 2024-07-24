import { pgTable, varchar, doublePrecision, text, integer, timestamp } from "drizzle-orm/pg-core";


export const billing = pgTable('t_billing', {
    t_billing_id: varchar('t_billing_id'),
    t_patient_id: varchar('t_patient_id'),
    t_visit_id: varchar('t_visit_id'),
    billing_billing_number: varchar('billing_billing_number'),
    billing_billing_date_time: varchar('billing_billing_date_time'),
    billing_financial_date: varchar('billing_financial_date'),
    billing_active: varchar('billing_active'),
    billing_patient_share: doublePrecision('billing_patient_share'),
    billing_payer_share: doublePrecision('billing_payer_share'),
    billing_total: doublePrecision('billing_total'),
    billing_paid: doublePrecision('billing_paid'),
    billing_remain: doublePrecision('billing_remain'),
    billing_deduct: doublePrecision('billing_deduct'),
    billing_payback: doublePrecision('billing_payback'),
    billing_staff_cancle: varchar('billing_staff_cancle'),
    billing_cancle_date_time: varchar('billing_cancle_date_time'),
    billing_staff_record: varchar('billing_staff_record'),
    special_discount: doublePrecision('special_discount'),
    special_discount_cause: text('special_discount_cause'),
    f_api_payment_status_id: integer('f_api_payment_status_id'),
    api_payment_transaction_datetime: timestamp('api_payment_transaction_datetime'),
    api_payment_note: text('api_payment_note'),
})

export type SelectBilling = typeof billing.$inferSelect
