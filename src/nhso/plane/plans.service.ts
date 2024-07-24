import type { GetClaimModel } from "../auth/auth.entity";
import NhsoProvider from "../../provider/nhso.provider";
import type { ClaimDataModel, NhsoFindPlaneModel, PersonPlansModel } from "./plans.entity";
import type { NhcPersonPlans } from "./plans.nch.entity";
import type { NhsoClaimModel } from "../../hospital/claim/claims.entity";

class PlansService extends NhsoProvider {

    getPlans = async (conditions: NhsoFindPlaneModel): Promise<PersonPlansModel | undefined> => {
        const personPlans = await this.nhsoFindPlane(conditions) as PersonPlansModel
        return personPlans === undefined ? undefined : personPlans
    }

    getClaimCode = async (payload: GetClaimModel): Promise<ClaimDataModel[] | undefined> => {
        const responst = await this.nhsoPersonClaim(payload)
        if (responst !== undefined) {
            try {
                const resJson = await responst.json() as unknown as ClaimDataModel[]
                return resJson
            } catch (err) {
                return undefined
            }

        } else {
            return undefined
        }
    }

    getNhsoPersonNCH = async (hospital: NhsoClaimModel[], cookie: string | undefined) => {
        try {
            if (hospital.length < 1) {
                return undefined
            }
            const res: any[] = await new Promise((reslove, reject) => {
                const result: NhcPersonPlans[] = []
                let row = 0
                let setTime = 0
                hospital.forEach(item => {
                    setTimeout(async () => {
                        const payload: { pid: string | null, cookie: string | undefined } = { pid: item.t_nhso_claim.pid, cookie: cookie }
                        const nchResponst = await this.nhsoPersonPlansNch(payload)
                        if (nchResponst !== undefined) {
                            if (nchResponst.status === 200) {
                                const nchJson = await nchResponst.json()
                                console.log('Set plans for update authen code. ' + item.t_patient.patient_pid + 'hn ' + item.t_patient.patient_hn);
                                result.push({ ...nchJson, item })
                            }
                        }
                        row += 1
                        if (hospital.length === row) {
                            reslove(result)
                        }

                    }, setTime)
                    setTime += 100
                })
            })

            return res as unknown as NhcPersonPlans[]
        } catch {
            return undefined
        }
    }
}

export default PlansService