import { AuthService } from '../services/authService.js'

export const authRoutes = {
  async register(req, res) {
    try {
      const result = await AuthService.register(req.body)
      res.status(201).json(result)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body
      const result = await AuthService.login(email, password)
      res.status(200).json(result)
    } catch (error) {
      res.status(401).json({ error: error.message })
    }
  }
}