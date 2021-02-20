$(function () {
  // 1、实现裁剪基本初始化效果
  var $image = $('.cropper-box img')
  var options = {
    // 纵横比
    aspectRatio: 1,
    // 指定预览区域
    preview: '.img-preview'
  }
  $image.cropper(options)

  // 2、绑定上传图片按钮的点击事件
  $('#uploadImg').click(function () {
    // 点击上传按钮，但是要触发file标签的点击行为
    $('#selectImg').trigger('click')
  })

  // 3、获取选中的文件的信息
  $('#selectImg').change(function (e) {
    // change事件触发条件：表单输入域内容发生变化时触发
    // 选中文件后触发该事件函数
    // 获取选中的文件信息
    var file = e.target.files[0]
    // 获取到文件信息后需要显示到左侧图片区域
    // URL.createObjectURL方法的作用：根据选中的文件生成一个预览URL地址
    var newImgURL = URL.createObjectURL(file)
    // 把地址更新到图片的src属性上即可
    $image.cropper('destroy')       // 销毁之前的裁剪区域
          .attr('src', newImgURL)   // 更新图片的路径
          .cropper(options)         // 重新生成一份新的裁剪区域
  })

  // 4、点击确定按钮进行文件上传
  $('#okbtn').click(function () {
    // 4-1、获取裁剪后的图片信息
    var imgURL = $image.cropper('getCroppedCanvas', {
      width: 100,
      height: 100
    })
    // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
    .toDataURL('image/png')
    // 4-2、把上述图片上传到服务器
    $.ajax({
      type: 'post',
      url: 'my/update/avatar',
      data: {
        avatar: imgURL
      },
      success: function (res) {
        if (res.status === 0) {
          // 更新成功：更新头像，并且提示
          layer.msg(res.message)
          // 更新头像（parent表示iframe的父窗口）
          window.parent.$.loadUserInfo()
        }        
      }
    })
  })
})