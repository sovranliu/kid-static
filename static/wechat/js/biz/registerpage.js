define(['url', 'helper'], function(url, helper) {

    function bindActions() {
        $('.js-submit').on('click',_postRegisterData);
        $('.js-confirm').on('click', function() {
            $('.popup').hide();
        });
        $('.js-send').on('click',_getVerificationCode);
    }


    //发送验证码
    function _getVerificationCode() {
        var phone = $.trim($('.phone').val());
        var $btn = $('.code-btn');
        var params = {
            "mobileNumber": phone
        };

        if (_checkMobileNumber(phone)) {
            //$btn.html("短信发送中");
            _loadingCodeTime($btn);
            helper.ajax(url.getVerificationCode, params, function(res) {
                if(res.code == 0) {
                    $btn.html("已发送");
                }else{
                    $btn.html("重新发送");
                }
            })
        } else {
            $('.popup').show();
            $('.popup').find('p').html('请输入正确的手机号码');
        }

    }

    function _loadingCodeTime(dom) {
        //60秒后重新发送
        var $btnSend = $(".js-send");
        var $msg = $('.count');

        $btnSend.hide();
        $msg.show();

        var left_time = 60;
        var timeCount = window.setInterval(function(){
            left_time = left_time - 1;
            if (left_time <= 0) {
                window.clearInterval(timeCount);
                $msg.hide();
                $btnSend.show();
            }
            else {
                $msg.html('(' + left_time + ')秒后重新发送');
            }
        }, 1000);
    }  

    //发送注册信息
    function _postRegisterData() {
        var name = $.trim($('.name').val());
        var phone = $.trim($('.phone').val());
        var code = $.trim($('.code').val());

        var params = {
            "mobileNumber":phone,
            "code":code,
            "name":name,
            "openId":helper.getQueryStr('openId')
        }

        if(name != "" && code != "" && _checkMobileNumber()) {
            helper.ajax(url.postRegister, params, function(res) {
                if(res.code == 0) {
                    window.location.href = "MemberCenter.html";
                }
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