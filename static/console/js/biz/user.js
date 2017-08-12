define(['url', 'helper', 'mustache', 'message', 'paginator'], function (url, helper, mustache, msg, paginator) {

    var pageNum = 1, pageLimit = 20;

    function bindActions() {
        $('.js-search').on('click', getUserList);
        $('.js-reset').on('click', handleReset);
    }

    function initPage() {
        $('.js-filter-telephone').val(helper.getQueryStr('telephone') || '');
    }

    function handleReset() {
        $('.js-filter-input').val('');

        pageNum = 1;
        getUserList();
    }

    function buildSearchParams() {
        var userName = $('.js-filter-username').val();
        var telephone = $('.js-filter-telephone').val();

        var params = {
            'userName': $.trim(userName),
            'telephone': $.trim(telephone),
            'begin': pageNum,
            'limit': pageLimit
        };

        return params;
    }

    function getUserList() {
        var params = buildSearchParams();

        helper.ajax(url.getUserList, params, function(res) {
            var data = res.data;
            
            if (res.code >= 0) {
                if (!data || !data.list || data.list.length == 0) {
                    $('.js-tbody').html('<td colspan=6 class="dataNull">还没有注册会员信息</td>');
                } else {
                    $('.js-tbody').html(mustache.render($('#tpl-tbody').html(), { 'data': data.list }));

                    $('.js-tpage').createPage({
                        pageCount: Math.ceil(data.total / pageLimit),
                        current: pageNum,
                        backFn: function (selectedPageNum) {
                            pageNum = selectedPageNum;
                            getUserList();
                        }
                    });
                }
            } else {
                msg.error('获取会员数据失败，请稍候重试');
            } 
        });
    }

    return {
        init: function () {
            bindActions();
            initPage();
            getUserList();
        }
    }
});