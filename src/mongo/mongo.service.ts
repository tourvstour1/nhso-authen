import DataBases from "../database/database";
import type { VisitModel } from "../visit/visit.entity";
import type { PatientClaimModel } from "./mongo.schema";

class MongoSerive extends DataBases {
    findVisitNotClaim = async (date: string) => {
        const findData = await this.mongo().collection('result_auth').find({
            'claimCode': undefined,
            'result': {
                '$ne': undefined
            }
        }, {
            projection: {
                _id: 0,
                result: {
                    id: 1,
                    pid: 1,
                    createdDate: 1,
                    receivedDateTime: 1
                }
            }
        }).toArray()
        return findData
    }

    updateClaimCode = async (claim: PatientClaimModel[]) => {
        const mongo = this.mongo().collection('result_auth')
        for (let item in claim) {
            await mongo.updateMany({
                "result.receivedDateTime": claim[item].receivedDateTime,
                "result.pid": claim[item].pid
            }, { $set: { 'claimCode': claim[item] } }).then(res => {
                console.log("update claim receivedDate:=" + claim[item].receivedDateTime + "update claim pid:=" + claim[item].pid + 'update claim code:=' + claim[item].claimCode);
            })
        }
    }

    findAuthMongo = async (visit: VisitModel[]) => {
        //   const pidList = (visit.map(i => i.patient_pid) as unknown as string[]).reduce((pre: string[], cur: string) => pre.includes(cur) ? pre : pre.concat(cur), [])
        const findData = await this.mongo().collection('result_auth').find({
            "payload.receivedDate": visit.map(i => i.date_visit)[0],
          //  "payload.receivedTime": { $in: visit.map(i => i.time_visit) },
            'claimCode': { "$ne": { undefined } },
            "result.status": {
                $in: ['SAVE', 200, 400]
            }
        }, {
            projection: {
                _id: 0,
                payload: {
                    pid: 1,
                    receivedDate: 1,
                    receivedTime: 1,
                }
            }
        }).toArray() as unknown as {
            payload: {
                pid: string,
                receivedDate: string,
                receivedTime: string,
                vn: string
            },
        }[]

  //      console.log(findData);
        
        return findData
    }

    createResultAuth = async (auth: any[]) => {
        const mongo = this.mongo().collection('result_auth')
        for (let e in auth) {

            const find = await mongo.find({
                "payload.receivedDate": auth[e].payload.receivedDate,
                "payload.pid": auth[e].payload.pid
            }).toArray()

            if (find.length === 0) {
                await mongo.insertOne(auth[e])
                console.log('insert ' + auth[e].pid);
            } else {
                // await mongo.updateOne({
                //     "payload.receivedDate": auth[e].payload.receivedDate,
                //     "payload.pid": auth[e].payload.pid
                // }, auth[e])

                console.log('update ' + auth[e].pid);

            }
        }

    }
}
export default MongoSerive