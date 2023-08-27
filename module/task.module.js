const config = require(`${__config_dir}/app.config.json`)
const { debug } = config
const mysql = new (require(`${__class_dir}/mariadb.class.js`))(config.db)
const Joi = require('joi')

class _task {
  add(data) {
    // Validate data
    const schema = Joi.object({
      item: Joi.string()
    }).options({
      abortEarly: false
    })
    const validation = schema.validate(data)
    if (validation.error) {
      const errorDetails = validation.error.details.map((detail) => {
        detail.message
      })

      return {
        status: false,
        code: 422,
        error: errorDetails.join(', ')
      }
    }

    // Insert data to database
    const sql = {
      query: `INSERT INTO task (items) VALUES (?)`,
      params: [data.item]
    }

    return mysql
      .query(sql.query, sql.params)
      .then((data) => {
        return {
          status: true,
          data
        }
      })
      .catch((error) => {
        if (debug) {
          console.error('add task Error: ', error)
        }

        return {
          status: false,
          error
        }
      })
  }
  update(taskId, newData) {
    // Validation logic for newData using Joi (similar to add method)
    const updateSchema = Joi.object({
      item: Joi.string()
    }).options({
      abortEarly: false
    })

    const validation = updateSchema.validate(newData)
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

    const sql = {
      query: 'UPDATE task SET items = ? WHERE id = ?',
      params: [newData.item, taskId]
    }

    return this.executeSqlQuery(sql)
  }

  delete(taskId) {
    const sql = {
      query: 'DELETE FROM task WHERE id = ?',
      params: [taskId]
    }

    return this.executeSqlQuery(sql)
  }

  executeSqlQuery(sql) {
    return mysql
      .query(sql.query, sql.params)
      .then((data) => {
        return {
          status: true,
          data
        }
      })
      .catch((error) => {
        if (debug) {
          console.error('SQL Error: ', error)
        }
        return {
          status: false,
          error
        }
      })
  }
}

module.exports = new _task()
