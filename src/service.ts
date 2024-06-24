import LoginService from "./login/login.service"
import VisitService from "./visit/visit.service"
import PlansService from "./plane/plans.service"
import type { NhsoFindPlaneModel } from "./plane/plans.entity"
import AuthService from "./auth/auth.service"
import type { AuthFalseModel, AuthModel, AuthNhsoModel, CreatAuthPayloadMode, GetClaimModel } from "./auth/auth.entity"
import MongoSerive from "./mongo/mongo.service"
import type { PatientClaimModel } from "./mongo/mongo.schema"
import UpdateService from "./update/update.service"
import type { VisitModel } from "./visit/visit.entity"

class Services {
    private login = new LoginService()
    private visit = new VisitService()
    private plans = new PlansService()
    private auth = new AuthService()
    private mongo = new MongoSerive()
    private updates = new UpdateService()

    setAutoAuthen = () => {
        const getTime = (Bun.env['TIMER'] as unknown as string).split(',')
        console.log(getTime);
        setInterval(() => {
            const time = new Date().toLocaleTimeString('th-TH', { minute: "2-digit", second: '2-digit' })
            const checTime = getTime.includes(time)

            if (checTime) {
                console.log('start auto auth ' + time);
                this.authen()
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

                        const getCodePayload: GetClaimModel = {
                            cookie: login.cookie,
                            payload: {
                                pid: resultAuth?.payload?.pid,
                                date: resultAuth?.result.receivedDate
                            }
                        }

                        const resultClaimCode = await this.plans.getClaimCode(getCodePayload) as PatientClaimModel[]
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
                    row += 1
                    console.log(row + '===' + visitAuth.length)
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

        return '555'
    }


    getClaim = async () => {
        await this.updates.updateToHospitalHis()
        const login = await this.login.login()
        const visit = await this.visit.getvisit()
        const getDate = new Date().toLocaleDateString('ce-CE', { year: 'numeric', month: '2-digit', day: "2-digit" })
        const getVisitNotClaim = await this.mongo.findVisitNotClaim(getDate)


        // const getItemCaim = await new Promise<PatientClaimModel[]>((resolve, reject) => {
        //     let timer = 0
        //     let row = 0
        //     const claimList: PatientClaimModel[] = []
        //     getVisitNotClaim.forEach(async (item) => {
        //         setTimeout(async () => {
        //             const getCodePayload: GetClaimModel = {
        //                 cookie: login.cookie,
        //                 payload: {
        //                     pid: item.result.pid,
        //                     date: item.result.receivedDate
        //                 }
        //             }

        //             const resultClaimCode = await this.plans.getClaimCode(getCodePayload) as PatientClaimModel[]
        //             const getClaimId = resultClaimCode.find(i => (item.result.pid === i.pid && item.result.receivedDateTime === i.receivedDateTime))
        //             if (getClaimId !== undefined) {
        //                 claimList.push(getClaimId)
        //             }

        //             row += 1
        //             console.log(row + ' = ' + getVisitNotClaim.length);

        //             if (row === getVisitNotClaim.length) {
        //                 resolve(claimList)
        //             }
        //         }, timer)
        //         timer += 300
        //     })
        // })
        //await this.mongo.updateClaimCode(getItemCaim).

        // await this.updates.updateToHospitalHis(visit)
        // console.log('update auth to his compless');
        // return getItemCaim.map(i => i.pid)
    }

}

export default Services