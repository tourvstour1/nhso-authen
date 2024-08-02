import DataBases from "../database/database";
import type { VisitModel } from "../hospital/visit/visit.entity";
import LineService from "../line/line.service";
import type { CreatAuthPayloadMode } from "../nhso/auth/auth.entity";
import type { AlertDataModel } from "./alert.entity";

interface AlertMessageModel {
    hn: string
    vn: string
    message: string
    status: number
}
class AlertService extends DataBases {
    private alertDB = this.mongo().collection('alert_message')
    private line = new LineService()

    alertAuthenFalseToLine = async (claimPayload: CreatAuthPayloadMode) => {
        const find = await this.findVNAlert(claimPayload.visit.visit_vn)

        if (find.length < 1) {
            const message = `❌ขอเลขAUTHEN CODE. ไม่สำเร็จ\nDATE: ${claimPayload.visit.date_visit} ${claimPayload.visit.time_visit} \nPID: ${claimPayload.visit.patient_pid}\nHN: ${claimPayload.visit.visit_hn}\nVN: ${claimPayload.visit.visit_vn}\nPHONE: ${claimPayload.visit.phone}\nสิทธิ์หลัก ${claimPayload.servicePlans?.mainInscl?.rightName}\nสิทธิ์รอง: ${claimPayload.servicePlans?.subInscl?.insclName}`
            const setDataAlert: AlertDataModel = {
                hn: claimPayload.visit.visit_hn,
                vn: claimPayload.visit.visit_vn,
                pid:claimPayload.visit.patient_pid,
                dateVisit: claimPayload.visit.date_visit,
                timeVisit:claimPayload.visit.time_visit,
                message: message,
            }
            await this.line.lineAlert(setDataAlert.message)
            await this.insertVNAlert(setDataAlert)
        }

    }

    alertPlansFalseToLine = async (plansPayload: VisitModel) => {
        const find = await this.findVNAlert(plansPayload.visit_vn)

        if (find.length < 1) {
            const message = `⚠️เช็คสิทธิ์ไม่สำเร็จ\nDATE: ${plansPayload.date_visit} ${plansPayload.time_visit}\nPID: ${plansPayload.patient_pid}\nHN: ${plansPayload.visit_hn}\nVN: ${plansPayload.visit_vn}\nPHONE: ${plansPayload.phone}`
            const setDataAlert: AlertDataModel = {
                hn: plansPayload.visit_hn,
                vn: plansPayload.visit_vn,
                pid: plansPayload.patient_pid,
                dateVisit: plansPayload.date_visit,
                timeVisit: plansPayload.time_visit,
                message: message,

            }
            await this.line.lineAlert(setDataAlert.message)
            await this.insertVNAlert(setDataAlert)
        }
    }

    private findVNAlert = async (vn: string) => {
        return await this.alertDB.find({
            "vn": vn
        }).toArray()
    }

    private insertVNAlert = async (dataAlert: AlertDataModel) => {
        await this.alertDB.insertMany([{
            hn: dataAlert.hn,
            vn: dataAlert.vn,
            pid: dataAlert.pid,
            dateVisit: dataAlert.dateVisit,
            timeVisit: dataAlert.timeVisit,
            message: dataAlert.message,
            status: 1
        }])
    }
}

export default AlertService

