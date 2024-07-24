import { pgTable, varchar, integer, timestamp, text } from "drizzle-orm/pg-core";

export const govoffical = pgTable('t_visit_govoffical_plan', {
    t_visit_govoffical_plan_id: varchar('t_visit_govoffical_plan_id'),
    t_visit_payment_id: varchar('t_visit_payment_id'),
    govoffical_type: integer('govoffical_type'),
    govoffical_number: varchar('govoffical_number'),
    f_govcode_id: varchar('f_govcode_id'),
    ownrpid: varchar('ownrpid'),
    ownname: varchar('ownname'),
    f_subinscl_id: varchar('f_subinscl_id'),
    f_relinscl_id: varchar('f_relinscl_id'),
    record_datetime: timestamp('record_datetime'),
    user_record_id: varchar('user_record_id'),
    update_datetime: timestamp('update_datetime'),
    user_update_id: varchar('user_update_id'),
    approve_status: varchar('approve_status'),
    active: varchar('active'),
    f_govoffical_plan_transaction_code_id: varchar('f_govoffical_plan_transaction_code_id'),
    response_message: text('response_message'),
    invoice_number: text('invoice_number'),
    terminal_id: text('terminal_id'),
    merchant_id: text('merchant_id'),
    response_date: text('response_date'),
    response_time: text('response_time'),
})

export type InsertGovoffical = typeof govoffical.$inferInsert;

