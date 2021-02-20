const express = require('express')
const path = require('path')
const fs = require('fs')
const utils = require('utility')
const jwt = require('jsonwebtoken')
var multer  = require('multer')
var upload = multer({ dest: 'uploads/' }); // 设置上传目录，得到upload对象
const db = require(path.join(__dirname, '../common/db.js'))
const router = express.Router()

// 删除链接
router.delete('/links/:id', async (req, res) => {
  let id = req.params.id
  let sql = 'delete from link where id = ?'
  let ret = await db.operateData(sql, id)
  if (ret && ret.affectedRows > 0) {
    res.json({
      status: 0,
      message: '删除链接成功'
    })
  } else {
    res.json({
      status: 1,
      message: '删除链接失败'
    })
  }
})

// 根据id查询链接信息
router.get('/links/:id', async (req, res) => {
  let id = req.params.id
  let sql = 'select * from link where id = ?'
  let ret = await db.operateData(sql, id)
  if (ret && ret.length > 0) {
    res.json({
      status: 0,
      message: '获取链接成功',
      data: ret[0]
    })
  } else {
    res.json({
      status: 1,
      message: '获取链接失败'
    })
  }
})

// 编辑链接提交信息
router.put('/links/:id', upload.single('linkicon'), async (req, res) => {
  let params = req.params
  if (req.file) {
    params.linkicon = req.file.filename
  }
  let sql = 'update link set ? where id = ?'
  // 判断是否在编辑时上传了文件
  let info = {
    ...req.body
  }
  if (params.linkicon) {
    info.linkicon = params.linkicon
  }
  let ret = await db.operateData(sql, [info, req.params.id])
  if (ret && ret.affectedRows > 0) {
    res.json({
      status: 0,
      message: '编辑链接成功'
    })
  } else {
    res.json({
      status: 1,
      message: '编辑链接失败'
    })
  }
})

// 添加链接
router.post('/links', upload.single('linkicon'), async (req, res) => {
  let params = req.body
  params.linkicon = req.file.filename
  let sql = 'insert into link set ?'
  let ret = await db.operateData(sql, {
    linkname: params.linkname,
    linkurl: params.linkurl,
    linkdesc: params.linkdesc,
    linkicon: params.linkicon
  })
  if (ret && ret.affectedRows > 0) {
    res.json({
      status: 0,
      message: '添加链接成功'
    })
  } else {
    res.json({
      status: 1,
      message: '添加链接失败'
    })
  }
})

// 查询链接列表
router.get('/links', async (req, res) => {
  let param = req.query
  param.pagenum = parseInt(param.pagenum)
  param.pagesize = parseInt(param.pagesize)

  let csql = 'select * from link'
  let ret = await db.operateData(csql)
  if (ret && ret.length > 0) {
    res.json({
      status: 0,
      message: '获取链接信息成功！',
      data: ret
    })
  } else {
    res.json({
      status: 1,
      message: '获取链接信息失败！'
    })
  }
})

module.exports = router