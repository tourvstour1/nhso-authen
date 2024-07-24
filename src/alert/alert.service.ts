import DataBases from "../database/database";
import type { VisitModel } from "../hospital/visit/visit.entity";
import LineService from "../line/line.service";
import type { CreatAuthPayloadMode } from "../nhso/auth/auth.entity";

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
            const message = `📌ขอเลขAUTHEN CODE. ไม่สำเร็จ \nPID: ${claimPayload.visit.patient_pid}\nHN: ${claimPayload.visit.visit_hn}\nVN: ${claimPayload.visit.visit_vn}\nPHONE: ${claimPayload.visit.phone}\nสิทธิ์หลัก ${claimPayload.servicePlans?.mainInscl?.rightName}\nสิทธิ์รอง: ${claimPayload.servicePlans?.subInscl?.insclName}`
            await this.line.lineAlert(message)
            await this.insertVNAlert(claimPayload.visit.visit_hn, claimPayload.visit.visit_vn, message)
        }

    }

    alertPlansFalseToLine = async (plansPayload: VisitModel) => {
        const find = await this.findVNAlert(plansPayload.visit_vn)

        if (find.length < 1) {
            const message = `📌เช็คสิทธิ์ไม่สำเร็จ \nPID: ${plansPayload.patient_pid}\nHN: ${plansPayload.visit_hn}\nVN: ${plansPayload.visit_vn}\nPHONE: ${plansPayload.phone}`
            await this.line.lineAlert(message)
            await this.insertVNAlert(plansPayload.visit_hn, plansPayload.visit_vn, message)
        }
    }

    private findVNAlert = async (vn: string) => {
        return await this.alertDB.find({
            "vn": vn
        }).toArray()
    }

    private insertVNAlert = async (hn: string, vn: string, message: string) => {
        await this.alertDB.insertMany([{
            hn: hn,
            vn: vn,
            message: message,
            status: 1
        }])
    }
}

export default AlertService