import { patient } from "../database/schema/patient";
import { servicePoint } from "../database/schema/servicePoint";
import { visit } from "../database/schema/visit";
import { visitService } from "../database/schema/visitService";
import DataBases from "../database/database";
import { eq, sql, not, and } from 'drizzle-orm'

import LoginService from "../nhso/login/login.service";
class Test {
    private hosptial = new DataBases().db

    login =async () => {
        const log = new LoginService()

    console.log(    await log.login());
    
    }

}


export default Test