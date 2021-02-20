const express = require('express')
const path = require('path')
const fs = require('fs')
const db = require(path.join(__dirname, '../..//common/db.js'))
const router = express.Router()

// 获取文章列表
router.get('/articles', async (req, res) => {
  let param = req.query
  param.pagenum = parseInt(param.pagenum)
  param.pagesize = parseInt(param.pagesize)

  let sql = 'select * from article where state = "已发布" and is_delete = 0 limit ?, ?'
  let info = await db.operateData(sql, [param.pagesize * (param.pagenum - 1), param.pagesize])
  let csql = 'select count(*) as total from article where state = "已发布" and is_delete = 0 '
  let cret = await db.operateData(csql)
  if (info && info.length > 0) {
    res.json({
      status: 0,
      message: '获取文章列表成功！',
      data: info,
      total: cret[0].total
    })
  } else {
    res.json({
      status: 1,
      message: '获取文章列表失败！'
    })
  }
})

module.exports = router