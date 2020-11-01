$(function() {
    var layer = layui.layer
        // 定义时间过滤器
    template.defaults.imports.dateFormat = function(data) {
        var dt = new Date(data)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())
        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss

    }

    function padZero(n) {
        return n > 9 ? n : '0' + n
    }
    // 1.定义一个参数,请求数据时将其传入
    var q = {
        pagenum: 1, //页码值,默认1页
        pagesize: 2, //页数显示数据的条数
        cate_id: '', //文章分类的id
        state: '' //发布状态
    }
    initTable()
    initCate()
    var form = layui.form
        // 2.获取列表
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                layer.msg('获取成功!')
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                renderPage(res.total)
            }


        })
    }

    // 3.分类
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {

                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message)
                var htmlStr = template('tpl-cate', res)
                    // console.log(htmlStr)
                $('[name=cate_id]').html(htmlStr)
                form.render() //渲染表单区域
            }
        })
    }

    // 4.给筛选按钮绑定提交事件
    $('#form-search').on('submit', function(e) {
        e.preventDefault()
            // 获取
        var state = $('[name=state]').val()
        var cate_id = $('[name=cate_id]').val()
            // 赋值
        q.state = state
        q.cate_id = cate_id
            // 渲染
        initTable()
    })

    // 设置分页
    var laypage = layui.laypage

    function renderPage(total) {
        laypage.render({
            elem: 'pageBox', //注意，这里的 test1 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: q.pagesize,
            curr: q.pagenum,
            // 分页模块设置,显示哪些子模块
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            // 切换分页时,回调jump
            // 1.点击页码时调用jump函数
            // 2.调用laypage.render也会触发jump-死循
            jump: function(obj, first) {
                // console.log(obj.curr); //得到当前页
                q.pagenum = obj.curr
                q.pagesize = obj.limit
                    // 根据最新的q渲染列表
                if (!first) {
                    initTable()
                }
            }
        });
    }

    // 删除
    $('tbody').on('click', '.btn-delete', function() {
        var len = $('.btn-delete').length
            // 获取文章的id
        var id = $(this).attr('data-id')
        layer.confirm('确定要删除吗?', { icon: 3, title: '提示' }, function(index) {
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    layer.msg('删除成功!')
                        // 判断删除按钮是否大于1
                    if (len === 1) {
                        // 页码值最小必须是1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable()
                }
            })
            layer.close(index);

        });
    })
})