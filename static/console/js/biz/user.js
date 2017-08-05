define(['url', 'helper', 'mustache'], function (url, helper, mustache) {

    var pageNum = 1;

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
            'limit': 20
        };

        return params;
    }

    function getUserList() {
        var params = buildSearchParams();

        helper.ajax(url.getUserList, params, function(data) {
            if (data.length == 0) {
                $('.js-tbody').html('<p class="dataNull">还没有注册会员信息</p>');
            } else {
                $('.js-tbody').html(mustache.render($('#tpl-tbody').html(), { 'data': data }));
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