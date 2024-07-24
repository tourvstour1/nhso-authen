import { eq, sql } from "drizzle-orm";
import DataBases from "../../database/database";
import { nhsoClaim } from "../../database/schema/nhsoClaim";
import NhsoProvider from "../../provider/nhso.provider";
import type { NhcPersonPlans } from "../plane/plans.nch.entity";
import type { EndpointModel, EndpointPayloadModel } from "./endpoint.entity";

class EndpointService extends NhsoProvider {
    private hopsital = new DataBases().db

    closePlans = async (hospital_claim: NhcPersonPlans[] | undefined, cookie: string | undefined) => {
        return await new Promise((reslove, reject) => {
            let row = 0
            const endPointClaim: EndpointModel[] = []
            hospital_claim?.forEach(async (items, index) => {
                if (items !== undefined) {               
                    const setBody: EndpointModel = {
                        authenType: "SMC",
                        pid: items.pid,
                        titleName: items.personData.titleName,
                        fname: items.personData.fname,
                        lname: items.personData.lname,
                        sex: items.personData.sex,
                        nation: items.personData.nation,
                        birthDate: items.personData.birthDate,
                        fullAddress: items.personData.fullAddress,
                        mainInscl: {
                            rightId: items?.mainInscl?.rightId,
                            rightName: items?.mainInscl?.rightName,
                            codeWithName: items?.mainInscl?.codeWithName
                        },
                        subInscl: {
                            inscl: items?.subInscl?.inscl,
                            insclName: items?.subInscl?.insclName,
                            mainInscl: items?.subInscl?.mainInscl,
                            right: {
                                rightId: items?.subInscl?.right.rightId,
                                rightName: items?.subInscl?.right.rightName,
                                codeWithName: items?.subInscl?.right.codeWithName
                            },
                            codeWithName: items?.subInscl?.codeWithName
                        },
                        serviceDate: items.item.t_nhso_claim.visit_date_time.split(' ')[0],
                        serviceTime: items.item.t_nhso_claim.visit_date_time.split(' ')[1].replace('+', '.'),
                        invoiceDate: items.item.t_nhso_claim.billing_date_time.toLocaleDateString('ce', { year: "numeric", month: '2-digit', day: "2-digit" }),
                        invoiceTime: items.item.t_nhso_claim.billing_date_time.toLocaleTimeString('ce', { hour: "2-digit", minute: '2-digit', second: '2-digit' }),
                        mobile: items.item.t_patient.patient_phone_number,
                        patientType: items.claimMainType,
                        claimServiceCode: items.item.t_nhso_authencode.claim_type,
                        authenBy: 'SELF',
                        paidAmount: items.item.t_nhso_claim.paid_amount.toString(),
                        privilegeAmount: items.item.t_nhso_claim.privilege_amount.toString(),

                        hospital: items.item
                    }
                    endPointClaim.push(setBody)
                    row += 1
                    console.log(hospital_claim.length + '-' + row + ' Set Plans ' + items.pid)
                    if (row === hospital_claim.length) {
                        const resultEndPlans = await this.endPlans(endPointClaim, cookie as unknown as string)
                        reslove(resultEndPlans)
                    }
                } else {
                    row += 1
                    console.log(hospital_claim.length + '-' + row + 'Plans Undefined ' + items)
                    if (row === hospital_claim.length) {
                        const resultEndPlans = await this.endPlans(endPointClaim, cookie as unknown as string)
                        reslove(resultEndPlans)
                    }
                }
            })
        })
    }

    endPlans = async (dataClaims: EndpointModel[], cookie: string) => {
        return await new Promise((reslove, reject) => {
            let row = 0
            let time = 0
            dataClaims.forEach(async (plan) => {
                const id = plan.hospital.t_nhso_claim.vn
                if (plan !== undefined) {
                    let getPlans = plan as unknown as any
                    delete getPlans.hospital as unknown as EndpointModel
                    const payload: EndpointPayloadModel = {
                        cookie: cookie,
                        body: getPlans
                    }
                    setTimeout(async () => {
                        const resuleEnd = await this.nhsoEndPoint(payload)
                        if (resuleEnd?.status === 200) {
                            const responst = await resuleEnd.json()

                            await this.hopsital.update(nhsoClaim)
                                .set({
                                    main_inscl_code: plan.mainInscl?.rightId,
                                    claim_service_code: plan.claimServiceCode,
                                    seq: responst.seq,
                                    authen_code: responst.authenCode,
                                    claim_date_time: sql`now()`,
                                    status: 'claimed'
                                })
                                .where(eq(nhsoClaim.vn, `${id}`))

                            console.log(" update close Plase " + responst.authenCode + " VN: " + id);
                        } else {
                                                  
                        }

                        row += 1

                        if (row === dataClaims.length) {
                            console.log('compless');
                            reslove('compless')
                        }
                    }, time)

                    time += 100
                } else {
                    row += 1
                    if (row === dataClaims.length) {
                        console.log('compless');
                        reslove('compless')
                    }
                }
            })
        })
    }
}

export default EndpointService