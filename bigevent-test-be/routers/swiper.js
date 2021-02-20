const express = require('express')
const path = require('path')
const utils = require('utility')
const jwt = require('jsonwebtoken')
const db = require(path.join(__dirname, '../common/db.js'))
var multer  = require('multer')
var upload = multer({ dest: 'uploads/' }); // 设置上传目录，得到upload对象
const router = express.Router()

// 切换swiper状态
router.put('/swipers/:id', async (req, res) => {
  let sql = 'update swiper set swiperstatus = ? where id = ?'
  console.log(req.params.id, req.body.status)
  let ret = await db.operateData(sql, [req.body.status, req.params.id])
  console.log(ret)
  if (ret && ret.affectedRows > 0) {
    res.json({
      status: 0,
      message: '切换状态成功'
    })
  } else {
    res.json({
      status: 1,
      message: '切换状态失败'
    })
  }
})

// 删除轮播图
router.delete('/swipers/:id', async (req, res) => {
  let id = req.params.id
  let sql = 'delete from swiper where id = ?'
  let ret = await db.operateData(sql, id)
  if (ret && ret.affectedRows > 0) {
    res.json({
      status: 0,
      message: '删除轮播图成功'
    })
  } else {
    res.json({
      status: 1,
      message: '删除轮播图失败'
    })
  }
})

// 查询轮播图列表数据
router.get('/swipers', async (req, res) => {
  let sql = 'select * from swiper'
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


// 上传轮播图
router.post('/swipers', upload.array('swipers', 20), (req, res) => {
  let files = req.files
  let arr = []
  files.forEach(item => {
    let sql = 'insert into swiper set ?'
    let ret = db.operateData(sql, {swiperimg: item.filename, swiperstatus: 1})
    arr.push(ret)
  })
  Promise.all(arr).then(result => {
    res.json({
      status: 0,
      message: '成功上传' + result.length + '张图片'
    })
  }).catch(err => {
    res.json({
      status: 1,
      message: '上传轮播图失败'
    })
  })
})

module.exports = router