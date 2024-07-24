import DataBases from "../../database/database";
import { nhsoClaim } from "../../database/schema/nhsoClaim";
import { and, eq, isNull, ne, sql } from "drizzle-orm";
import { patient } from "../../database/schema/patient";
import { authenCode } from "../../database/schema/authen";

class ClaimService extends DataBases {
    getNhsoClaim = async () => {
        const startDate = '2024-05-01'
        const nshoJobs = await this.db.select()
            .from(nhsoClaim)
            .innerJoin(patient, eq(nhsoClaim.pid, patient.patient_pid))
            .innerJoin(authenCode, eq(authenCode.vn, nhsoClaim.vn))
            .where(
                and(
                    eq(nhsoClaim.status, 'new'),
                    sql`substr((${nhsoClaim.visit_date_time})::text,1,10) >= ${startDate}`,
                    ne(nhsoClaim.pid, ''),
                    eq(nhsoClaim.status, 'new'),
                    eq(patient.f_patient_nation_id, '99'),
                    isNull(nhsoClaim.authen_code)
                )
            )
            .limit(2000)
        return nshoJobs
    }
}

export default ClaimService