/*
  用户信息相关接口
*/
const express = require('express')
const router = express.Router()
const utils = require('utility')
const path = require('path')
const db = require(path.join(__dirname, '../common/db.js'))

// 路由配置

// 删除用户
router.delete('/users/:id', async (req, res) => {
  let param = req.params
  let sql = 'delete from user where id = ?'
  let info = await db.operateData(sql, [param.id])
  if (info && info.affectedRows > 0) {
    res.json({
      status: 0,
      message: '删除用户信息成功'
    })
  } else {
    res.json({
      status: 1,
      message: '删除用户信息失败'
    })
  }
})

// 根据id获取用户信息
router.get('/users/:id', async (req, res) => {
  let param = req.params
  let sql = 'select * from user where id = ?'
  let info = await db.operateData(sql, [param.id])
  if (info && info.length > 0) {
    res.json({
      status: 0,
      message: '获取用户信息成功',
      data: info[0]
    })
  } else {
    res.json({
      status: 1,
      message: '获取用户信息失败'
    })
  }
})

// 获取用户信息
router.get('/users', async (req, res) => {
  let param = req.query
  param.pagenum = parseInt(param.pagenum)
  param.pagesize = parseInt(param.pagesize)

  let sql = 'select id, username, nickname, email, user_pic from user where status = 2 limit ?, ?'
  let info = await db.operateData(sql, [param.pagesize * (param.pagenum - 1), param.pagesize])
  let csql = 'select count(*) as total from user where status = 2'
  let cret = await db.operateData(csql)
  if (info && info.length > 0) {
    res.json({
      status: 0,
      message: '获取用户信息成功！',
      data: info,
      total: cret[0].total
    })
  } else {
    res.json({
      status: 1,
      message: '获取用户信息失败！'
    })
  }
})

// 添加用户信息
router.post('/users', async (req, res) => {
  // 获取请求参数
  let param = req.body
  param.password = utils.md5(param.password)

  let checkSql = 'select id from user where username = ?'
  let flag = await db.operateData(checkSql, [param.username])
  console.log(flag)
  if (flag && flag.length > 0) {
    res.json({
      status: -1,
      message: '用户名已存在，请更换一个！'
    })
    return 
  }

  // 更新用户的信息
  let sql = 'insert user set ?'
  // 如果是增删改操作，那么返回对象；如果是查询，那么返回数组
  let ret = await db.operateData(sql, [{username: param.username, password: param.password, nickname: param.nickname, email: param.email, status: 2}])
  // 处理响应状态
  if (ret && ret.affectedRows > 0) {
    res.json({
      status: 0,
      message: '添加用户信息成功！'
    })
  } else {
    res.json({
      status: 1,
      message: '添加用户信息失败！'
    })
  }
})

// 重置密码
router.put('/users/:id', async (req, res) => {
  let param = req.params
  let password = utils.md5(req.body.password)
  let sql = 'update user set password = ? where id = ?'
  let ret = await db.operateData(sql, [password, param.id])
  if (ret && ret.affectedRows > 0) {
    res.json({
      status: 0,
      message: '重置密码成功！'
    })
  } else {
    res.json({
      status: 1,
      message: '重置密码失败！'
    })
  }
})


// 更新用户信息
router.put('/users', async (req, res) => {
  // 获取请求参数
  let param = req.body
  // 更新用户的信息
  let sql = 'update user set ? where id = ?'
  // 如果是增删改操作，那么返回对象；如果是查询，那么返回数组
  let ret = await db.operateData(sql, [{nickname: param.nickname, email: param.email}, param.id])
  // 处理响应状态
  if (ret && ret.affectedRows > 0) {
    res.json({
      status: 0,
      message: '修改用户信息成功！'
    })
  } else {
    res.json({
      status: 1,
      message: '修改用户信息失败！'
    })
  }
})

// 更新密码
// router.post('/updatepwd', async (req, res) => {
//   // 获取请求参数
//   let param = req.body
//   // 对密码进行加密处理
//   param.oldPwd = utils.md5(param.oldPwd)
//   param.newPwd = utils.md5(param.newPwd)
//   // 获取用户的id
//   let id = req.user.id
//   // 调用数据库方法进行更新操作
//   let sql = 'update user set password = ? where id = ? and password = ?'
//   let ret = await db.operateData(sql, [param.newPwd, id, param.oldPwd])
//   // 响应返回状态
//   if (ret && ret.affectedRows > 0) {
//     res.json({
//       status: 0,
//       message: '更新密码成功！'
//     })
//   } else {
//     res.json({
//       status: 1,
//       message: '更新密码失败！'
//     })
//   }
// })

module.exports = router