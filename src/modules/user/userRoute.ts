import { FastifyInstance } from 'fastify'
import { registerUserHandler } from './userController'

const userRoutes = async (server: FastifyInstance) => {
  server.post('/register', registerUserHandler)
}

export default userRoutes
