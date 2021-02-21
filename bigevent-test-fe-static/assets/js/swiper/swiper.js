$(function() {
    var form = layui.form

    function loadSwiperList() {
        $.ajax({
            type: 'get',
            url: 'admin/swipers',
            success: function(res) {
                var tags = template('table-tpl', res)
                $('.layui-table tbody').html(tags)
            }
        })
    }

    loadSwiperList();

    $('.layui-table tbody').on('click', '.layui-badge', function(e) {
        let status = $(e.target).data('status')
        let id = $(e.target).data('id')
        $.ajax({
            type: 'put',
            url: 'admin/swipers/' + id,
            data: {
                status: status
            },
            success: function(res) {
                if (res.status === 0) {
                    layer.msg(res.message)
                    loadSwiperList()
                }
            }
        })
    })


    $('.layui-table tbody').on('click', '.delete', function(e) {
        var id = $(e.target).data('id')
        layer.confirm('确实要删除吗？', function(index) {
            $.ajax({
                type: 'delete',
                url: 'admin/swipers/' + id,
                success: function(res) {
                    if (res.status === 0) {
                        layer.close(index)
                        loadSwiperList()
                    }
                }
            })
        })
    })

    $('#uploadSwiper').click(function() {
        $('#myfile').click()
    })
    $('#myfile').change(function(e) {
        let files = e.target.files
        var fd = new FormData()
        $.each(files, function(index, item) {
            fd.append('swipers', item)
        })
        $.ajax({
            type: 'post',
            url: 'admin/swipers',
            data: fd,
            processData: false,
            contentType: false,
            success: function(res) {
                if (res.status === 0) {
                    layer.msg(res.message)
                    loadSwiperList()
                }
            }
        })
    })
})