define(['url', 'helper'], function(url, helper) {

    function bindActions() {
        $('.js-submit').on('click',_postRegisterData);
        $('.js-confirm').on('click', function() {
            $('.popup').hide();
        });
    }


    //发送验证码
    function _getVerificationCode() {
        var phone = $.trim($('.phone').val());
        var $btn = $('.code-btn');
        var params = {
            "mobileNumber": phone
        };

        if (_checkMobileNumber()) {
            $btn.html("短信发送中");
            helper.ajax(url.getVerificationCode, params, function(res) {
                $btn.html(" 已发送");
            })
        } else {
            $('.popup').show();
            $('.popup').find('p').html('请输入正确的手机号码');
        }

    }

    //发送注册信息
    function _postRegisterData() {
        var name = $.trim($('.name').val());
        var phone = $.trim($('.phone').val());
        var code = $.trim($('.code').val());

        var params = {
            "mobileNumber":phone,
            "code":code,
            "name":name
        }

        if(name != "" && code != "" && _checkMobileNumber()) {
            helper.ajax(url.postRegister, params, function(res) {
                window.location.href = "MemberCenter.html";
            })
        }else{
            $('.popup').show();
            $('.popup').find('p').html('请完善输入内容');
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
        }
    }
});