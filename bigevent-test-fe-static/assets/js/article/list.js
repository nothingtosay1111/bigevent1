$(function () {
  // 获取表单对象
  var form = layui.form
  
  // 当前页码
  var pagenum = 1
  // 每页显示的条数
  var pagesize = 10

  // 补零函数
  function addZero(n) {
    return n < 10 ? '0' + n : n;
  }

  // 处理日期的格式化： 基于模板引擎的过滤器
  template.defaults.imports.formDate = function (data) {
    // 实现日期的格式化：把参数data日期字符串转换为日期对象
    var d = new Date(data)
    var year = d.getFullYear()
    var month = addZero(d.getMonth() + 1)
    var day = addZero(d.getDate())
    var hour = addZero(d.getHours())
    var minutes = addZero(d.getMinutes())
    var seconds = addZero(d.getSeconds())
    // return year + '-' + month + '-' + day + ' ' + hour + ':' + minutes + ':' + seconds
    return year + '-' + month + '-' + day
  }

  // 获取所有的文章分类数据
  function loadCateData () {
    $.ajax({
      type: 'get',
      url: 'my/article/cates',
      success: function (res) {
        // 基于模板引擎渲染分类列表数据
        var tags = template('cate-tpl', res)
        $('#category').html(tags)
        // 更新渲染select
        form.render('select')
      }
    })
  }
  loadCateData()

  // 获取表格列表数据
  function loadTableData (param) {
    $.ajax({
      type: 'get',
      url: 'my/article/list',
      data: param,
      success: function (res) {
        // 把数据填充到模板
        var tags = template('table-tpl', res)
        $('.layui-table tbody').html(tags)
      }
    })
  }
  loadTableData({
    // 页码：必须从1开始
    pagenum: pagenum,
    // 每页显示多少条数据
    pagesize: pagesize
  })

  // 搜索按钮事件绑定
  $('#search-form').submit(function (e) {
    e.preventDefault()
    // 获取筛选条件的索引参数
    var fd = $(this).serializeArray()
    // 组合接口调用参数
    var params = {
      // 页码：必须从1开始
      pagenum: pagenum,
      // 每页显示多少条数据
      pagesize: pagesize
    }
    // 把筛选条件参数添加param对象中
    fd.forEach(function (item) {
      // 向param对象中动态添加属性
      params[item.name] = item.value
    })

    // 刷新列表数据
    loadTableData(params)
  })

  // 绑定删除文章的事件
  $('body').on('click', '.delete', function (e) {
    // 获取要删除的文章id
    var id = $(this).data('id')
    // 确认是否删除
    var index = layer.confirm('确认要删除吗？', function () {
      // 调用接口删除文章，删除完成后，关闭窗口，并且刷新列表
      $.ajax({
        type: 'get',
        url: 'my/article/delete/' + id,
        data: {
          id: id
        },
        success: function (res) {
          if (res.status === 0) {
            // 删除成功
            layer.close(index)
            // 刷新列表
            loadTableData({
              // 页码：必须从1开始
              pagenum: pagenum,
              // 每页显示多少条数据
              pagesize: pagesize
            })
          }
        }
      })
    })
  })
  
})