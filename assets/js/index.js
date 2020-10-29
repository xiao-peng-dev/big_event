$(function() {
    gteUserInfo()

    var layer = layui.layer
    $('#btnlogout').on('click', function() {
        layer.confirm('是否确定退出?', { icon: 3, title: '提示' }, function(index) {
            //do something
            localStorage.removeItem('token') //清空本地token
            location.href = '/login.html' //跳转登录页面
            layer.close(index); //关闭弹出层
        });
    })

})

function gteUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',

        success: function(res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取失败')
            }
            renderAvatar(res.data)
        }

    })
}


function renderAvatar(user) {
    var name = user.nickname || user.username
    $('#welcome').html('欢迎' + name)
    if (user.user_pic !== null) {
        $('.text-avatar').hide()
        $('.layui-nav-img').show().attr('src', user.user_pic)
    } else {
        var first = name[0].toUpperCase()
        $('.text-avatar').show().html(first)
        $('.layui-nav-img').hide()
    }
}