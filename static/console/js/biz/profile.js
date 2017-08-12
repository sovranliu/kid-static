define(['url', 'helper', 'message'], function (url, helper, msg) {


    function bindActions() {
        $('.js-save').on('click', saveProfile);
    }

    function initPage() {
        $('.js-username').val($.cookie('userName'));
    }

    function saveProfile() {
        var id = $.cookie('userName');
        var userName = $('.js-username').val();
        var password = $('.js-password').val();

        var params = {
            'id': id,
            'userName': userName,
            'password': password
        };

        if (!password || !userName) {
            msg.error('请填写管理员信息');
            return;
        }

        helper.ajax(url.modifyPassword, params, function(res) {
            if (res.code >= 0) {
                msg.success('信息更新成功');
            } else {
                msg.error('信息更新失败，请稍候重试');
            } 
        });
    }

    return {
        init: function () {
            bindActions();
            initPage();
        }
    }
});