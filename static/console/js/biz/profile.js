define(['url', 'helper', 'message'], function (url, helper, msg) {


    function bindActions() {
        $('.js-save').on('click', saveProfile);
    }

    function saveProfile() {
        var password = $('.js-password').val();
        //var userName = $('.js-userName').val();
        //var email = $('.js-email').val();
        //var phone = $('.js-phone').val();

        var params = {
            //'userName': ,
            'password': password,
            //'email': ,
            //'mobile': ,

        };

        if (!password) {
            msg.error('请填写密码');
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
        }
    }
});