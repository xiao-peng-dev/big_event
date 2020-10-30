$(function() {
    var form = layui.form
    form.verify({
        nickname: function(value) {
            if (value.length > 6)
                return '昵称长度为1-6位'
        }
    })

    // 2.获取信息
    initUserInfo()
    var layer = layui.layer

    function initUserInfo() {
        $.ajax({
            url: '/my/userinfo',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 渲染到页面
                // console.log(res)
                form.val('formUserInfo', res.data)
            }
        })
    }

    // 3.表单重置
    $('#btnReset').on('click', function(e) {
        e.preventDefault()
        initUserInfo() //从新用户渲染
    })

    // 修改信息
    $('.layui-form').on('submit', function(e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg('修改成功!')
                window.parent.gteUserInfo()
            }
        })
    })
})