import { MongoClient } from 'mongodb'
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { visit } from '../../db/schema/visit'
import { patient } from '../../db/schema/patient'
import { servicePoint } from '../../db/schema/servicePoint';
import { visitService } from '../../db/schema/visitService';
import { authenCode } from '../../db/schema/authen';
class DataBases {
    private postgres = () => {
        return new Pool({
            host: Bun.env['POSTGRES_HOST'],
            user: Bun.env['POSTGRES_USER'],
            password: Bun.env['POSTGRES_PASSWORD'],
            database: Bun.env['POSTGRES_DATABASE'],
            port: Bun.env['POSTGRES_PORT'] as unknown as number
        })
    }
    public db = drizzle(this.postgres(), { schema: { ...visit, ...patient, ...servicePoint, ...visitService, ...authenCode } })

    public mongo = () => {
        const mongoConnect = new MongoClient(Bun.env['URL_MONGO'] as unknown as string, {
            socketTimeoutMS: 5000,
        });
        console.log('connect mongodb')
        return mongoConnect.db('auth_nhso')
    }
}

export default DataBases