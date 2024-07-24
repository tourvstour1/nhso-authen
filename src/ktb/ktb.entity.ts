import { t } from "elysia"

export interface KtbReceivePayloadModal {
    cid: string
    fname: string
    lname: string
    visitDate: string
    appoveNumber: string
    stat: string
    bill: string
}

export interface FindVisitPayloadModal {
    cid: string
    fname: string
    lname: string
    visitDate: string
    appoveNumber: string
    stat: string
    bill: string
    visit_id: string
    hn: string
    vn: string
    payer_share: number
    card_number: string
    govoffical_id: string
    govoffical_number: string
}

export interface UpdateVisitPaymentModal {
    t_visit_id: string
    appoveNumber: string
}

export interface ResultUpdateVisitPayment {
    data?: any[]
    message: string
    status: number
}


export const ktbReceivePayloadSchema = t.Array(t.Object({
    cid: t.String(),
    fname: t.String(),
    lname: t.String(),
    visitDate: t.String(),
    appoveNumber: t.String(),
    stat: t.String(),
    bill: t.String()
}));

export interface ResultUpdateStatus {
    govoffical_plan_id?: string | null
    govoffical_tyle?: number | null
    govoffical_number?: string | null
    message?: 'success' | 'false'
}