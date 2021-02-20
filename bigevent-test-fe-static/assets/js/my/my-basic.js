$(function () {
  // 获取Layui的form对象
  var form = layui.form

  // 调用接口加载用户信息
  function loadUserInfo () {
    $.ajax({
      type: 'get',
      url: 'my/userinfo',
      success: function (res) {
        // 把数据填充到表单
        // $('#form input[name=id]').val(res.data.id)
        // $('#form input[name=username]').val(res.data.username)
        // $('#form input[name=nickname]').val(res.data.nickname)
        // $('#form input[name=email]').val(res.data.email)
        // 基于layui方式填充表单
        // basicForm是Form标签的lay-filter属性值，用于表单数据填充
        // form.val是layui提供的方法
        form.val('basicForm', res.data)
      }
    })
  }
  loadUserInfo()

  // 控制表单的提交
  $('#form').submit(function (e) {
    e.preventDefault()
    // id=185&username=mytest&nickname=asdfadsf&email=1232%40qq.com
    // 1、不需要username，需要删除
    // 2、需要id，id的值由隐藏域提供
    // var fd = $(this).serialize()
    // 此时，serializeArray的返回值fd是数组
    var fd = $(this).serializeArray()
    // 从数组中删除一个元素：先找到元素的索引，然后更加索引删除；使用数组filter方法
    fd = fd.filter(function (item) {
      // 属性名称不是username的被过滤处理
      return item.name !== 'username'
    })
    // 调用接口实现用户基本信息的修改
    $.ajax({
      type: 'post',
      url: 'my/userinfo',
      data: fd,
      success: function (res) {
        if (res.status === 0) {
          // 修改成功，提示一下即可
          layer.msg(res.message)
        }
      }
    })
  })
})