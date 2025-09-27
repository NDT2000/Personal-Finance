import bcrypt from 'bcryptjs'
import { User } from '../models/User.js'

export class AuthService {
  static async register(userData) {
    try {
      const { firstName, lastName, email, password } = userData
      
      // Check if user already exists
      const existingUser = await User.findByEmail(email)
      if (existingUser) {
        throw new Error('User with this email already exists')
      }
      
      // Hash password
      const saltRounds = 12
      const passwordHash = await bcrypt.hash(password, saltRounds)
      
      // Create user
      const user = await User.create({
        firstName,
        lastName,
        email,
        passwordHash
      })
      
      return {
        success: true,
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email
        }
      }
    } catch (error) {
      console.error('Registration error:', error)
      throw error
    }
  }

  static async login(email, password) {
    try {
      // Find user by email
      const user = await User.findByEmail(email)
      if (!user) {
        throw new Error('Invalid email or password')
      }
      
      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password_hash)
      if (!isPasswordValid) {
        throw new Error('Invalid email or password')
      }
      
      return {
        success: true,
        user: {
          id: user.id,
          firstName: user.first_name,
          lastName: user.last_name,
          email: user.email
        }
      }
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }
}