$(function() {
    var baseURL = 'http://localhost:8888/'
    $.ajaxPrefilter(function(option) {
        option.beforeSend = function() {
            window.NProgress && window.NProgress.start()
        }
        option.url = baseURL + option.url
        if (option.url.lastIndexOf('admin/') !== -1) {
            option.headers = {
                Authorization: sessionStorage.getItem('mytoken')
            }
        }
        option.complete = function(res) {
            window.NProgress && window.NProgress.done()
            if (res.responseJSON && res.responseJSON.status === 401 && res.responseJSON.message === '身份认证失败！') {
                localStorage.removeItem('mytoken')
                parent.window.location.href = '../login1.html'
            }
        }
    })
})