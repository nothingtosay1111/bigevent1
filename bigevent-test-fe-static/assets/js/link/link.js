$(function () {
  var form = layui.form

  function loadLinksInfo () {
    $.ajax({
      type: 'get',
      url: 'admin/links',
      success: function (res) {
        var tags = template('table-tpl', res)
        $('.layui-table tbody').html(tags)
      }
    })
  }

  loadLinksInfo()

  // 删除友情链接
  $('.layui-table tbody').on('click', '.delete', function (e) { 
    var id = $(e.target).data('id')
    layer.confirm('确实要删除吗？', function (index) {
      $.ajax({
        type: 'delete',
        url: 'admin/links/' + id,
        success: function (res) {
          if (res.status === 0) {
            // 删除成功
            layer.close(index)
            loadLinksInfo()
          }
        }
      })
    })
  })

  // 编辑友情链接
  $('.layui-table tbody').on('click', '.edit', function (e) {
    var id = $(e.target).data('id')
    // 获取链接数据
    $.ajax({
      type: 'get',
      url: 'admin/links/' + id,
      success: function (res) {
        var index = layer.open({
          type: 1,
          title: '编辑友情链接',
          content: $('#edit-form-tpl').html(),
          area: ['500px', '350px']
        })
        // 设置预览图片效果
        $('#preIcon').attr('src', 'http://localhost:8888/uploads/' + res.data.linkicon)
        // 初始化表单数据
        delete res.data.linkicon
        form.val('editForm', res.data)
        
        // 绑定文件上传按钮点击事件
        $('#urlIcon').click(function () {
          $('#linkFile').click()
        })
        // 监听文件选中事件
        let file = null
        $('#linkFile').change(function (e) {
          const objectURL = URL.createObjectURL(e.target.files[0])
          file = e.target.files[0]
          $('#preIcon').attr('src', objectURL)
        })

        // 绑定表单提交事件
        $('#edit-form').submit(function (e) {
          e.preventDefault()
          var fd = new FormData(this)
          if (file) {
            fd.append('linkicon', file)
          }
          $.ajax({
            type: 'put',
            url: 'admin/links/' + id,
            data: fd,
            processData: false,
            contentType: false,
            success: function (res) {
              if (res.status === 0) {
                // 编辑成功
                layer.close(index)
                loadLinksInfo()
              }
            }
          })
        })
      }
    })
  })

  // 添加友情链接
  $('#add-link').click(function () {
    var index = layer.open({
      type: 1,
      title: '添加友情链接',
      content: $('#add-form-tpl').html(),
      area: ['500px', '350px']
    })
    // 绑定文件上传按钮点击事件
    $('#urlIcon').click(function () {
      $('#linkFile').click()
    })
    // 监听文件选中事件
    $('#linkFile').change(function (e) {
      const objectURL = URL.createObjectURL(e.target.files[0])
      $('#preIcon').attr('src', objectURL)
    })
    // 绑定添加链接的提交事件
    $('#add-form').submit(function (e) {
      e.preventDefault()
      var fd = new FormData(this)
      $.ajax({
        type: 'post',
        url: 'admin/links',
        data: fd,
        processData: false,
        contentType: false,
        success: function (res) {
          if (res.status === 0) {
            // 关闭窗口
            layer.close(index)
            // 刷新列表
            loadLinksInfo()
          }
        }
      })
    })
  })

})