import { pgTable, timestamp,  varchar } from "drizzle-orm/pg-core";

export const authenCode = pgTable('t_nhso_authencode', {
    t_nhso_authencode_id: varchar('t_nhso_authencode_id').unique().primaryKey().default(`uuid_generate_v4()`),
    vn: varchar('vn'),
    hn: varchar('hn'),
    pid: varchar('pid'),
    mobile: varchar('mobile'),
    correlation_id: varchar('correlation_id'),
    claim_type: varchar('claim_type'),
    claim_code: varchar('claim_code'),
    created_date: varchar('created_date'),
    authen_from: varchar('authen_from'),
    record_date_time: timestamp('record_date_time'),
    user_record_id: varchar('user_record_id'),
    delete_date_time: timestamp('delete_date_time'),
    user_delete_id: varchar('user_delete_id'),
})