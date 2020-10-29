var baseUrl = 'http://ajax.frontend.itheima.net'
$.ajaxPrefilter(function(options) {
    options.url = baseUrl + options.url
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = { Authorization: localStorage.getItem('token') || '' }
    }
    // 3.
    options.complete = function(res) {
        console.log(res.responseJSON)
        var obj = res.responseJSON
        if (obj.status === 1 && obj.message === '身份认证失败！') {
            localStorage.removeItem('token')
            location.href = '/login.html'
        }
    }

})