import { PrismaClient } from "@prisma/client";
import fastify from "fastify";
import {z} from 'zod'

const app = fastify()

const prisma = new PrismaClient()

app.get('/users', async (request, reply) => {
    const users = await prisma.user.findMany();
    return reply.send(users);
});


app.post('/users', async (request, reply) => {
    const createuserSchema = z.object({
        name: z.string(),
        email: z.string().email(),
    })


    const {name, email} = createuserSchema.parse(request.body)

    await prisma.user.create({
        data: {
            name,
            email,
        }
    })

    return reply.status(201).send()
})

const port = process.env.PORT ? Number(process.env.PORT) : 3000;
app.listen({
    host: '0.0.0.0',
    port: port
}).then(() => {
    console.log('listening on port ' + port)
});

process.on('SIGTERM', async () => {
    await prisma.$disconnect();
    process.exit(0);
});

