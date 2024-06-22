import { pgTable, varchar } from "drizzle-orm/pg-core";

export const visitService = pgTable('t_visit_service', {
    t_visit_service_id: varchar('t_visit_service_id'),
    t_visit_id: varchar('t_visit_id'),
    t_patient_id: varchar('t_patient_id'),
    assign_date_time: varchar('assign_date_time'),
    visit_service_staff_doctor: varchar('visit_service_staff_doctor'),
    f_visit_service_status_id: varchar('f_visit_service_status_id'),
    b_service_point_id: varchar('b_service_point_id'),
    visit_service_treatment_date_time: varchar('visit_service_treatment_date_time'),
    visit_service_finish_date_time: varchar('visit_service_finish_date_time'),
    b_visit_ward_id: varchar('b_visit_ward_id'),
    sender_id: varchar('sender_id'),
})