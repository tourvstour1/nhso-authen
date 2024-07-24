import LoginService from "./nhso/login/login.service"
import VisitService from "./hospital/visit/visit.service"
import PlansService from "./nhso/plane/plans.service"
import type { NhsoFindPlaneModel } from "./nhso/plane/plans.entity"
import AuthService from "./nhso/auth/auth.service"
import type { AuthFalseModel, AuthModel, AuthNhsoModel, CreatAuthPayloadMode, GetClaimModel } from "./nhso/auth/auth.entity"
import MongoSerive from "./mongo/mongo.service"
import type { PatientClaimModel } from "./mongo/mongo.schema"
import UpdateService from "./hospital/update/update.service"
import type { VisitModel } from "./hospital/visit/visit.entity"
import ClaimService from "./hospital/claim/claims.service"
import EndpointService from "./nhso/endpoint/endpoint.service"
import type { NhsoClaimModel } from "./hospital/claim/claims.entity"
import AlertService from "./alert/alert.service"


class Services {
    private login = new LoginService()
    private visit = new VisitService()
    private plans = new PlansService()
    private auth = new AuthService()
    private mongo = new MongoSerive()
    private updates = new UpdateService()
    private claims = new ClaimService()
    private endpoint = new EndpointService()
    private alertService = new AlertService()

    setAutoAuthen = () => {
        const getTime = (Bun.env['TIMER'] as unknown as string).split(',')
        console.log(getTime);
        setInterval(async () => {
            const time = new Date().toLocaleTimeString('th-TH', { minute: "2-digit", second: '2-digit' })
            const checTime = getTime.includes(time)

            if (checTime) {
                console.log('start auto auth ' + time);
                await this.authen()
                this.claimEndPoiont()
            }
        }, 1000)
    }

    authen = async () => {
        await this.updates.updateToHospitalHis()
        const login = await this.login.login()
        const visit = await this.visit.getvisit()

        const mongoList = (await this.mongo.findAuthMongo(visit)) //.map(i => i.payload.pid)

        const visitAuth = visit.reduce((pre: VisitModel[], cur) => {
            const findPid = mongoList.filter(pid => pid.payload.pid === cur.patient_pid)
            const findDate = mongoList.filter(date => date.payload.receivedDate === cur.date_visit)
            const findTime = mongoList.filter(time => time.payload.receivedTime === cur.time_visit)

            if (findPid.length > 0 && findDate.length > 0 && findTime.length > 0) {
                return pre
            } else {
                return pre = pre.concat(cur)
            }
        }, [])

        console.log("visit total:=" + visit.length)
        console.log("new visit total:=" + visitAuth.length);

        const resultAuth = await new Promise((reslove, reject) => {
            let timer = 0
            const resultList: {
                pid: string;
                payload?: AuthModel | undefined | { receivedDate: string, pid: string };
                result?: any;
                status?: number | undefined;
            }[] = []

            let row = 0
            for (let v in visitAuth) {
                const conditions: NhsoFindPlaneModel = {
                    cid: visitAuth[v].patient_pid,
                    cookie: login.cookie
                }

                setTimeout(async () => {
                    const plans = await this.plans.getPlans(conditions)
                    if (plans !== undefined) {
                        const claimPayload: CreatAuthPayloadMode = {
                            cookie: conditions.cookie,
                            servicePlans: plans,
                            visit: visitAuth[v]
                        }

                        const creatClaimPayload = this.auth.creatAuthPayload(claimPayload)

                        const authPayload: AuthNhsoModel = {
                            cookie: conditions.cookie,
                            payload: creatClaimPayload
                        }

                        const resultAuth = await this.auth.authNhso(authPayload)

                        if (resultAuth?.status !== 200) {
                            this.alertService.alertAuthenFalseToLine(claimPayload)
                            console.log(claimPayload.visit.visit_vn);
                            
                        }

                        const getCodePayload: GetClaimModel = {
                            cookie: login.cookie,
                            payload: {
                                pid: resultAuth?.payload?.pid,
                                date: resultAuth?.result.receivedDate
                            }
                        }

                        const resultClaimCode = await this.plans.getClaimCode(getCodePayload) as PatientClaimModel[]
                        if (resultClaimCode === undefined) {
                            console.log(getCodePayload.payload);

                        } else {
                            const getClaimId = resultClaimCode.find(i => (resultAuth?.result.pid === i.pid && resultAuth?.result.receivedDateTime === i.receivedDateTime))

                            if (resultAuth?.status === 200) {
                                const obj = { ...resultAuth, pid: claimPayload.visit.patient_pid, hn: visitAuth[v].visit_hn, vn: visitAuth[v].visit_vn, claimCode: getClaimId }
                                resultList.push(obj)
                            } else {
                                if (plans.subInscl === undefined) {
                                    const obj = {
                                        ...resultAuth,
                                        payload: { receivedDate: claimPayload.visit.date_visit, pid: claimPayload.visit.patient_pid },
                                        result: plans,
                                        pid: claimPayload.visit.patient_pid,
                                        hn: visitAuth[v].visit_hn,
                                        vn: visitAuth[v].visit_vn
                                    }

                                    resultList.push(obj)
                                }
                            }
                        }
                    }
                    row += 1
                    console.log(row + '-' + visitAuth.length + ' > ' + conditions.cid + '=' + plans?.mainInscl?.rightId)
                    if (row === visitAuth.length) {
                        reslove(resultList)
                    }
                }, timer)
                timer += 300
            }
        }) as unknown as {
            pid: string;
            payload?: AuthModel | undefined | AuthFalseModel;
            result?: any;
            status?: number | undefined;
        }[]

        if (resultAuth.length > 0) {
            await this.mongo.createResultAuth(resultAuth)
        }

        await this.updates.updateToHospitalHis()
        return 'updates his success'
    }

    claimEndPoiont = async () => {
        const getNhsoClaim = await this.claims.getNhsoClaim() as unknown as NhsoClaimModel[]
        console.log("getNhsoClaim" + getNhsoClaim.length);
        const login = await this.login.login()
        const findPlanPersons = await this.plans.getNhsoPersonNCH(getNhsoClaim, login.cookie)
        console.log("findPlanPersons" + findPlanPersons?.length);
        const checkOut = await this.endpoint.closePlans(findPlanPersons, login.cookie)

        return checkOut
    }

}

export default Services