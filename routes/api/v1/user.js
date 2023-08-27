const express = require('express')
const router = express.Router()
const helper = require(__class_dir + '/helper.class.js')
const m$user = require(__module_dir + '/user.module.js')

// Route to add a user
router.post('/', async function (req, res, next) {
  const addUserResponse = await m$user.addUser(req.body)
  helper.sendResponse(res, addUserResponse)
})

// Route to delete a user
router.delete('/:username', async function (req, res, next) {
  const username = req.params.username
  const deleteUserResponse = await m$user.deleteUser(username)
  helper.sendResponse(res, deleteUserResponse)
})

// Route to update user's password
router.put('/:username/update-password', async function (req, res, next) {
  const username = req.params.username
  const { newPassword } = req.body
  const updatePasswordResponse = await m$user.updatePassword(
    username,
    newPassword
  )
  helper.sendResponse(res, updatePasswordResponse)
})

module.exports = router
