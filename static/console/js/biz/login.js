define(['url', 'helper', 'message'], function (url, helper, msg) {

    var serialNumber;

    function bindActions() {
        $('.js-login').on('click',login);
    }
   
    function login() {
        var params = {
            "userName":$.trim($('.js-name').val()),
            "password":$.trim($('.js-pwd').val())
        }
        helper.ajax(url.getLogin, params, function(res) {
            if(res.code >= 0) {
                if (res && res.data) {
                    $.cookie('id', res.data.id);
                    $.cookie('userName', res.data.userName);
                }
                window.location.href = "config.html"
            } else {
                msg.error('帐号或密码错误，请重试！');
            }
        });
    }

    return {
        init: function () {
          bindActions();
        }
    }
});