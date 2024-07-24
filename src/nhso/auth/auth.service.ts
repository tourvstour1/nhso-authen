import MongoSerive from "../../mongo/mongo.service"
import NhsoProvider from "../../provider/nhso.provider"
import type { ClaimServiceModel, AuthModel, CreatAuthPayloadMode, AuthNhsoModel } from "./auth.entity"

class AuthService {
    private nhsoProvider = new NhsoProvider()

    private ClaimSeriveList: ClaimServiceModel[] = [{
        claimPackageId: 34,
        code: "PG0060001",
        name: "เข้ารับบริการรักษาทั่วไป (OPD/ IPD/ PP)",
        packagName: "เข้ารับบริการรักษาทั่วไป (OPD/ IPD/ PP)",
        selected: true,
        disabled: false
    }, {
        claimPackageId: 41,
        code: "PG0110001",
        name: "Self Isolation",
        packagName: "Self Isolation",
        selected: true,
        disabled: false
    }, {
        claimPackageId: 42,
        code: "PG0120001",
        name: "UCEP PLUS (ผู้ป่วยกลุ่มอาการสีเหลืองและสีแดง)",
        packagName: "UCEP PLUS (ผู้ป่วยกลุ่มอาการสีเหลืองและสีแดง)",
        selected: true,
        disabled: false
    }, {
        claimPackageId: 43,
        code: "PG0130001",
        name: "บริการฟอกเลือดด้วยเครื่องไตเทียม (HD)",
        packagName: "บริการฟอกเลือดด้วยเครื่องไตเทียม (HD)",
        selected: true,
        disabled: false
    }]

    creatAuthPayload = (payload: CreatAuthPayloadMode): AuthModel | undefined => {
        try {
            const setPalyload: AuthModel = {
                authenType: "KOS",
                pid: payload.servicePlans.personData.pid,
                titleName: payload.servicePlans.personData.titleName,
                fname: payload.servicePlans.personData.fname,
                lname: payload.servicePlans.personData.lname,
                sex: payload.servicePlans.personData.sex,
                nation: payload.servicePlans.personData.nation,
                birthDate: payload.servicePlans.personData.birthDate,
                fullAddress: payload.servicePlans.personData.fullAddress,
                hnCode: payload.visit.visit_hn,
                mainInscl: {
                    rightId: payload.servicePlans.mainInscl.rightId === undefined ? "" : payload.servicePlans.mainInscl.rightId,
                    rightName: payload.servicePlans.mainInscl.rightName === undefined ? "" : payload.servicePlans.mainInscl.rightName,
                    codeWithName: payload.servicePlans.mainInscl.codeWithName === undefined ? "" : payload.servicePlans.mainInscl.codeWithName
                },
                subInscl: {
                    inscl: payload.servicePlans.subInscl.inscl === undefined ? "" : payload.servicePlans.subInscl.inscl,
                    insclName: payload.servicePlans.subInscl.insclName === undefined ? "" : payload.servicePlans.subInscl.insclName,
                    mainInscl: payload.servicePlans.subInscl.mainInscl === undefined ? "" : payload.servicePlans.subInscl.mainInscl,
                    right: {
                        rightId: payload.servicePlans.subInscl.right.rightId === undefined ? "" : payload.servicePlans.subInscl.right.rightId,
                        rightName: payload.servicePlans.subInscl.right.rightName === undefined ? "" : payload.servicePlans.subInscl.right.rightName,
                        codeWithName: payload.servicePlans.subInscl.right.codeWithName === undefined ? "" : payload.servicePlans.subInscl.right.codeWithName
                    },
                    codeWithName: payload.servicePlans.subInscl.codeWithName === undefined ? "" : payload.servicePlans.subInscl.codeWithName,
                },
                receivedDate: payload.visit.date_visit,
                receivedTime: payload.visit.time_visit,
                mobile: payload.visit.phone,
                patientType: "PP",
                authenBy: 'SELF',
                personClaimItems: this.ClaimSeriveList.filter(i => i.claimPackageId === (+payload.visit.package))
            }
            return setPalyload
        } catch (err) {
            return undefined
        }
    }

    authNhso = async (payload: AuthNhsoModel) => {
        const responst = await this.nhsoProvider.nhsoAuth(payload)

        if (responst !== undefined) {
            const resJson = await responst.json()
            const querCreate = {
                payload: payload.payload,
                result: resJson,
                status: responst.status
            }
            return querCreate
        } else {
            return undefined
        }
    }

}

export default AuthService