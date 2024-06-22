import type { GetClaimModel } from "../auth/auth.entity";
import NhsoProvider from "../provider/nhso.provider";
import type { ClaimDataModel, NhsoFindPlaneModel, PersonPlansModel } from "./plans.entity";

class PlansService extends NhsoProvider {

    getPlans = async (conditions: NhsoFindPlaneModel): Promise<PersonPlansModel | undefined> => {
        const personPlans = await this.nhsoFindPlane(conditions) as PersonPlansModel
        return personPlans === undefined ? undefined : personPlans
    }

    getClaimCode = async (payload: GetClaimModel): Promise<ClaimDataModel[] | undefined> => {
        const responst = await this.nhsoPersonClaim(payload)
        if (responst !== undefined) {
            const resJson = await responst.json() as unknown as ClaimDataModel[]
            return resJson
        } else {
            return undefined
        }
    }
}

export default PlansService