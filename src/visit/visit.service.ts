import { patient } from "../schema/patient";
import { servicePoint } from "../schema/servicePoint";
import { visit } from "../schema/visit";
import { visitService } from "../schema/visitService";
import DataBases from "../database/database";
import { and, eq, isNull, not, or, sql } from "drizzle-orm";
import type { VisitModel } from "./visit.entity";
import { authenCode } from "../schema/authen";

class VisitService {
    private hosptial = new DataBases().db

    getvisit = async () => {
        const getDate = new Date().toLocaleDateString('ce-CE', {
            year: "numeric", month: '2-digit', day: "2-digit", timeZone: 'Asia/Bangkok'
        }).split('-')
        const newDate = (+getDate[0] + 543) + '-' + getDate[1] + '-' + getDate[2]

        const getPerson = await this.hosptial.select(
            {
                visit_vn: visit.visit_vn,
                patient_pid: patient.patient_pid,
                package: sql<number>`${34}`,
                date_visit: sql<string>`text_to_timestamp(substr(t_visit.visit_begin_visit_time,1,10))::date::text`,
                time_visit: sql<string>`substr(t_visit.visit_begin_visit_time,12,10)`,
                phone: sql<string>`case when regexp_replace( t_patient.patient_phone_number, '[^0-9]*', '', 'g' )::text = '' 
						            then 
								        case when regexp_replace( t_patient.patient_patient_mobile_phone , '[^0-9]*', '', 'g' )::text = ''
								            then '032688558'
								             else regexp_replace( t_patient.patient_patient_mobile_phone , '[^0-9]*', '', 'g' )::text END
						            else regexp_replace( t_patient.patient_phone_number, '[^0-9]*', '', 'g' )::text 
						            end`,
                visit_hn: visit.visit_hn,
                t_nhso_authencode: authenCode.claim_code
            }
        )
            .from(visit)
            .innerJoin(patient, eq(visit.visit_hn, patient.patient_hn))
            .leftJoin(visitService, eq(visit.t_visit_id, visitService.t_visit_id))
            .innerJoin(servicePoint, eq(visitService.b_service_point_id, servicePoint.b_service_point_id))
            .leftJoin(authenCode, eq(authenCode.vn, visit.visit_vn))
            .where(
                and(
                    eq(visit.f_visit_type_id, '0'),
                    eq(patient.f_patient_nation_id, '99'),
                    not(eq(visit.f_visit_status_id, '4')),
                    sql`substr(${visit.visit_begin_visit_time},1,10) = ${newDate}`,
                    or(
                        isNull(authenCode.claim_code),
                        eq(authenCode.claim_code, '')
                    )
                )
            )
            .groupBy(
                visit.visit_vn,
                patient.patient_pid,
                sql<number>`${34}`,
                sql<string>`text_to_timestamp(substr(t_visit.visit_begin_visit_time,1,10))::date::text`,
                sql<string>`substr(t_visit.visit_begin_visit_time,12,10)`,
                sql<string>`case when regexp_replace( t_patient.patient_phone_number, '[^0-9]*', '', 'g' )::text = '' 
						            then 
								        case when regexp_replace( t_patient.patient_patient_mobile_phone , '[^0-9]*', '', 'g' )::text = ''
								            then '032688558'
								             else regexp_replace( t_patient.patient_patient_mobile_phone , '[^0-9]*', '', 'g' )::text END
						            else regexp_replace( t_patient.patient_phone_number, '[^0-9]*', '', 'g' )::text 
						            end`,
                visit.visit_hn,
                authenCode.claim_code
            )
            .having(sql<string>`'ศูนย์ไตเทียม' <> any (array_agg(b_service_point.service_point_description))`)

        return getPerson as unknown as VisitModel[]
    }
}

export default VisitService