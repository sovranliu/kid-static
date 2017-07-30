define(['url', 'helper'], function(url, helper) {

    function bindActions() {
        // $('.book-list').on('click','.js-revoke',_openRevoke);
        $('.js-confirm').on('click',function(){
            $('.popup').hide();
        });
    }


    //发送验证码
    function _getVerificationCode() {
        var num = $.trim($('.phone').val());
        var $btn = $('.code-btn');
        var params = {
            "mobileNumber":num
        };

        if(_checkMobileNumber()) {
            $btn.html("短信发送中");
            helper.ajax(url.getVerificationCode, params, function(res) {
                $btn.html(" 已发送");
            })
        }else{
            $('.popup').show();
        }
        
    }

    //验证手机号
    function _checkMobileNumber(num) {
        var reg = /^1[3|4|5|7|8][0-9]{9}$/; //验证规则
        return reg.test(num); //true
    }
    
    return {
        init: function() {
            bindActions();
            _changeTabs();
            _getTicketData();
            _getBookData();
        }
    }
});