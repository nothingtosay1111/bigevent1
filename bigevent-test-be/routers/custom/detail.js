const express = require('express')
const path = require('path')
const fs = require('fs')
const db = require(path.join(__dirname, '../..//common/db.js'))
const router = express.Router()

// 根据文章id查询文章的评论信息
router.post('/articles/:id/comments', async (req, res) => {
  let id = req.params.id
  let params = req.body
  console.log(params)
  let sql = 'insert into comment set ?'
  let ret = await db.operateData(sql, {
    uname: params.uname,
    content: params.content,
    articleid: parseInt(id),
    status: 1,
    count: 0,
    cdate: new Date()
  })
  if (ret && ret.affectedRows > 0) {
    res.json({
      status: 0,
      message: '添加文章评论成功'
    })
  } else {
    res.json({
      status: 1,
      message: '添加文章评论失败'
    })
  }
})

// 根据文章id查询文章的评论信息
router.get('/articles/:id/comments', async (req, res) => {
  let id = req.params.id
  let sql = 'select * from comment where status = 1 and articleid = ?'
  let ret = await db.operateData(sql, id)
  if (ret && ret.length > 0) {
    res.json({
      status: 0,
      message: '查询文章评论成功',
      data: ret
    })
  } else {
    res.json({
      status: 1,
      message: '查询文章评论失败'
    })
  }
})

module.exports = router