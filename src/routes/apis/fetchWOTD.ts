import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'

const fetchWOTDHandler = (request: FastifyRequest, reply: FastifyReply) => {
  return { test: 'success' }
}

const fetchWOTD = (server: FastifyInstance) => {
  server.get('/test', fetchWOTDHandler)
}

export default fetchWOTD
