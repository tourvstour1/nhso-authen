import type { PersonPlansModel } from "../plane/plans.entity"
import type { VisitModel } from "../visit/visit.entity"

interface HomeAddress {
    addressNo: string;
}

interface AddressCatm {
    catm: string;
    name: string;
    changwatName: string;
    amphurName: string;
    tumbonName: string;
    moobanName: string;
    moo: string;
}

interface Age {
    years: number;
    days: number;
    months: number;
}

interface PersonData {
    pid: string;
    subPid: string;
    titleName: string;
    fname: string;
    lname: string;
    nation: string;
    birthDate: string;
    sex: string;
    homeAddress: HomeAddress;
    addressCatm: AddressCatm;
    catm: string;
    transDate: string;
    statusDola: string;
    parseBirthDate: string;
    fullName: string;
    age: Age;
    fullAddress: string;
    sexDesc: string;
    birthDateStatus: string;
    displayBirthDate: string;
    parseBirthDateOptional: string;
}

interface FundStatus {
    id: string;
    statusDesc: string;
}

export interface AuthFalseModel {
    pid: string;
    id: number;
    status: string;
    fundType: string;
    fundFlag: string;
    createBy: string;
    createDate: string;
    claimMainType: string;
    personData: PersonData;
    transDate: string;
    seq: number;
    fundStatus: FundStatus;
    subPid: string;
    searchDate: string;
    searchTime: string;
    ownerPid: string;
    receivedDate: string
}
export interface AuthModel {
    authenType?: string
    pid?: string
    titleName?: string
    fname?: string
    lname?: string
    sex?: string
    nation?: string
    birthDate?: string
    fullAddress?: string
    hnCode?: string
    mainInscl?: {
        rightId?: string,
        rightName?: string
        codeWithName?: string
    },
    subInscl?: {
        inscl?: string
        insclName?: string
        mainInscl?: string
        right?: {
            rightId?: string | undefined
            rightName?: string
            codeWithName?: string
        },
        codeWithName?: string
    },
    receivedDate: string | boolean
    receivedTime: string
    mobile: string
    patientType: string
    authenBy: string
    personClaimItems: Array<ClaimServiceModel>
}

export interface ClaimServiceModel {
    claimPackageId: number
    code: string
    name: string
    packagName: string
    selected: boolean
    disabled: boolean
}

export interface CreatAuthPayloadMode {
    servicePlans: PersonPlansModel,
    visit: VisitModel,
    cookie?: string,
}

export interface AuthNhsoModel {
    payload?: AuthModel
    cookie?: string
}
export interface GetClaimModel {
    payload?: {
        pid?: string,
        date?: string
    }
    cookie?: string
}