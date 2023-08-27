const config = require(`${__config_dir}/app.config.json`)
const { debug } = config
const mysql = new (require(`${__class_dir}/mariadb.class.js`))(config.db)
const Joi = require('joi')
const bcrypt = require('bcrypt')

class _user {
  async addUser(data) {
    try {
      // Validate data
      const schema = Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required()
      }).options({
        abortEarly: false
      })

      const validation = schema.validate(data)

      if (validation.error) {
        const errorDetails = validation.error.details.map(
          (detail) => detail.message
        )

        return {
          status: false,
          code: 422,
          error: errorDetails.join(', ')
        }
      }

      // Hash the password synchronously
      const hashedPassword = bcrypt.hashSync(data.password, 10) // 10 is the salt rounds

      // Insert data to the database
      const sql = {
        query: `INSERT INTO pengguna (username, password) VALUES (?, ?)`,
        params: [data.username, hashedPassword]
      }

      const result = await mysql.query(sql.query, sql.params)
      return {
        status: true,
        data: result
      }
    } catch (error) {
      console.error('Error while adding user:', error)
      return {
        status: false,
        code: 500,
        error: 'Internal server error'
      }
    }
  }

  async updatePassword(username, newPassword) {
    try {
      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10)

      // Update user's password in the database
      const sql = {
        query: `UPDATE pengguna SET password = ? WHERE username = ?`,
        params: [hashedPassword, username]
      }

      const result = await mysql.query(sql.query, sql.params)
      return {
        status: true,
        data: result
      }
    } catch (error) {
      if (debug) {
        console.error('updatePassword Error: ', error)
      }
      return {
        status: false,
        error
      }
    }
  }
}

module.exports = new _user()
