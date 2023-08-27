const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const helper = require(__class_dir + '/helper.class.js')
const taskModule = require(__module_dir + '/task.module.js') // Ganti dengan nama yang sesuai

// Middleware untuk validasi token JWT
function validateToken(req, res, next) {
  const token = req.header('Authorization')

  if (!token) {
    return res.status(401).json({
      status: false,
      error: 'Unauthorized'
    })
  }

  try {
    const decoded = jwt.verify(token, config.jwt.secretKey) // Menggunakan secretKey dari config
    req.user = decoded.username
    next()
  } catch (error) {
    return res.status(403).json({
      status: false,
      error: 'Invalid token'
    })
  }
}

// Middleware validasi token JWT akan diterapkan pada rute ini
router.post('/', validateToken, async function (req, res, next) {
  try {
    // Ambil username dari req.user yang telah diset oleh middleware
    const username = req.user

    // Panggil method addTask() dengan menyertakan username
    const addTaskResponse = await taskModule.addTask(req.body, username)

    helper.sendResponse(res, addTaskResponse)
  } catch (error) {
    helper.sendResponse(res, {
      status: false,
      code: 500,
      error: 'Internal server error'
    })
  }
})

// Middleware validasi token JWT akan diterapkan pada rute ini
router.put('/:taskId', validateToken, async function (req, res, next) {
  try {
    const taskId = req.params.taskId
    const updateTaskResponse = await taskModule.update(taskId, req.body)

    helper.sendResponse(res, updateTaskResponse)
  } catch (error) {
    helper.sendResponse(res, {
      status: false,
      code: 500,
      error: 'Internal server error'
    })
  }
})

// Middleware validasi token JWT akan diterapkan pada rute ini
router.delete('/:taskId', validateToken, async function (req, res, next) {
  try {
    const taskId = req.params.taskId
    const deleteTaskResponse = await taskModule.delete(taskId)

    helper.sendResponse(res, deleteTaskResponse)
  } catch (error) {
    helper.sendResponse(res, {
      status: false,
      code: 500,
      error: 'Internal server error'
    })
  }
})

module.exports = router
