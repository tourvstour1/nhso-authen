export interface ResultAuth{
    _id: {
        $oid: string
    },
    payload: {
        authenType: string,
        pid: string,
        titleName: string,
        fname: string,
        lname: string,
        sex: string,
        nation: string,
        birthDate: string,
        fullAddress: string,
        hnCode: string,
        mainInscl: {
            rightId: string,
            rightName: string,
            codeWithName: string,
        },
        subInscl: {
            inscl: string,
            insclName: string,
            mainInscl: string,
            right: {
                rightId: string,
                rightName: string,
                codeWithName: string,
            },
            codeWithName: string,
        },
        receivedDate: string,
        receivedTime: string,
        mobile: string,
        patientType: string,
        authenBy: string,
        personClaimItems: [
            {
                claimPackageId: number,
                code: string,
                name: string,
                packagName: string,
                selected: boolean,
                disabled: boolean
            }
        ]
    },
    result: {
        createdId: string,
        createdDate: string,
        lastUpdatedId: string,
        lastUpdatedDate: string,
        createdName: string,
        updatedName: string,
        id: number,
        patientType: string,
        hnCode: string,
        pid: string,
        titleName: string,
        fname: string,
        lname: string,
        sex: string,
        birthDate: string,
        fullAddress: string,
        mainInscl: {
            rightId: string,
            rightName: string,
            codeWithName: string,
        },
        subInscl: {
            inscl: string,
            insclName: string,
            mainInscl: string,
            right: {
                rightId: string,
                rightName: string,
                codeWithName: string,
            },
            codeWithName: string,
        },
        agestring: string,
        authenType: string,
        status: string,
        mobile: string,
        receivedDate: string,
        receivedTime: string,
        receivedDateTime: string,
        hcode: string,
        nation: string,
        personClaimItems: [
            {
                createdId: string,
                createdDate: string,
                lastUpdatedId: string,
                lastUpdatedDate: string,
                createdName: string,
                updatedName: string,
                id: number,
                code: string,
                name: string,
                claimPackageId: number,
                packagName: string,
                transId: number
            }
        ],
        version: number,
        unlockFlag: boolean,
        authenBy: string,
        cmHmain: string,
        cmHmainOp: string,
        cmHmainSub: string,
        cmProcessprovince: string,
        cmMaininscl: string,
        cmSubinscl: string,
        paidModel: string,
        mastercupId: string,
        additionalHmains: any[],
        extraInfo: {
            authenByNHSO: boolean
        },
        claimCodeList: Array<string>,
        fullName: string,
        age: {
            years: number,
            days: number,
            months: number,
        },
        ermRegClaimTel: string,
        sexDesc: string,
        displayBirthDate: string,
        parseBirthDateOptional: string,
        lockState: string,
    }
};


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

export interface PatientClaim {
    id: number;
    pid: string;
    hnCode: string;
    titleName: string;
    fname: string;
    lname: string;
    sex: string;
    birthDate: string;
    mainInscl: Insurance;
    subInscl: SubInsurance;
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