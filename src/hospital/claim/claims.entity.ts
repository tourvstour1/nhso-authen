import type { SelectAuthenCode } from "../../database/schema/authen"
import type { SelectNhsoClaim } from "../../database/schema/nhsoClaim"
import type { SelectPatient } from "../../database/schema/patient"

export interface NhsoClaimModel {
    t_nhso_claim: SelectNhsoClaim
    t_patient: SelectPatient
    t_nhso_authencode: SelectAuthenCode
}

