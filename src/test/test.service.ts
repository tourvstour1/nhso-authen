import { patient } from "../schema/patient";
import { servicePoint } from "../schema/servicePoint";
import { visit } from "../schema/visit";
import { visitService } from "../schema/visitService";
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