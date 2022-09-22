$(function () {
  // 在本地存储前，清空之前的存储数据
  localStorage.clear()

  // 直接绑定表单提交事件
  $('.btn-login').on('click', e => {
    e.preventDefault()
    var arr = $('.login').serialize().split('&')
    var username = arr[0].split('=')[1]
    var password = arr[1].split('=')[1]

    $.ajax({
      type: 'POST',
      url: 'http://127.0.0.1:2114/api/login',
      data: {
        username: username,
        password: password
      },
      success: backMessage => {
        // console.log(backMessage);
        if (backMessage.message === '"password" is not allowed to be empty') {
          alert('密码不能为空')
        } else if (backMessage.message === '"username" is not allowed to be empty') {
          alert('用户名不能为空')
        } else if (backMessage.message === '登录成功！') {
          alert(backMessage.message + '即将跳转到首页-个人中心')

          // 要使刷新页面数据不消失，使用本地存储 localStorage
          // 注意存储数据时转换为字符串 JSON.stringify()  localStorage.setItem()
          var local = []
          local.push({
            token: backMessage.token
          })
          localStorage.setItem('loginUserinfo', JSON.stringify(local))

          // console.log(true);
          // location.href = 'http://127.0.0.1:8080/src/index.html';
          // 使用git存储时，访问不了该URL地址
          // console.log(location.href.slice(0,-10) + 'index.html');
          location.href = location.href.slice(0, -10) + 'index.html'
        } else {
          alert('用户名或密码错误！请重新登录')
        }
      }
    })
  })
  $('.btn-reg').on('click', e => {
    e.preventDefault()
    // location.href = 'http://127.0.0.1:8080/src/reg.html';
    // 使用git存储时，访问不了该URL地址
    location.href = location.href.slice(0, -10) + 'reg.html'
  })
})
