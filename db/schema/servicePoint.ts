import {  pgTable, integer, varchar } from "drizzle-orm/pg-core";

export const servicePoint = pgTable('b_service_point', {
    b_service_point_id: varchar('b_service_point_id'),
    service_point_number: varchar('service_point_number'),
    service_point_description: varchar('service_point_description'),
    f_service_group_id: varchar('f_service_group_id'),
    f_service_subgroup_id: varchar('f_service_subgroup_id'),
    service_point_active: varchar('service_point_active'),
    service_point_color: varchar('service_point_color'),
    alert_send_opdcard: varchar('alert_send_opdcard'),
    is_ipd: varchar('is_ipd'),
    service_time_per_person: integer('service_time_per_person'),
    send_arrived_datetime: varchar('send_arrived_datetime'),
})