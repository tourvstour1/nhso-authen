import type { AuthNhsoModel, GetClaimModel } from "../nhso/auth/auth.entity"
import type { EndpointPayloadModel } from "../nhso/endpoint/endpoint.entity"
import type { loginCookie, LoginModel } from "../nhso/login/login.entity"
import type { NhsoFindPlaneModel } from "../nhso/plane/plans.entity"
import FetchProvider from "./fetch.provider"
import type { FetchGettMode, FetchPostMode } from "./provider.entity"

class NhsoProvider extends FetchProvider {
    nhsoLogin = async (login: LoginModel): Promise<loginCookie | undefined> => {
        try {
            const loginPath = Bun.env['PATH_POST_LOGIN'] as unknown as string

            const postPayload: FetchPostMode = {
                path: loginPath,
                body: login
            }
            const responst = await this.fetchPost(postPayload)

            if (responst.status === 200) {
                const cookie: loginCookie = { cookies: responst.headers.get('set-cookie')?.toString() || '' }
                return cookie
            } else {
                return undefined
            }

        } catch (err) {
            return undefined
        }
    }

    nhsoFindPlane = async (plans: NhsoFindPlaneModel) => {
        try {
            const planePath = Bun.env['PATH_GET_PLANE'] as unknown as string
            const getPayload: FetchGettMode = {
                cookie: plans.cookie,
                path: planePath,
                query: "pid=" + plans.cid
            }
            const responst = await this.fetchGet(getPayload)

            if (responst !== undefined) {
                const size = responst.headers.get('content-length')
                if (size !== "0") {
                    const personAuthen = await responst.json()
                    if (personAuthen.pid === undefined) {
                        console.log(personAuthen);
                    }
                    let mobileNumber = ''
                    personAuthen.mobile = mobileNumber

                    if (personAuthen.subInscl === undefined && personAuthen.mainInscl === undefined) {
                        return undefined
                    } else {
                        return personAuthen
                    }
                }
            } else {
                return undefined
            }

        } catch (err) {
            return undefined
        }
    }

    nhsoAuth = async (auth: AuthNhsoModel) => {
        try {
            const planePath = Bun.env['PATH_POST_CLIM'] as unknown as string
            const postPayload: FetchPostMode = {
                path: planePath,
                body: auth.payload,
                cookie: auth.cookie
            }

            const responst = await this.fetchPost(postPayload)
            return responst

        } catch (err) {
            console.log('err');

            return undefined
        }
    }

    nhsoPersonClaim = async (auth: GetClaimModel) => {
        try {
            const planePath = Bun.env['PATH_GET_PERSON_CLAIM'] as unknown as string
            const getPayload: FetchGettMode = {
                cookie: auth.cookie,
                path: planePath,
                query: `pid=${auth.payload?.pid}`
            }
            const responst = await this.fetchGet(getPayload)
            return responst
        } catch (err) {
            return undefined
        }
    }

    nhsoPersonPlansNch = async (payload: { pid: string | null, cookie: string | undefined }) => {
        try {
            if (payload.pid === null) {
                return undefined
            }
            const planePath = Bun.env['PATH_GET_NCH_PERSONAL'] as unknown as string
            const getPayload: FetchGettMode = {
                cookie: payload.cookie,
                path: planePath,
                query: `pid=${payload.pid}`
            }

            const responst = await this.fetchGet(getPayload)
            return responst
        } catch (err) {
            return undefined
        }
    }

    nhsoEndPoint = async (auth: EndpointPayloadModel) => {
        try {
            const endPointPath = Bun.env['PATH_POST_NHSO_DETAIL'] as unknown as string
            const postPayload: FetchPostMode = {
                path: endPointPath,
                body: auth.body,
                cookie: auth.cookie
            }

            const responst = await this.fetchPost(postPayload)
            return responst
        } catch (err) {
            return undefined
        }
    }
}

export default NhsoProvider