import type { NhsoClaimModel } from "../../hospital/claim/claims.entity";
import type { NhcPersonPlans } from "../plane/plans.nch.entity";

interface Insurance {
    rightId?: string;
    rightName?: string;
    codeWithName?: string;
}
interface SubInsurance {
    inscl: string;
    insclName: string;
    mainInscl: string;
    codeWithName: string;
    right: {
        rightId: string,
        rightName: string,
        codeWithName: string
    }
}

export interface EndpointPayloadModel {
    body: EndpointModel
    cookie: string
}

export interface EndpointModel {
    authenBy: 'SELF';
    authenType: "SMC";
    birthDate: string;
    claimServiceCode: string;
    fname: string;
    fullAddress: string;
    invoiceDate: string;
    invoiceTime: string;
    lname: string;
    mainInscl?: Insurance;
    mobile: string;
    nation: string;
    paidAmount: string;
    patientType: string;
    pid: string;
    privilegeAmount: string;
    serviceDate: string;
    serviceTime: string;
    sex: string;
    subInscl: SubInsurance;
    titleName: string;
    hospital:NhsoClaimModel
}

export interface HospitalClaimModel {
    t_nhso_claim_id: string
    hn: string
    vn: string
    pid: string
    visit_date_time: string
    t_billing_id: string
    billing_date_time: Date
    transaction_id: string
    total_amount: number
    paid_amount: number
    privilege_amount: number
    status: 'new' | 'claimed' | 'cancel' | 'canceled'
    main_inscl_code: string
    claim_service_code: string
    seq: number
    authen_code: string
    record_date_time: Date
    claim_date_time: Date
    user_claim_id: string
    user_claim_pid: string
    cancel_date_time: Date
    user_cancel_id: string
    cancel_reason: string
    no_smc_reason: string
    is_billing_deleted: boolean
    mobile: string
}