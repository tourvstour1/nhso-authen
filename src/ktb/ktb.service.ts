import { and, eq, inArray, ne, sql } from "drizzle-orm";
import DataBases from "../database/database";
import { visit } from "../database/schema/visit";
import type { FindVisitPayloadModal, KtbReceivePayloadModal, ResultUpdateStatus, ResultUpdateVisitPayment } from "./ktb.entity";
import { patient } from "../database/schema/patient";
import { billing } from "../database/schema/bliing";
import { govoffical } from "../database/schema/govoffical";
import { payment } from "../database/schema/payment";

class KtbService extends DataBases {

    async receiveData(payload: KtbReceivePayloadModal[]) {

        const visits = await this.findVisit(payload)
        const resultUpdateHis = await this.updateVisitPayment(visits)
        const getUpdateResult = await this.getResultUpdate(resultUpdateHis)

        const result: ResultUpdateVisitPayment = {
            message: 'success',
            status: 200,
            data: getUpdateResult as unknown as any[]
        }
        return result
    }

    findVisit = async (payload: KtbReceivePayloadModal[]): Promise<FindVisitPayloadModal[]> => {
        const pid: string[] = payload.map(i => i.cid).reduce((pre: string[], cur) => pre.includes(cur) ? pre : pre.concat(cur), [])
        const getDate = payload.map(i => {
            const splitDate = i.visitDate.split('/')
            const newDate = splitDate[2] + '-' + splitDate[1] + '-' + splitDate[0]
            return newDate
        }).reduce((pre: Date[], cur) => (pre.includes(new Date(cur)) ? pre : pre.concat(new Date(cur))), [])

        const minDate = new Date(Math.min(...getDate.map(i => i.getTime()))).toLocaleDateString("ce-CE", { year: "numeric", month: '2-digit', day: '2-digit' })
        const maxDate = new Date(Math.max(...getDate.map(i => i.getTime()))).toLocaleDateString("ce-CE", { year: "numeric", month: '2-digit', day: '2-digit' })

        const startDate = +(minDate.split('-')[0]) + 543 + '-' + minDate.split('-')[1] + '-' + minDate.split('-')[2]
        const endDate = +(maxDate.split('-')[0]) + 543 + '-' + maxDate.split('-')[1] + '-' + maxDate.split('-')[2]

        const gertVisit = await this.db.selectDistinct(
            {
                t_visit_id: visit.t_visit_id,
                visit_begin_visit_time: sql`substr(${visit.visit_begin_visit_time},1,10)`,
                patient_pid: patient.patient_pid,
                hn: visit.visit_hn,
                vn: visit.visit_vn,
                payer_share: billing.billing_payer_share,
                card_number: payment.visit_payment_card_number,
                govoffical_id: govoffical.t_visit_govoffical_plan_id,
                govoffical_number: govoffical.govoffical_number
            })
            .from(visit)
            .innerJoin(patient, eq(patient.t_patient_id, visit.t_patient_id))
            .innerJoin(billing, eq(billing.t_visit_id, visit.t_visit_id))
            .innerJoin(payment, eq(visit.t_visit_id, payment.t_visit_id))
            .innerJoin(govoffical, eq(govoffical.t_visit_payment_id, payment.t_visit_payment_id))
            .where(
                and(
                    inArray(patient.patient_pid, pid),
                    ne(visit.f_visit_status_id, '4'),
                    sql`substr(${visit.visit_begin_visit_time},1,10) BETWEEN ${startDate} and ${endDate}`,
                    eq(billing.billing_active, '1')
                )
            )

        const result = payload.reduce((pre: FindVisitPayloadModal[], cur) => {
            const splitDate = cur.visitDate.split('/')
            const curDate = +(splitDate[2]) + 543 + '-' + splitDate[1] + '-' + splitDate[0]
            const findPid = gertVisit.filter(pid => pid.patient_pid === cur.cid && pid.visit_begin_visit_time === curDate)

            if (findPid.length === 1) {
                let obj2 = cur
                const newObject = Object.assign(obj2, {
                    visit_id: findPid[0].t_visit_id,
                    hn: findPid[0].hn,
                    vn: findPid[0].vn,
                    payer_share: findPid[0].payer_share,
                    card_number: findPid[0].card_number,
                    govoffical_id: findPid[0].govoffical_id,
                    govoffical_number: findPid[0].govoffical_number
                }) as unknown as FindVisitPayloadModal
                return pre.concat(newObject)
            }
            else if (findPid.length > 1) {
                let obj1 = cur
                const billPayerShare = findPid.find(i => i.payer_share === +(obj1.bill))
                if (billPayerShare !== undefined) {
                    const newObject = Object.assign(obj1, {
                        visit_id: billPayerShare.t_visit_id,
                        hn: billPayerShare.hn,
                        vn: billPayerShare.vn,
                        payer_share: billPayerShare.payer_share,
                        card_number: billPayerShare.card_number,
                        govoffical_id: billPayerShare.govoffical_id,
                        govoffical_number: billPayerShare.govoffical_number
                    }) as unknown as FindVisitPayloadModal
                    return pre.concat(newObject)
                } else {
                    return pre
                }
            }
            else {
                return pre
            }
        }, [])

        return result
    }

    updateVisitPayment = async (payload: FindVisitPayloadModal[]) => {
        return await new Promise(async (reslove, reject) => {
            let result: any[] = []
            let row = 0
            for (let appove in payload) {
                try {
                    const resultUpdate: ResultUpdateStatus[] = await this.db
                        .update(govoffical)
                        .set({
                            govoffical_type: 1,
                            govoffical_number: payload[appove].appoveNumber,
                            update_datetime: sql`now()`
                        })
                        .where(
                            eq(govoffical.t_visit_govoffical_plan_id, payload[appove].govoffical_id)
                        )
                        .returning({
                            govoffical_plan_id: govoffical.t_visit_govoffical_plan_id,
                            govoffical_tyle: govoffical.govoffical_type,
                            govoffical_number: govoffical.govoffical_number,

                        })

                    result = result.concat(resultUpdate)
                    row += 1

                    if (row === payload.length) {
                        reslove(result)
                    }
                }
                catch (err) {
                    console.log(err);
                    const obj: ResultUpdateStatus = {
                        govoffical_tyle: null,
                        govoffical_plan_id: payload[appove].govoffical_id,
                        govoffical_number: payload[appove].govoffical_number,
                        message: 'false'
                    }
                    result.push(obj)
                    row += 1

                    if (row === payload.length) {
                        reslove(result)
                    }
                }
            }
        }) as unknown as ResultUpdateStatus[]
    }

    getResultUpdate = async (payload: ResultUpdateStatus[]) => {
        const getResult = await this.db
            .selectDistinct({
                hn: visit.visit_hn,
                vn: visit.visit_vn,
                name: sql`t_patient.patient_firstname||' '||	t_patient.patient_lastname as name`,
                govoffical_number: govoffical.govoffical_number,
                update_datetime: govoffical.update_datetime
            })
            .from(govoffical)
            .innerJoin(payment, eq(payment.t_visit_payment_id, govoffical.t_visit_payment_id))
            .innerJoin(visit, eq(visit.t_visit_id, payment.t_visit_id))
            .innerJoin(patient, eq(patient.patient_hn, visit.visit_hn))
            .where(
                inArray(govoffical.t_visit_govoffical_plan_id, payload.map(i => i.govoffical_plan_id) as any[])
            )

        return getResult
    }
}

export default KtbService