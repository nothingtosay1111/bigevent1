/*
  统一管理路由信息
*/
const express = require('express')
const path = require('path')
const utils = require('utility')
const jwt = require('jsonwebtoken')
const db = require(path.join(__dirname, '../common/db.js'))
const router = express.Router()

router.post('/login', async (req, res) => {
  // 获取客户端提交的参数
  let param = req.body
  console.log(param)
  // 注意：密码必须先进行加密
  param.password = utils.md5(req.body.password)
  // 根据用户名和密码查询数据库
  let sql = 'select id from user where username = ? and password = ?'
  let ret = await db.operateData(sql, [param.username, param.password])
  // 如果是查询，那么ret是数组，如果是增删改，那么ret是对象
  if (ret && ret.length > 0) {
    let token = jwt.sign({
      username: param.username,
      id: ret[0].id
    },'bigevent', {
      expiresIn: '1h'
    })
    res.json({
      status: 0,
      message: '登录成功',
      token: 'Bearer ' + token
    })
  } else {
    res.json({
      status: 1,
      message: '登录失败'
    })
  }
})

module.exports = router