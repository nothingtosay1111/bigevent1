const express = require('express')
const cors = require('cors')
const path = require('path')
const jwt = require('express-jwt')
const loginRouter = require(path.join(__dirname, 'routers/login.js'))
const userRouter = require(path.join(__dirname, 'routers/user.js'))
const linkRouter = require(path.join(__dirname, 'routers/link.js'))
const swiperRouter = require(path.join(__dirname, 'routers/swiper.js'))
const commentRouter = require(path.join(__dirname, 'routers/comment.js'))
// 客户端路由
const indexRouter = require(path.join(__dirname, 'routers/custom/index.js'))
const listRouter = require(path.join(__dirname, 'routers/custom/list.js'))
const detailRouter = require(path.join(__dirname, 'routers/custom/detail.js'))

const app = express()

// 启动静态资源服务：把上传的图片变成静态资源
app.use('/uploads', express.static('uploads'))

// 处理客户端请求post参数
// for parsing application/json
app.use(express.json()) 
// for parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true })) 

// 设置跨域
app.use(cors())

app.use(jwt({secret: 'bigevent'}).unless({path: /^\/api/}))

// 设置路径
app.use('/api', loginRouter)
app.use('/admin', userRouter)
app.use('/admin', linkRouter)
app.use('/admin', swiperRouter)
app.use('/admin', commentRouter)
app.use('/api', indexRouter)
app.use('/api', listRouter)
app.use('/api', detailRouter)

// 统一处理不存在的路由
app.all('*', (req, res) => {
  res.status(404).json({
    status: 404,
    message: '请求额资源不存在！'
  })
})

// 添加一个中间件，统一处理异常信息
app.use((err, req, res, next) => {
  if (err.status === 401) {
    // token验证失败
    // status参数401表示http协议的响应状态码
    res.status(401).json({
      status: 401,
      message: '身份认证失败！'
    })
  } else {
    res.json({
      status: 500,
      message: '身份认证失败！'
    })
  }
})

app.listen(8888, () => {
  console.log('running...')
})
