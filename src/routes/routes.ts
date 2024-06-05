import { server } from '../app'
import fetchWOTD from './apis/fetchWOTD'

const registerRoutes = () => {
  // Auth Routes
  void server.register((server) => {
    server.register(fetchWOTD)
  })

  // Public Routes
}

export default registerRoutes
