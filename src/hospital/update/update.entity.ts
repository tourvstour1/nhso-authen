import type { ClaimDataModel } from "../../nhso/plane/plans.entity"
import type { VisitModel } from "../visit/visit.entity"

export interface CreateAuthHisMode {
    t_nhso_authencode_id?: string,
    vn: string
    hn: string
    pid: string
    mobile: string
    correlation_id: string
    claim_type: string
    claim_code: string
    created_date: string
    authen_from: string
    record_date_time: Date
    user_record_id: string | null
    delete_date_time: Date | null
    user_delete_id: string | null
}

export interface ClaimPayloadModel {
    visit: VisitModel
    claimCode: ClaimDataModel
}