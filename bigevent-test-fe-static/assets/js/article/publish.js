$(function () {
  // 导入表单对象
  var form = layui.form
  // 初始化下来选框
  // form.render('select')

  // 绑定表单提交事件
  // $('#add-form').submit(function (e) {
  //   e.preventDefault()
  //   // var fd = $(this).serialize()
  //   // 处理文件上传
  //   var fd = new FormData(this)
  //   $.ajax({
  //     type: 'post',
  //     url: 'my/article/add',
  //     data: fd,
  //     // 防止把请求参数转换为字符串
  //     processData: false,
  //     // 禁止使用默认的提交参数类型
  //     contentType: false,
  //     success: function (res) {
  //       console.log(res)
  //       if (res.status === 0) {
  //         layer.msg(res.message)
  //       }
  //     }
  //   })
  // })

  // 动态获取分类列表数据
  function loadListData () {
    $.ajax({
      type: 'get',
      url: 'my/article/cates',
      success: function (res) {
        // 基于模板引擎渲染列表数据
        var result = template('list-tpl', res)
        $('#cate-list').html(result)
        // layui要求调用render方法重新渲染下拉列表
        form.render('select')
      }
    })
  }
  loadListData()

  // 初始化富文本编辑器
  initEditor()

  // 处理文章封面的预览效果
  var $img = $('#image')
  var options = {
    // 纵横比
    aspectRatio: 400 / 280,
    // 预览的区域
    preview: '.img-preview'
  }
  $img.cropper(options)

  // 控制图片的选择
  $('#select-btn').click(function () {
    // 弹出一个选择文件的窗口
    $('#cover_img').trigger('click')
  })
  // 获取选中的文件内容
  $('#cover_img').change(function (e) {
    // 得到选中的文件内容
    var file = e.target.files[0]
    // 基于选中的文件创建一个临时预览地址
    var newImgURL = URL.createObjectURL(file)
    // 更新预览区图片地址
    $img.cropper('destroy')
        .attr('src', newImgURL)
        .cropper(options)
  })

  // 处理提交按钮的点击行为
  var state = ''
  $('.layui-btn').click(function () {
    var type = $(this).data('type')
    if (type === 'publish') {
      state = '已发布'
    } else if (type === 'temp') {
      state = '草稿'
    }
  })

  // 绑定提交按钮的事件
  $('#add-form').on('submit', function (e) {
    // 文章的状态处理
    e.preventDefault()
    // 生成文章封面图片
    $img
      .cropper('getCroppedCanvas', { 
        // 创建一个 Canvas 画布
        width: 400,
        height: 280
      })
      .toBlob(function (blob) {
        // 生成一张图片，用于上传操作
        // 在这里应该提交表单
        // 先获取表单元素
        var form = $('#add-form').get(0)
        var fd = new FormData(form)
        // 向fd当中继续添加新的数据
        fd.append('state', state)
        fd.append('cover_img', blob)
        // console.log(fd.get('title'))
        // console.log(fd.get('cate_id'))
        // console.log(fd.get('content'))
        // console.log(fd.get('cover_img'))
        // console.log(fd.get('state'))
        // 调用接口提交表单
        $.ajax({
          type: 'post',
          url: 'my/article/add',
          data: fd,
          // 防止把请求参数转换为字符串
          processData: false,
          // 禁止使用默认的提交参数类型
          contentType: false,
          success: function (res) {
            console.log(res)
            if (res.status === 0) {
              layer.msg(res.message)
            }
          }
        })
      })
  })
})