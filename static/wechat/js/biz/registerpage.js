define(['url', 'helper'], function(url, helper) {
    var openId = helper.getQueryStr('openId');

    function bindActions() {
        $('.js-submit').on('click', _postRegisterData);
        $('.js-check').on('click', _checkMemberBenefit);
        $('.js-confirm').on('click', function() {
            $('.popup').hide();
        });
        $('.js-send').on('click', _getVerificationCode);
    }

    function _getAuth() {
        if (!openId || openId == "") {
            helper.ajax(url.getAuthorize, {}, function(res) {})
        }
    }

    function _getIsFollow() {
        helper.ajax(url.hasSubscribed, {
            "openId": openId
        }, function(res) {
            if (res.code >= 0) {
                if (!res.data) {
                    window.location.href = "FollowUs.html"
                }
            }
        })
    }

    //发送验证码
    function _getVerificationCode() {
        var phone = $.trim($('.phone').val());
        var $btn = $('.code-btn');
        var params = {
            "mobileNo": phone
        };
        $('.count').html('(60)秒');
        if (_checkMobileNumber(phone)) {
            //$btn.html("短信发送中");
            helper.ajax(url.getVerificationCode, params, function(res) {
                if (res.code >= 0) {
                    _loadingCodeTime($btn);
                    $btn.html("已发送");
                } else {
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
        var timeCount = window.setInterval(function() {
            left_time = left_time - 1;
            if (left_time <= 0) {
                window.clearInterval(timeCount);
                $msg.hide();
                $btnSend.show();
            } else {
                $msg.html('(' + left_time + ')秒');
            }
        }, 1000);
    }

    //发送注册信息
    function _postRegisterData() {
        var name = $.trim($('.name').val());
        var phone = $.trim($('.phone').val());
        var code = $.trim($('.code').val());

        var params = {
            "mobileNo": phone,
            "code": code,
            "name": filteremoji(name),
            "openId": helper.getQueryStr('openId')
        }

        if (name != "" && code != "" && _checkMobileNumber(phone) && _checkName(name)) {
            helper.ajax(url.postRegister, params, function(res) {
                if (res.code >= 0) {
                    window.location.href = "MemberCenter.html";
                }
            })
        } else {
            $('.popup').show();
            $('.popup').find('p').html('请确认姓名或手机格式是否正确');
        }
    }

    function _checkMemberBenefit() {
        var isCheck = $(this).prop('checked');
        if (isCheck) {
            setTimeout(function() {
                $('.js-mbship').css('display', 'none');
            }, 800)
        }
    }

    //验证姓名
    function _checkName(name) {
        var reg = /[a-zA-Z]{1,20}|[\u4e00-\u9fa5]{1,10}/; //验证规则
        return reg.test(name); //true
        
    }
    //验证手机号
    function _checkMobileNumber(num) {
        var reg = /^1[3|4|5|7|8][0-9]{9}$/; //验证规则
        return reg.test(num); //true
    }

    function filteremoji(name){
        if(name != ""){
            var regRule = /\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g;
            if(name.match(regRule)) {
                // $('.popup').find('p').html('姓名格式错误');
                // return;
                name = name.replace(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g, "");
            } 
        }
        return name
    }

    return {
        init: function() {
            _getAuth();
            _getIsFollow();
            bindActions();
        }
    }
});