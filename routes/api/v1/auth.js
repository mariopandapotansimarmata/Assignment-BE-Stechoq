const express = require('express')
const router = express.Router()
const helper = require(__class_dir + '/helper.class.js')
const authModule = require(__module_dir + '/auth.module.js')

router.post('/login', async function (req, res, next) {
  const { username, password } = req.body
  const loginResponse = await authModule.login(username, password)
  helper.sendResponse(res, loginResponse)
})

module.exports = router
