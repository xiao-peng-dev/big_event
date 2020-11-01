$(function() {
    var layer = layui.layer
    var form = layui.form
    initCate()
    initEditor() // 初始化富文本编辑器
        // 调用分类
    function initCate() {
        $.ajax({
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                form.render()
            }
        })
    }
    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    $('#btnChooseImg').on('click', function() {
            $('#coverFile').click()
        })
        // 为coverFile绑定监听事件,设置图片
    $('#coverFile').on('change', function(e) {

        var file = e.target.files[0]
            // console.log(e.target)
            // 判断是否拿到了图片
        if (file === undefined) {
            return
        }
        // 根据选择的文件，创建一个对应的 URL 地址：
        var newImgURL = URL.createObjectURL(file)
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    // 定义文章状态
    var art_state = '已发布'


    // 给草稿按钮绑定点击事件
    $('#btnSave2').on('click', function() {
        art_state = '草稿'
    })

    // 为表单绑定提交事件
    $('#form-pub').on('submit', function(e) {
            e.preventDefault()
                // 获取表单的值
            var fb = new FormData($(this)[0])
            fb.append('state', art_state)
                // 放入图片
            $image
                .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                    width: 400,
                    height: 280
                })
                .toBlob(function(blob) { // 将 Canvas 画布上的内容，转化为文件对象
                    // 得到文件对象后，进行后续的操作
                    fb.append('cover_img', blob)
                        // 发送文章请求
                    publishArticle(fb)
                })

        })
        // 封装发布文章函数
    function publishArticle(fb) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fb,
            // 如果是formData形式的数据格式,必须加上两个必填项
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 跳转
                // location.href = '/article/art_list.html'
                setTimeout(function() {
                    window.parent.document.getElementById('art_list').click()
                }, 1500)
            }
        })
    }


})