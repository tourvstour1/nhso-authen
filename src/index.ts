import { Elysia } from 'elysia'
import Services from './service'

const port = Bun.env['PORT'] as unknown as number
const app: Elysia = new Elysia()
const service = new Services()

service.setAutoAuthen()

app
    .get('/', () => service.authen())
    .get('/getClaim', () => new Services().getClaim())
    .listen(port, () => {
        console.log('server nhso auth start on port: ' + port)
    })