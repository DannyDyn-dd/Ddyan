// 定义用户路由处理函数，供 /router/user.js 模块进行调用

// 导入数据库操作模块
const db = require('../db/index');

// 使用 bcryptjs 对用户密码进行加密
// 导入 bcryptjs
const bcrypt = require('bcryptjs');

// 12. 用这个包来生成 Token 字符串
const jwt = require('jsonwebtoken');
// 13. 导入全局的配置文件
const config = require('../config');

// 注册用户的处理函数
exports.regUser = (req, res) => {
  // 接收表单数据
  // Object.getOwnPropertyNames(userinfo0) 获取对象属性名，JSON.parse()将string转换为object数据
  // const userinfo = JSON.parse(Object.getOwnPropertyNames(req.body)[0]);
  const userinfo = req.body;
  // console.log(userinfo);

  // 判断数据是否合法
  if (!userinfo.username || !userinfo.password) {
    // return res.send({ status: 1, message: '用户名或密码不能为空！' });
    return res.cc('用户名或密码不能为空！');
  }

  // 定义查询 username 的SQL 语句
  const sql = `select * from users where username=?`

  // 执行 SQL 语句并根据结果判断用户名是否被占用
  db.query(sql, [userinfo.username], function (err, results) {
    // 执行 SQL 语句失败
    if (err) {
      // return res.send({ status: 1, message: err.message });
      return res.cc(err);
    }
    // 用户名被占用
    if (results.length > 0) {
      // return res.send({ status: 1, message: '用户名被占用，请更换其他用户名！' })
      return res.cc('用户名被占用，请更换其他用户名！');
    }
    // res.send('reguser OK');

    // TODO: 用户名可用，继续后续流程...
    // 确认用户名可用之后，调用 bcrypt.hashSync(明文密码, 随机盐的长度) 方法，对用户的密码进行加密处理：
    // 对用户的密码,进行 bcrype 加密，返回值是加密之后的密码字符串
    userinfo.password = bcrypt.hashSync(userinfo.password, 10)

    // 定义插入用户的 SQL 语句
    const sql = 'insert into users set ?'
    // 调用 db.query() 执行 SQL 语句，插入新用户
    db.query(sql, { username: userinfo.username, password: userinfo.password }, function (err, results) {
      // 执行 SQL 语句失败
      if (err) return res.send({ status: 1, message: err.message })
      // SQL 语句执行成功，但影响行数不为 1
      if (results.affectedRows !== 1) {
        // return res.send({ status: 1, message: '注册用户失败，请稍后再试！' })
        return res.cc('注册用户失败，请稍后再试！');
      }
      // 注册成功
      // res.send({ status: 0, message: '注册成功！' })
      res.cc('注册成功！');
    })
  })

  // res.send('reguser OK');
}

// 登录的处理函数
exports.login = (req, res) => {
  // 接收表单数据
  const userinfo = req.body
  // 定义 SQL 语句
  const sql = `select * from users where username=?`
  // 执行 SQL 语句，查询用户的数据
  db.query(sql, userinfo.username, function (err, results) {
    // 执行 SQL 语句失败
    if (err) return res.cc(err)
    // 执行 SQL 语句成功，但是查询到数据条数不等于 1
    if (results.length !== 1) return res.cc('登录失败！用户名不存在或错误。')
    // res.send('reguser OK');


    // TODO：判断用户输入的登录密码是否和数据库中的密码一致
    // 拿着用户输入的密码,和数据库中存储的密码进行对比
    const compareResult = bcrypt.compareSync(userinfo.password, results[0].password)
    // 如果对比的结果等于 false, 则证明用户输入的密码错误
    if (!compareResult) {
      return res.cc('登录失败！密码错误。')
    }
    // res.send('reguser OK');

    // TODO：登录成功，生成 Token 字符串
    // 通过 ES6 的高级语法，快速剔除 密码 的值
    // 剔除完毕之后，user 中只保留了用户的 id, username
    const user = { ...results[0], password: '' };
    // 对用户的信息进行加密，生成 token 字符串
    const tokenStr = jwt.sign(user, config.jwtSecretKey, { expiresIn: config.expiresIn });
    // 调用 res.send() 将生成的 Token 字符串响应给客户端
    res.send({
      status: 0,
      message: '登录成功！',
      // 为了方便客户端使用 Token，在服务器端直接拼接上 Bearer 的前缀
      token: 'Bearer ' + tokenStr,
  })
  })

  // res.send('login OK');
}
