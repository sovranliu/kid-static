define(['url', 'helper'], function (url, helper) {

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
            }
        });
    }

    return {
        init: function () {
          bindActions();
        }
    }
});