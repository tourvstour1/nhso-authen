import type { NhsoClaimModel } from "../../hospital/claim/claims.entity";

interface PersonData {
    pid: string;
    subPid: string;
    titleName: string;
    fname: string;
    lname: string;
    motherId: string;
    fatherId: string;
    nation: string;
    birthDate: string;
    sex: string;
    homeAddress: Address;
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

interface Address {
    adressNo: string;
    trok: string;
    soi: string;
    road: string;
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
    months: number;
    days: number;
}

interface Inscl {
    rightId: string;
    rightName: string;
    codeWithName: string;
}

interface SubInscl {
    inscl: string;
    insclName: string;
    mainInscl: string;
    right: Inscl;
    codeWithName: string;
}

interface MainInscl extends Inscl { }

interface InsuranceData {
    mainInscl: MainInscl;
    subInscl: SubInscl;
}


export interface NhcPersonPlans {
    position: string;
    pid: string;
    flag: string;
    id: number;
    personData: PersonData;
    mainInscl: MainInscl;
    subInscl: SubInscl;
    claimMainType: string;
    transDate: string;
    seq: number;
    startDateTime: string;
    startDateStr: string;
    benefit: string;
    subPid: string;
    searchDate: string;
    searchTime: string;
    ownerPid: string;
    fundType: string;
    fundFlag: string;
    departmentName: string;
    sourceData: string;
    createDate: string;
    createBy: string;
    departmentCode: string;
    item: NhsoClaimModel
}
