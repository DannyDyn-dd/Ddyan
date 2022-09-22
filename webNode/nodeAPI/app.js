// 整个项目的入口文件


// 导入 express 模块
const express = require('express');
// 创建 express 的服务器实例
const app = express();
// const joi = require('@hapi/joi')
const joi = require('joi');


// 导入 cors 中间件
const cors = require('cors');
// 将 cors 注册为全局中间件
app.use(cors());

// 配置解析 application/x-www-form-urlencoded 格式的表单数据的中间件：
app.use(express.urlencoded({ extended: false }));


// 声明一个全局中间件，为 res 对象挂载一个 res.cc() 函数 ：
// 响应数据的中间件。一定要在路由之前封装 res.cc() 函数
app.use(function (req, res, next) {
  // status = 0 为成功； status = 1 为失败； 默认将 status 的值设置为 1，方便处理失败的情况
  res.cc = function (err, status = 1) {
    res.send({
      // 状态
      status,
      // 状态描述，判断 err 是 错误对象 还是 字符串
      message: err instanceof Error ? err.message : err,
    })
  }
  next()
})


// 导入全局的配置文件
const config = require('./config');
// 一定要在路由之前配置解析 Token 的中间件
const expressJWT = require('express-jwt');
// 使用 .unless({ path: [/^\/api\//] }) 指定哪些接口不需要进行 Token 的身份认证
// Error: algorithms should be set, 解决：添加algorithms:['HS256']
// app.use(expressJWT({ secret: config.jwtSecretKey, algorithms:['HS256'] }).unless({ path: [/^\/api\//] }));
// Error : expressJWT is not a function 版本问题 npm i express-jwt@5.3.3
// 使用 .unless({ path: [/^\/api\//] }) 指定哪些接口不需要进行 Token 的身份认证
app.use(expressJWT({ secret: config.jwtSecretKey }).unless({ path: [/^\/api\//] }))


// 导入并注册用户路由模块
const userRouter = require('./router/user');
app.use('/api', userRouter);

// 导入并使用用户信息路由模块
const userinfoRouter = require('./router/userinfo');
// 注意：以 /my 开头的接口，都是有权限的接口，需要进行 Token 身份认证
app.use('/my', userinfoRouter);

// 导入并使用文章分类路由模块
const artCateRouter = require('./router/artcate');
// 为文章分类的路由挂载统一的访问前缀 /my/article
app.use('/my/article', artCateRouter);


// 定义错误级别的中间件
app.use(function (err, req, res, next) {
  // 数据验证失败
  if (err instanceof joi.ValidationError) return res.cc(err);
  // 捕获身份认证失败的错误
  if (err.name === 'UnauthorizedError') return res.cc('身份认证失败！');
  // 未知错误
  res.cc(err);
})

// 调用 app.listen 方法，指定端口号并启动web服务器
app.listen(2114, function () {
  console.log('api server running at http://127.0.0.1:2114');
})
