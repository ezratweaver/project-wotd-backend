import Fastify from 'fastify'
import dotenv from 'dotenv'
import registerRoutes from './routes/routes'

dotenv.config()

const port = Number.parseInt(process.env.API_PORT ?? '8080')
const host = process.env.API_HOST ?? '0.0.0.0'

export const server = Fastify({
  logger: true,
})

server.get('/', async () => {
  return { status: 'OK' }
})

const main = async () => {
  try {
    await server.listen({ port, host })
    console.log('Server ready at http://localhost:3000')
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

void main()
void registerRoutes()
