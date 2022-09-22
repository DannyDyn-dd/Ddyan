$(function () {
  // 直接绑定表单提交事件
  $('.btn-sub').on('click', (e) => {
    e.preventDefault();
    var arr = $('.reg').serialize().split('&');
    var username = arr[0].split('=')[1];
    var password = arr[1].split('=')[1];
    // console.log(username+'&'+password);
    // axios({
    //   method: 'POST',
    //   url: 'http://127.0.0.1:2114/api/reguser',
    //   data: JSON.stringify({
    //     username: username,
    //     password: password
    //   })
    // }).then( (res) => {
    //   console.log(res.data);
    //   if( res.data.message === '用户名被占用，请更换其他用户名！' ) {
    //     // console.log(true);
    //     $('.uname').val('');
    //     $('.pwd').val('');
    //   }
    // } )

    $.ajax({
      type: 'POST',
      url: 'http://127.0.0.1:2114/api/reguser',
      data: {
        username: username,
        password: password
      },
      success: backMessage => {
        // console.log(backMessage);
        if (backMessage.message === '用户名被占用，请更换其他用户名！') {
          alert(backMessage.message);
          // console.log(true);
        }
        else if (backMessage.message === '注册成功！') {
          alert(backMessage.message + '即将跳转到登录页面');
          // console.log(true);
          location.href = 'http://127.0.0.1:8080/src/login.html';
        }
        else alert('用户名(不能为空，1-10个字符)或密码(不能为空，6-12个字符)不符合规范');
      }
    })
  })
})