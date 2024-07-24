import { Elysia, t } from 'elysia'
import { html } from '@elysiajs/html'
import { staticPlugin } from '@elysiajs/static';
import Services from './service'
import KtbService from './ktb/ktb.service';
import { ktbReceivePayloadSchema } from './ktb/ktb.entity';

const port = Bun.env['PORT'] as unknown as number
const app: Elysia = new Elysia()
const service = new Services()
const ktbServuce = new KtbService()

service.setAutoAuthen()

app.
    //App config
    use(staticPlugin({
        prefix: '/',
        alwaysStatic: true,
    }))
    .use(html())

    //NHSO APP    
    .get('/', () => service.authen()) 
    //KTB APP
    .get('/ktb', () => Bun.file('./public/index.html'))
    .post('/ktb-update', (req) => ktbServuce.receiveData(req.body), {
        body: ktbReceivePayloadSchema
    })

    //App Listen On
    .listen(port, () => {
        console.log('server nhso auth start on port: ' + port)
    })