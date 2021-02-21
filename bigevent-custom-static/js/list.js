$(function() {
    var total = 10;

    var params = {
        pagenum: 1,
        pagesize: 6
    }
    var arr = [`
    <div class="kr_news_date">
      16 <span>08月</span>
    </div>
  `]

    function loadList() {
        if (total !== 0 && arr.length >= total) {
            return layer.msg('没有更多数据')
        }
        $.ajax({
            type: 'get',
            url: 'http://localhost:8888/api/articles',
            data: params,
            success: function(res) {
                if (res.status === 0) {
                    total = res.total
                    res.data.forEach(function(item) {
                        arr.push(`
              <div class="item">
                <h4>
                  <a href="./detail.html?id=${item.id}">${item.title}</a>
                </h4>
                <p class="meta">
                  <span>19分钟前 分享至</span>
                  <a href="javascript:;" class="wechat"></a>
                  <a href="javascript:;" class="weibo"></a>
                </p>
                <p class="brief">${item.content}</p>
              </div>
            `)
                    })
                    $('.kr_news_list').append(arr.join(''))
                }
            }
        })
    }

    loadList()
    $('.kr_more').click(function() {
        params.pagenum += 1
        loadList()
    })
})