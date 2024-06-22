import { patient } from "../../db/schema/patient";
import { servicePoint } from "../../db/schema/servicePoint";
import { visit } from "../../db/schema/visit";
import { visitService } from "../../db/schema/visitService";
import DataBases from "../database/database";
import { eq, sql, not, and } from 'drizzle-orm'

import LoginService from "../login/login.service";
class Test {
    private hosptial = new DataBases().db

    login =async () => {
        const log = new LoginService()

    console.log(    await log.login());
    
    }

}


export default Test