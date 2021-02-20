const express = require('express')
const path = require('path')
const fs = require('fs')
const db = require(path.join(__dirname, '../..//common/db.js'))
const router = express.Router()

// 获取首页轮播图数据列表
router.get('/swipers', async (req, res) => {
  let sql = 'select * from swiper where swiperstatus = 1'
  let ret = await db.operateData(sql)
  if (ret && ret.length > 0) {
    res.json({
      status: 0,
      message: '查询轮播图成功',
      data: ret
    })
  } else {
    res.json({
      status: 1,
      message: '查询轮播图失败'
    })
  }
})

// 获取友情链接数据列表
router.get('/links', async (req, res) => {
  let sql = 'select * from link where linkstatus = 1'
  let ret = await db.operateData(sql)
  if (ret && ret.length > 0) {
    res.json({
      status: 0,
      message: '查询友情链接成功',
      data: ret
    })
  } else {
    res.json({
      status: 1,
      message: '查询友情链接失败'
    })
  }
})

module.exports = router