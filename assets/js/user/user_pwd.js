$(function() {
    var form = layui.form
    form.verify({
        // 1.1
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        // 1.2
        somepwd: function(value) {
            if (value === $('[name=oldPwd]').val()) {
                return '两次输入的密码不能相同'
            }
        },
        repwd: function(value) {
            if (value !== $('[name=newPwd]').val()) {
                return '两次输入的密码不一致'
            }
        }
    })

    // 20修改密码
    var layer = layui.layer
    $('.layui-form').on('submit', function(e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg('修改成功!')
                $('.layui-form')[0].reset()
            }
        })
    })

})