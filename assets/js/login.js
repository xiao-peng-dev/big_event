$(function() {
    $('#link_reg').on('click', function() {
        $('.login-box').hide()
        $('.reg-box').show()
    })
    $('#link_login').on('click', function() {
        $('.login-box').show()
        $('.reg-box').hide()
    })

    //添加自定义规则
    var form = layui.form
    form.verify({
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        // 确认密码添加规则
        repwd: function(value) {
            var pwd = $('.reg-box input[name=password]').val()
            if (value !== pwd)
                return '两次输入的密码不一致,请重试!'
        }
    })

    var layer = layui.layer // 引入layer
    $('#form_reg').on('submit', function(e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/api/reguser',
            data: {
                username: $('.reg-box [name=username]').val(),
                password: $('.reg-box [name=password]').val()
            },
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg('注册成功,请登录!')
                $('#link_login').click()
                $('#form_reg')[0].reset()
            }
        })
    })


    // 登录
    $('#form_login').submit(function(e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/api/login',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg('登录成功!')
                localStorage.setItem('token', res.token)
                    // 跳转
                location.href = '/index.html'
            }
        })
    })


})