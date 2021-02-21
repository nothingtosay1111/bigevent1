$(function() {
    let id = new URLSearchParams(location.search).get('id')

    function loadCommentList() {
        $.ajax({
            type: 'get',
            url: 'http://localhost:8888/api/articles/' + id + '/comments',
            success: function(res) {
                if (res.status === 0) {
                    var arr = ['<h4><i class="sprites"></i>评论区</h4>']
                    res.data.forEach(function(item) {
                        arr.push(`
              <div class="kr_comment_card">
                <div class="img-wrap">
                  <img src="./uploads/avatar_3.jpg" alt="">
                </div>
                <div class="info">
                  <p>${item.uname} · <span>2020-08-16</span></p>
                  <p>${item.content}</p>
                </div>
                <a href="javascript:;" class="like">${item.count}</a>
              </div>
            `)
                    })

                    $('#comment-list').html(arr.join(''))
                }
            }
        })
    }

    loadCommentList()


    $('#comment-form').submit(function(e) {
        e.preventDefault()
        let fd = $(this).serialize()
        $.ajax({
            type: 'post',
            url: 'http://localhost:8888/api/articles/' + id + '/comments',
            data: fd,
            success: function(res) {
                if (res.status === 0) {
                    layer.msg(res.message)
                    $('#comment-form').get(0).reset()
                    loadCommentList()
                }
            }
        })
    })
})