$(function () {
  // 添加用户
  var form = layui.form

  form.verify({
    same: function (value) {
      var uname = $('.layui-form input[name=password]').val()
      if (value !== uname) {
        return '两次输入的密码不一样'
      }
    }
  })

  // 绑定添加用户表单提交事件
  $('.layui-form').submit(function (e) {
    e.preventDefault()
    var fd = $(this).serialize()
    $.ajax({
      type: 'post',
      url: 'admin/users',
      data: fd,
      success: function (res) {
        layer.msg(res.message)
      }
    })
  })
})