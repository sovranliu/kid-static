define(['mustache','url','helper'], function (Mustache,url,helper) {

    var userInfo,mobileNo,newMoileNo,result;

    function bindActions () {
        $('.js-userInfo').on('click',_openUserInfo);
        $('.js-submit').on('click',_postUserInfoData);
        $('.js-message').on('click',_showMessage)
        $('.js-confirm').on("click", hidePopup);
        $('.js-edit-popup').on('keyup','.js-telephone',_changeMobile);
        $('.js-edit-popup').on('click', '.js-send',_getVerificationCode);
    }

    //打开编辑弹框
    function _openUserInfo() {
        _getUserInfo();
        $('.js-edit-popup').show();
        userInfo.ismale = function(){  
            if(this.sex == 1 ){  
                return true;  
            }else{
                return false;  
            }  
        };
        var template = $('#template').html();
        Mustache.parse(template);
        $('.pop-list').html(Mustache.render(template, userInfo));
    }

    function _getUserInfo() {
        var params = {};
        helper.ajax(url.getUserInfo,params,function (res) {
            if(res.code >= 0) {
                userInfo = res.data;
                mobileNo = userInfo.telephone;
                if(userInfo.avatarUrl){
                    $('.user-img').attr('src',userInfo.avatarUrl);
                }
                $('.userInfo').html('姓名：' + userInfo.userName + '   |   会员级别：初级飞行员');
            }else{
                $('.userInfo').html('获取用户信息失败');
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
            "mobileNo": newMoileNo
        };
        $('.count').html('(60)秒');
        if (_checkMobileNumber(newMoileNo)) {
            //$btn.html("短信发送中");
            _loadingCodeTime($btn);
            helper.ajax(url.getVerificationCode, params, function(res) {
                if (res.code >= 0) {
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

        var sex = $('.js-sex').prop('checked') ? 1 : 2;

        params.userName = $.trim($('.js-username').val());
        params.telephone = $.trim($('.js-telephone').val());
        params.address = $.trim($('.js-address').val());
        params.code = $.trim($('.js-code').val());
        params.sex = sex;

        if(!_checkName(params.userName)) {
            $('.js-confirm-popup').show().find('p').html('姓名格式不正确');
            return;
        }
        if(!_checkMobileNumber(params.telephone)) {
            $('.js-confirm-popup').show().find('p').html('手机号码格式不正确');
            return;
        }

        helper.ajax(url.postUserInfo,params,function (res) {
            //todo 弹层提示成功
            if(res.code >= 0) {
                $('.js-edit-popup').hide();
                $('.js-confirm-popup').show().find('p').html('编辑成功。');
            }
        })
    }

    //查看回复消息
    function _getMessageData() {
        var params = {};
        helper.ajax(url.getMessageData,params,function (res) {
            result = res;
            var content = res.data.content;
            //取cookie中的msg，与返回的msg比较
            var $cmsg = $.cookie('message');

            if(res.code >= 0) {
                if(!content) {
                    $('.red-dot').hide();
                }else{
                    var msg = content.length + content.substr(content.length-1,1) + content.substr(0,1);
                    if(msg != $cmsg) {
                        $('.red-dot').show();
                    }else{
                        $('.red-dot').hide();
                    }
                }
            }
        })
    }

    //验证手机号
    function _checkMobileNumber(num) {
        var reg = /^1[3|4|5|7|8][0-9]{9}$/; //验证规则
        return reg.test(num); //true
    }
    
    function _showMessage() {
        $('.js-confirm-popup').show();
        var content = result.data.content;
        if(!content) {
            $('.js-confirm-popup').find('p').html('暂无回复');
        }else{
            var msg = content.length + content.substr(content.length-1,1) + content.substr(0,1);
            debugger
            $.cookie('message',msg);
            $('.js-confirm-popup').find('p').html(content);
        }
    }

     //验证姓名
    function _checkName(name) {
        var reg = /[a-zA-Z]{1,20}|[\u4e00-\u9fa5]{1,10}/; //验证规则
        return reg.test(name); //true
        
    }

    //关闭弹框
    function hidePopup(e) {
        $(e.currentTarget).closest('.popup').hide();
    }

    return {
        init: function () {
          bindActions();
          _getUserInfo();
          _getMessageData();
        }
    }
});