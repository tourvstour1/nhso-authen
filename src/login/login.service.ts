import type { LoginModel } from "./login.entity";
import nhsoProvider from "../provider/nhso.provider";

class LoginService extends nhsoProvider {

    login = async (): Promise<{ cookie?: string | undefined; }> => {
        const login: LoginModel = {
            username: Bun.env['USER_NAME'] as unknown as string,
            password: Bun.env['PASSWORD'] as unknown as string
        }
        const cookie = await this.nhsoLogin(login)
      
        let result: { cookie?: string | undefined } = {
            cookie: cookie?.cookies
        }
        
        return result
    }
}

export default LoginService