const express = require('express')
const path = require('path')
const fs = require('fs')
const db = require(path.join(__dirname, '../common/db.js'))
const router = express.Router()

// 删除评论
router.delete('/comments/:id', async (req, res) => {
  let id = req.params.id
  let sql = 'update comment set status = 2 where id = ?'
  let ret = await db.operateData(sql, id)
  if (ret && ret.affectedRows > 0) {
    res.json({
      status: 0,
      message: '删除评论成功',
      data: ret
    })
  } else {
    res.json({
      status: 1,
      message: '删除评论失败'
    })
  }
})

// 获取评论列表
router.get('/comments', async (req, res) => {
  let sql = 'select * from comment where status = 1'
  let ret = await db.operateData(sql)
  if (ret && ret.length > 0) {
    res.json({
      status: 0,
      message: '查询评论列表成功',
      data: ret
    })
  } else {
    res.json({
      status: 1,
      message: '查询评论列表失败'
    })
  }
})

module.exports = router
