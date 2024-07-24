import type { VisitModel } from "../../hospital/visit/visit.entity"

export interface NhsoFindPlaneModel {
    cid: string
    cookie: string | undefined
}

export interface GetPlansModel {
    visit: VisitModel[]
    cookie: string
}

export interface PersonPlansModel {
    pid: string
    id: number,
    paidModel: string
    status: string
    startDateStr: string
    expireDateStr: string
    subPid: string
    searchDate: string
    searchTime: string
    sourceData: string
    fundType: string
    fundFlag: string
    fundStatus: {
        id: string
        statusDesc: string
    },
    ownerPid: string
    hospSub: {
        hcode: string
        hname: string
    },
    hospMainOp: {
        hcode: string
        hname: string
    },
    hospMain: {
        hcode: string
        hname: string
    },
    personData: {
        pid: string
        subPid: string
        titleName: string
        fname: string
        lname: string
        motherId: string
        fatherId: string
        nation: string
        birthDate: string
        sex: string
        homeAddress: {
            adressNo: string
            trok: string
            soi: string
            road: string
        },
        addressCatm: {
            catm: string
            name: string
            changwatName: string
            amphurName: string
            tumbonName: string
            moobanName: string
            moo: string
        },
        catm: string
        transDate: string
        statusDola: string
        parseBirthDate: string
        fullName: string
        age: {
            years: number
            days: number
            months: number
        },
        birthDateStatus: string
        fullAddress: string
        sexDesc: string
        displayBirthDate: string
        parseBirthDateOptional: string
    },
    mainInscl: {
        rightId: string
        rightName: string
        codeWithName: string
    },
    subInscl: {
        inscl: string
        insclName: string
        mainInscl: string
        right: {
            rightId: string
            rightName: string
            codeWithName: string
        },
        codeWithName: string
    },
    additionalHmains: any[],
    claimMainType: string
    transDate: string
    seq: number,
    startDateTime: string
    expireDateTime: string
    createDate: string
    createBy: string
}

interface MainInscl {
    rightId: string;
    rightName: string;
    codeWithName: string;
}

interface SubInsclRight {
    rightId: string;
    rightName: string;
    codeWithName: string;
}

interface SubInscl {
    inscl: string;
    insclName: string;
    mainInscl: string;
    right: SubInsclRight;
    codeWithName: string;
}

export interface ClaimDataModel {
    id: number;
    pid: string;
    hnCode: string;
    titleName: string;
    fname: string;
    lname: string;
    sex: string;
    birthDate: string;
    mainInscl: MainInscl;
    subInscl: SubInscl;
    hcode: string;
    hname: string;
    provinceId: string;
    claimCode: string;
    claimType: string;
    claimTypeName: string;
    claimTypePackage: string;
    receivedDateTime: string;
    age: string;
    status: string;
    unlockFlag: boolean;
    claimStatus: string;
    fullName: string;
    sexDesc: string;
    displayBirthDate: string;
}



