import { authenCode } from "../../db/schema/authen";
import DataBases from "../database/database";
import type { VisitModel } from "../visit/visit.entity";
import { v4 as uuidv4 } from 'uuid'
import type { ClaimPayloadModel, CreateAuthHisMode } from "./update.entity";

import LoginService from "../login/login.service";
import PlansService from "../plane/plans.service";
import type { GetClaimModel } from "../auth/auth.entity";
import VisitService from "../visit/visit.service";

class UpdateService extends DataBases {
    private login = new LoginService()
    private plans = new PlansService()
    private visit = new VisitService()

    updateToHospitalHis = async () => {
        const visit = await this.visit.getvisit()
        console.log('job get claim code:= ' + visit.length)
        const getAuth = await this.getAuthCode(visit)
        const createAuthHisList: CreateAuthHisMode[] = []

        for (let auth in getAuth) {
            const item = getAuth[auth]
            const itemList: CreateAuthHisMode = {
                //  t_nhso_authencode_id: uuidv4(),
                vn: item.visit.visit_vn,
                hn: item.visit.visit_hn,
                pid: item.claimCode.pid,
                mobile: item.visit.phone.substring(1, 10),
                correlation_id: uuidv4(),
                claim_type: item.claimCode.claimType,
                claim_code: item.claimCode.claimCode,
                created_date: item.claimCode.receivedDateTime,
                authen_from: 'web',
                record_date_time: new Date(),
                user_record_id: null,
                delete_date_time: null,
                user_delete_id: null
            }

            if (item.visit.visit_vn !== undefined) {
                createAuthHisList.push(itemList)
            }

        }

        await this.createAuthHis(createAuthHisList)
        console.log('update his auth code sucess');
    }

    private createAuthHis = async (listAuth: CreateAuthHisMode[]) => {

        for (let auth in listAuth) {
            const data = listAuth[auth]
            await this.db.insert(authenCode).values({
                vn: data.vn,
                hn: data.hn,
                pid: data.pid,
                mobile: data.mobile,
                correlation_id: data.correlation_id,
                claim_type: data.claim_type,
                claim_code: data.claim_code,
                created_date: data.created_date,
                authen_from: data.authen_from,
                record_date_time: data.record_date_time,
                user_record_id: data.user_record_id,
                delete_date_time: data.delete_date_time,
                user_delete_id: data.user_delete_id
            }).catch(err => {
                console.log(err);
                console.log(data.vn);
            })
        }
        console.log('update auth to his  = ' + listAuth.length);

    }

    private getAuthCode = async (visit: VisitModel[]): Promise<ClaimPayloadModel[]> => {
        const login = await this.login.login()

        return await new Promise((reslove, reject) => {
            let timer = 0
            let row = 0
            const responstClaim: ClaimPayloadModel[] = []
            visit.forEach(v => {
                setTimeout(async () => {
                    const getCodePayload: GetClaimModel = {
                        cookie: login.cookie,
                        payload: {
                            pid: v.patient_pid,
                            date: v.date_visit
                        }
                    }

                    const resultClaimCode = await this.plans.getClaimCode(getCodePayload)
                    if (resultClaimCode !== undefined) {
                        const getClaim = resultClaimCode.find(i => (i.pid === getCodePayload.payload?.pid && i.receivedDateTime === v.date_visit + 'T' + v.time_visit))
                        if (getClaim !== undefined) {
                            const claimPayload: ClaimPayloadModel = {
                                visit: v,
                                claimCode: getClaim
                            }
                            responstClaim.push(claimPayload)
                        }

                    }
                    row += 1
                    console.log(row + ' :loops: ' + visit.length)

                    if (row === visit.length) {
                        reslove(responstClaim)
                    }
                }, timer)
                timer += 100
            })
        })
    }
}

export default UpdateService

