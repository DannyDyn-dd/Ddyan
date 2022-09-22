$(function () {
  // 注意获取数据时转换为数组 JSON.parse()   localStorage.getItem()
  var userinfo = JSON.parse(localStorage.getItem('loginUserinfo'))[0];
  // console.log(userinfo.token);
  localStorage.clear();

  // 获取用户基本信息

  $.ajax({
    type: 'GET',
    url: 'http://127.0.0.1:2114/my/userinfo',
    headers: {
      Authorization: userinfo.token
      // 便于测试-使用固定的token
      // Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MSwidXNlcm5hbWUiOiJhZG1pbiIsInBhc3N3b3JkIjoiIiwibmlja25hbWUiOiIxIiwiZW1haWwiOiIxQHFxLmNvbSIsInVzZXJfcGljIjoiZGF0YTppbWFnZS9wbmc7YmFzZTY0LFZFOVBUVUZPV1ZORlExSkZWRk09IiwiaWF0IjoxNjU4NjY4NzQ3LCJleHAiOjE2NTg3MDQ3NDd9.4q3Fe3hFizksUq0oHcSOxB2IJg838Hk88ZoeSUSUeEo'
    },
    success: backMessage => {
      // console.log(backMessage);
      // backMessage.data.username
      $('.descp').text('欢迎' + backMessage.data.username);
      // 渲染首页-用户基本信息
      $('.user-uname').text('用户名：' + backMessage.data.username);
      if (backMessage.data.nickname && backMessage.data.email) {
        $('.user-nname').text('昵称：' + backMessage.data.nickname);
        $('.user-email').text('用户名：' + backMessage.data.email);
      }

      const idNow = backMessage.data.id;
      // 保存 idNow 便于后续获取当前用户id
      var local = [];
      local.push({
        id: idNow
      });
      sessionStorage.setItem('idNow', JSON.stringify(local));
    }
  })
  $('.listLi').hide();
  $('.btn').on('click', () => {
    $('.listLi').slideToggle(
      () => {
        if ($('.aside-left').css('height') === '74px') {
          $('.aside-left').css('height', '151px');
        } else {
          $('.aside-left').css('height', '74px');
        }
      }
    );
  })
  $.extend({
    // 隐藏所有内容
    hideOther: () => {
      $('.shouye').hide();
      // $('.article-editor').hide();
      $('.article-list').hide();
      $('.recycleBin').hide();
      // $('.article-post').hide();
      // $('.all-post').hide();
      // $('.drafts').hide();
    },
    // 定义函数 —— 获取文章列表基本信息 - 渲染文章列表页面
    getArtCate: () => {
      // http://127.0.0.1:2114/my/article/cates GET请求
      $.ajax({
        type: 'GET',
        url: 'http://127.0.0.1:2114/my/article/cates',
        headers: {
          Authorization: userinfo.token
          // Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MSwidXNlcm5hbWUiOiJhZG1pbiIsInBhc3N3b3JkIjoiIiwibmlja25hbWUiOiIxIiwiZW1haWwiOiIxQHFxLmNvbSIsInVzZXJfcGljIjoiZGF0YTppbWFnZS9wbmc7YmFzZTY0LFZFOVBUVUZPV1ZORlExSkZWRk09IiwiaWF0IjoxNjU4NjY4NzQ3LCJleHAiOjE2NTg3MDQ3NDd9.4q3Fe3hFizksUq0oHcSOxB2IJg838Hk88ZoeSUSUeEo'
        },
        success: backMessage => {
          // console.log(backMessage);
          // console.log(backMessage.data[0]);

          // 每次渲染页面前，删除该元素所有子节点
          $('.artList-tb').empty();
          for (var i = 0; i < backMessage.data.length; i++) {
            var data = backMessage.data[i]
            // console.log(data);
            $('.artList-tb').append('<tr><td class="list-Id">' + data.Id + '</td><td>' + data.name + '</td><td>' + data.alias + '</td><td><a class="list-delete' + i + '" href="javascript:;">删除</a></td></tr>');
            // JQuery 循环绑定事件 $('#'+j).bind('click',{URL,url},clickHandler);
            // 注意 $.deleteHandler 不加小括号 否侧会立即执行
            $('.list-delete' + i).bind('click', { i: i }, $.deleteHandler);
          }
        }
      })
    },
    // 定义函数 —— 获取已删除文章基本信息 - 渲染回收站页面
    getRecycleBin: () => {
      // http://127.0.0.1:2114/my/article/catesBin GET请求
      $.ajax({
        type: 'GET',
        url: 'http://127.0.0.1:2114/my/article/catesBin',
        headers: {
          Authorization: userinfo.token
          // Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MSwidXNlcm5hbWUiOiJhZG1pbiIsInBhc3N3b3JkIjoiIiwibmlja25hbWUiOiIxIiwiZW1haWwiOiIxQHFxLmNvbSIsInVzZXJfcGljIjoiZGF0YTppbWFnZS9wbmc7YmFzZTY0LFZFOVBUVUZPV1ZORlExSkZWRk09IiwiaWF0IjoxNjU4NjY4NzQ3LCJleHAiOjE2NTg3MDQ3NDd9.4q3Fe3hFizksUq0oHcSOxB2IJg838Hk88ZoeSUSUeEo'
        },
        success: backMessage => {
          // console.log(backMessage);
          // console.log(backMessage.data[0]);

          // 每次渲染页面前，删除该元素所有子节点
          $('.recycleBin-tb').empty();
          for (var i = 0; i < backMessage.data.length; i++) {
            var data = backMessage.data[i]
            // console.log(data);
            $('.recycleBin-tb').append('<tr><td class="binList-Id">' + data.Id + '</td><td>' + data.name + '</td><td>' + data.alias + '</td><td><a class="binList-delete' + i + '" href="javascript:;">彻底删除</a></td></tr>');
            // JQuery 循环绑定事件 $('#'+j).bind('click',{URL,url},clickHandler);
            // 注意 $.deleteHandler 不加小括号 否侧会立即执行
            $('.binList-delete' + i).bind('click', { i: i }, $.peletelyDelete);
          }
        }
      })
    },
    // 定义删除数据函数
    deleteHandler: (event) => {
      var i = event.data.i;
      // console.log(i);
      // console.log(event);
      var Id = $('.list-delete' + i).parent().siblings('.list-Id').text();
      // console.log(Id);

      // 通过 Id 发起删除请求
      // http://127.0.0.1:2114/my/article/deletecate/:id GET请求
      $.ajax({
        type: 'GET',
        url: 'http://127.0.0.1:2114/my/article/deletecate/' + Id,
        headers: {
          Authorization: userinfo.token
          // Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MSwidXNlcm5hbWUiOiJhZG1pbiIsInBhc3N3b3JkIjoiIiwibmlja25hbWUiOiIxIiwiZW1haWwiOiIxQHFxLmNvbSIsInVzZXJfcGljIjoiZGF0YTppbWFnZS9wbmc7YmFzZTY0LFZFOVBUVUZPV1ZORlExSkZWRk09IiwiaWF0IjoxNjU4NjY4NzQ3LCJleHAiOjE2NTg3MDQ3NDd9.4q3Fe3hFizksUq0oHcSOxB2IJg838Hk88ZoeSUSUeEo'
        },
        success: backMessage => {
          // console.log(backMessage);
          if (backMessage.message === '删除文章分类成功！') {
            alert('删除成功');
            // 删除成功，重新渲染页面 调用并执行函数
            $.getArtCate();
            // 调用函数 getRecycleBin 获取已删除文章基本信息 - 重新渲染回收站页面
            $.getRecycleBin();
          }
        }
      })
    },
    // 定义彻底删除数据函数
    peletelyDelete: (event) => {
      var i = event.data.i;
      // console.log(i);
      // console.log(event);
      var Id = $('.binList-delete' + i).parent().siblings('.binList-Id').text();
      // console.log(Id);

      // 通过 Id 发起彻底删除请求
      // http://127.0.0.1:2114/my/article/peletelyDeletecate/:id GET请求
      $.ajax({
        type: 'GET',
        url: 'http://127.0.0.1:2114/my/article/peletelyDeletecate/' + Id,
        headers: {
          Authorization: userinfo.token
          // Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MSwidXNlcm5hbWUiOiJhZG1pbiIsInBhc3N3b3JkIjoiIiwibmlja25hbWUiOiIxIiwiZW1haWwiOiIxQHFxLmNvbSIsInVzZXJfcGljIjoiZGF0YTppbWFnZS9wbmc7YmFzZTY0LFZFOVBUVUZPV1ZORlExSkZWRk09IiwiaWF0IjoxNjU4NjY4NzQ3LCJleHAiOjE2NTg3MDQ3NDd9.4q3Fe3hFizksUq0oHcSOxB2IJg838Hk88ZoeSUSUeEo'
        },
        success: backMessage => {
          // console.log(backMessage);
          if (backMessage.message === '彻底删除文章分类成功！') {
            alert('彻底删除成功');
            // 删除成功，重新渲染回收站页面 调用并执行函数
            $.getRecycleBin();
          }
        }
      })
    }
  })

  // 调用函数 getArtCate 获取文章列表基本信息 - 渲染页面
  $.getArtCate();
  // 调用函数 getRecycleBin 获取已删除文章基本信息 - 渲染回收站页面
  $.getRecycleBin();

  $.hideOther();
  $('.shouye').show();
  // $('.li-article-editor').on('click', () => {
  //   $.hideOther();
  //   $('.article-editor').show();
  // })
  $('.li-article-list').on('click', () => {
    $.hideOther();
    $('.article-list').show();
  })
  $('.li-recycleBin').on('click', () => {
    $.hideOther();
    $('.recycleBin').show();
  })
  // $('.li-article-post').on('click', () => {
  //   $.hideOther();
  //   $('.article-post').show();
  // })
  // $('.li-all-post').on('click', () => {
  //   $.hideOther();
  //   $('.all-post').show();
  // })
  // $('.li-drafts').on('click', () => {
  //   $.hideOther();
  //   $('.drafts').show();
  // })
  $('.li-shouye').on('click', () => {
    $.hideOther();
    $('.shouye').show();
  })

  // 退出 —— 退回登录页面
  $('.out').on('click', () => {
    // window 提供的 history对象，与浏览器历史记录进行交互。
    // back() 后退功能
    window.history.back();
  })

  // 修改基本信息
  $('.changeBase-btn').on('click', (e) => {
    e.preventDefault();
    var idNow = JSON.parse(sessionStorage.getItem('idNow'))[0];
    // console.log(idNow);

    // http://127.0.0.1:2114/my/userinfo POST请求
    $.ajax({
      type: 'POST',
      url: 'http://127.0.0.1:2114/my/userinfo',
      headers: {
        Authorization: userinfo.token
        // Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MSwidXNlcm5hbWUiOiJhZG1pbiIsInBhc3N3b3JkIjoiIiwibmlja25hbWUiOm51bGwsImVtYWlsIjpudWxsLCJ1c2VyX3BpYyI6bnVsbCwiaWF0IjoxNjU4NTY1NDgwLCJleHAiOjE2NTg2MDE0ODB9.TAZeSZGjzanQzQaDGDRhNHflLyT6kyRVW_ny4FkTylE'
      },
      data: {
        Id: idNow.id,
        nickname: $('.nickBase').val(),
        email: $('.emailBase').val()
      },
      success: backMessage => {
        // console.log(backMessage);
        if (backMessage.message === '修改用户基本信息成功！') {
          alert(backMessage.message);
          sessionStorage.clear();
          // 渲染昵称和邮箱
          $('.user-nname').text('昵称：' + $('.nickBase').val());
          $('.user-email').text('邮箱：' + $('.emailBase').val());
          // 清空表单修改信息
          $('.nickBase').val('');
          $('.emailBase').val('');
        } else {
          alert('昵称和邮箱不能为空或不符合规范！请重新填写')
        }

      }
    })

  })
  // 更改密码
  $('.change-btn').on('click', (e) => {
    e.preventDefault();

    // http://127.0.0.1:2114/my/updatepwd POST请求
    $.ajax({
      type: 'POST',
      url: 'http://127.0.0.1:2114/my/updatepwd',
      headers: {
        Authorization: userinfo.token
        // Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MSwidXNlcm5hbWUiOiJhZG1pbiIsInBhc3N3b3JkIjoiIiwibmlja25hbWUiOm51bGwsImVtYWlsIjpudWxsLCJ1c2VyX3BpYyI6bnVsbCwiaWF0IjoxNjU4NTY1NDgwLCJleHAiOjE2NTg2MDE0ODB9.TAZeSZGjzanQzQaDGDRhNHflLyT6kyRVW_ny4FkTylE'
      },
      data: {
        oldPwd: $('.oldPwd').val(),
        newPwd: $('.newPwd').val()
      },
      success: backMessage => {
        // console.log(backMessage);
        if (backMessage.message === '原密码错误！') {
          alert(backMessage.message);
        } else if (backMessage.message === '更新密码成功！') {
          alert(backMessage.message);
          // 清空表单修改信息
          $('.oldPwd').val('');
          $('.newPwd').val('');
        } else if (backMessage.message === '"newPwd" contains an invalid value') {
          alert("原密码与新密码不能相同");
          $('.newPwd').val('');
        } else {
          alert('昵称和邮箱不能为空或不符合规范！请重新填写')
        }
      }
    })
  })
  // 更换头像
  $('.change-pic').on({
    mouseover: () => {
      $('.pic-model').css('display', 'block');
    },
    mouseout: () => {
      $('.pic-model').css('display', 'none');
    }

    // $('.picModel-btn').on('click', (e) => {
    //   e.preventDefault();
    //   $('.picModel-ipt').trigger('click');
    //   // $('.picModel-ipt').on('change', (e) => {
    //   //   // console.log(e.target);
    //   //   console.log(e.target.value);
    //   //   console.log(e.target.file);

    //   //   // $('.user-pic').css('src', e.target.value);
    //   // })
    //   // $('.picModel-ipt').on('change', (e) => {
    //   //   // console.log(e.target);
    //   //   console.log(e.target.value);

    //   //   var a = new FormData($(".pic-model")[0]);
    //   //   console.log(a);

    //   //   // 更换头像请求 http://127.0.0.1:2114/my/update/avatar POST
    //   //   $.ajax({
    //   //     url: 'http://127.0.0.1:2114/my/update/avatar',
    //   //     type: 'POST',
    //   //     data: {
    //   //       // avatar: new FormData($(".pic-model")[0])
    //   //       avatar: 'data:image/png;base64,VE9PTUFOWVNFQ1JFVFM='
    //   //     },
    //   //     headers: { //通过请求头将jwt数据发送到服务端
    //   //       Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MSwidXNlcm5hbWUiOiJhZG1pbiIsInBhc3N3b3JkIjoiIiwibmlja25hbWUiOiIxIiwiZW1haWwiOiIxQHFxLmNvbSIsInVzZXJfcGljIjoiZGF0YTppbWFnZS9wbmc7YmFzZTY0LFZFOVBUVUZPV1ZORlExSkZWRk09IiwiaWF0IjoxNjU4NjY4NzQ3LCJleHAiOjE2NTg3MDQ3NDd9.4q3Fe3hFizksUq0oHcSOxB2IJg838Hk88ZoeSUSUeEo'
    //   //     },
    //   //     // // processData 处理数据
    //   //     // processData: false, //设置jquery不处理表单数据
    //   //     // contentType: false, //设置jquery不处理表单编码
    //   //     success: backMessage => {
    //   //       console.log(backMessage);
    //   //       if (backMessage.message === '更新头像成功！') {
    //   //         //将原有头像更换成最新头像
    //   //         $(".user-pic").attr('src', 'data:image/png;base64,VE9PTUFOWVNFQ1JFVFM=');
    //   //       }
    //   //     },
    //   //     error(e) {
    //   //       console.log(e);
    //   //     }

    //   //   });

    //   // })
    // })

  })

  // 添加文章分类
  $('.list-add').on('click', () => {
    $('.listAdd-model').show();

    // 确认添加按钮，提交表单事件
    $('.add-btn').on('click', (e) => {
      e.preventDefault();
      var formData = $('.add-form').serialize();
      formData = decodeURIComponent(formData, true);//一次转码
      var arr = formData.split('&');
      var addName = arr[0].split('=')[1];
      var addAlias = arr[1].split('=')[1];

      // 添加文章列表 - 渲染页面
      // http://127.0.0.1:2114/my/article/addcates POST请求
      $.ajax({
        type: 'POST',
        url: 'http://127.0.0.1:2114/my/article/addcates',
        headers: {
          Authorization: userinfo.token
          // Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MSwidXNlcm5hbWUiOiJhZG1pbiIsInBhc3N3b3JkIjoiIiwibmlja25hbWUiOiIxIiwiZW1haWwiOiIxQHFxLmNvbSIsInVzZXJfcGljIjoiZGF0YTppbWFnZS9wbmc7YmFzZTY0LFZFOVBUVUZPV1ZORlExSkZWRk09IiwiaWF0IjoxNjU4NjY4NzQ3LCJleHAiOjE2NTg3MDQ3NDd9.4q3Fe3hFizksUq0oHcSOxB2IJg838Hk88ZoeSUSUeEo'
        },
        // ContentType: 'text/html;charset=utf-8',
        data: {
          name: addName,
          alias: addAlias
        },
        success: backMessage => {
          // console.log(backMessage);
          if (backMessage.message === '新增文章分类成功！') {
            $('input').val('');
            alert("添加成功");
            // Jquery 解绑事件 - ele.off('thing-name')
            // 添加成功 —— 关闭自身与取消按钮的点击事件 —— 防止后续缓存的事件造成多次触发
            $('.add-btn').off('click');
            $('.noadd-btn').off('click');
            $('.listAdd-model').hide();
            // 调用函数 getArtCate 获取文章列表基本信息 - 渲染页面
            $.getArtCate();
          } else {
            alert(backMessage.message);
          }
        }
      })
    })
    // 只触发一次
    $('.noadd-btn').one('click', () => {
      console.log(2);
      $('input').val('');
      // 取消添加 —— 关闭添加按钮的点击事件 —— 防止后续缓存的事件造成多次触发
      $('.add-btn').off('click');
      $('.listAdd-model').hide();
    })
  })

  // 删除文章分类 —— 生成了之后绑定事件 —— 获取文章列表基本信息中
  // 彻底删除文章分类 —— 生成了之后绑定事件 —— 获取已删除基本信息中
})