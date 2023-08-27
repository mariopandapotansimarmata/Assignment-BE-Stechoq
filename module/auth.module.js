const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const config = require(`${__config_dir}/app.config.json`)
const mysql = new (require(`${__class_dir}/mariadb.class.js`))(config.db)

class AuthModule {
  async login(username, password) {
    try {
      const user = await this.getUserByUsername(username)
      console.log(user)
      if (!user) {
        return {
          status: false,
          code: 401,
          error: 'Authentication failed'
        }
      }
      console.log(password)
      console.log(user.password)
      const passwordMatch = await bcrypt.compare(password, user.password)
      console.log(passwordMatch)
      if (!passwordMatch) {
        return {
          status: false,
          code: 401,
          error: 'Authentication failed'
        }
      }

      const token = jwt.sign({ username: user.username }, 'config.secretKey', {
        expiresIn: '1h'
      })

      return {
        status: true,
        token
      }
    } catch (error) {
      console.error('Login Error:', error)
      return {
        status: false,
        code: 500,
        error: 'Internal server error'
      }
    }
  }

  async getUserByUsername(username) {
    try {
      const sql = {
        query: `SELECT * FROM pengguna WHERE username = ?`,
        params: [username]
      }

      const [user] = await mysql.query(sql.query, sql.params)
      return user || null
    } catch (error) {
      console.error('getUserByUsername Error:', error)
      throw error // Rethrow the error to be caught and handled higher up
    }
  }
}

module.exports = new AuthModule()
