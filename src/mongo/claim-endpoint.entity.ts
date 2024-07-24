
export interface ClaimDetaleRequesModel {
    authenType: string;
    pid: string;
    titleName: string;
    fname: string;
    lname: string;
    sex: string;
    nation: string;
    birthDate: string;
    fullAddress: string;
    mainInscl: Insurance;
    subInscl: SubInsurance;
    serviceDate: string;
    serviceTime: string;
    invoiceDate: string;
    invoiceTime: string;
    mobile: string;
    patientType: string;
    paidAmount: string;
    privilegeAmount: string;
    claimServiceCode: string;
    authenBy: string;
}

interface Insurance {
    rightId: string;
    rightName: string;
    codeWithName: string;
}

interface SubInsurance {
    inscl: string;
    insclName: string;
    mainInscl: string;
    right: Insurance;
    codeWithName: string;
}


export interface ClaimDetaleResponstModel {
    authenCode: string
    seq: number
}