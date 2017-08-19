define(['mustache','url','helper','handshake'], function (Mustache,url,helper,handshake) {
    var mobileNo,newMoileNo;

    function bindActions () {
        $('.js-submit').on("click", _postUserInfoData);
        $('.js-confirm').on("click", _closePopup);
        $('.pi-list').on('keyup','.js-telephone',_changeMobile);
        $('.pi-list').on('click', '.js-send',_getVerificationCode);
    }

    //获取用户编辑过的信息
    function _getUserInfoData() {
        var params = {};
        helper.ajax(url.getUserInfo,params,function (res) {
            var data = res.data;
            if(res.code >= 0) {
                data.ismale = function(){  
                    if(this.sex == 1 ){  
                        return true;  
                    }else{
                        return false;  
                    }  
                };
                mobileNo = res.data.telephone;
                var template = $('#template').html();
                Mustache.parse(template);
                $('.pi-list').html(Mustache.render(template, data));
            } else if(res.msg != null && res.msg != ""){
                $('.popup').show().find('p').html(res.msg)
            }
        })
    }

    //检测用户是否修改手机
    function _changeMobile() {
        newMoileNo = $('.js-telephone').val();
        if(newMoileNo != mobileNo) {
            $('.js-send-item').removeClass('hide');
        }else{
            $('.js-send-item').addClass('hide');
        }
    }

    //发送验证码
    function _getVerificationCode() {
        var $btn = $('.code-btn');
        var params = {
            "mobileNo": newMoileNo,
            "new":true
        };
        $('.count').html('(60)秒');
        if (_checkMobileNumber(newMoileNo)) {
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
            $('.popup').show().find('p').html('请输入正确的手机号码');
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

    //提交用户信息
    function _postUserInfoData() {
        var params = {};
        var $pop = $('.popup');
        var sex = $('.js-sex').prop('checked') ? 1 : 2;

        params.userName = filteremoji($.trim($('.js-username').val()));
        params.telephone = $.trim($('.js-telephone').val());
        params.address = $.trim($('.js-address').val());
        params.code = $.trim($('.js-code').val());
        params.sex = sex;

        if(!_checkName(params.userName)) {
            $pop.show().find('p').html('姓名格式不正确');
            return;
        }

        if(!_checkMobileNumber(params.telephone)) {
            $pop.show().find('p').html('手机号码格式不正确');
            return;
        }

        helper.ajax(url.postUserInfo,params,function (res) {
            var data = res.data;
            if(res.code >= 0) {
                $pop.show().find('p').html('修改成功');
            }else{
                $pop.show().find('p').html('修改失败')
            }
        })
    }

    function _closePopup() {
        $(this).parent().parent('.popup').hide();
        if($(this).siblings("p").html() == "修改成功") {
            window.location.href = 'MemberCenter.html';
        }
    }

    //验证手机号
    function _checkMobileNumber(num) {
        var reg = /^1[3|4|5|7|8][0-9]{9}$/; //验证规则
        return reg.test(num); //true
    }

     //验证姓名
    function _checkName(name) {
        var reg = /[a-zA-Z]{1,20}|[\u4e00-\u9fa5]{1,10}/; //验证规则
        return reg.test(name); //true
        
    }

    function filteremoji(name){
        if(name != ""){
            var regRule = /\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g;
            if(name.match(regRule)) {
                //$('.popup').show().find('p').html('姓名格式错误');
                name = name.replace(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g, "");
            } 
        }
        return name
    }
    return {
        init: function () {
            handshake.init();
            bindActions();
            _getUserInfoData();
        }
    }
});