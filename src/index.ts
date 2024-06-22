import { Elysia } from 'elysia'
import Test from './test/test.service'
import Services from './service'

const service = new Services()
service.setAutoAuthen()
new Elysia()
    .get('/', () => service.authen())
    .get('/getClaim', () => new Services().getClaim())
    .get('/user/:id', ({ params: { id } }) => id)
    .post('/form', ({ body }) => body)
    .listen(7000)