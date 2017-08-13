define(['mustache','url','helper'], function (Mustache,url,helper) {

    var userInfo;
    function bindActions () {
        $('.js-userInfo').on('click',_openUserInfo);
        $('.js-submit').on('click',_postUserInfoData);
        $('.js-message').on('click',_getMessageData)
        $('.js-confirm').on("click", function () {
            $(".popup").hide();
        });
    }

    //打开编辑弹框
    function _openUserInfo() {
        _getUserInfo();
        $('.js-edit-popup').show();
        userInfo.ismale = function(){  
            if(this.sex == 0 ){  
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
                if(userInfo.avatarUrl){
                    $('.user-img').attr('src',userInfo.avatarUrl);
                }
                $('.userInfo').html('姓名：' + userInfo.userName + '   |   会员级别：初级飞行员');
            }else{
                $('.userInfo').html('获取用户信息失败');
            }
        })
    }

    //提交用户信息
    function _postUserInfoData() {
        var params = {};

        var sex = $('.js-sex').prop('checked') ? 1 : 2;

        params.userName = $.trim($('.js-username').val());
        params.telephone = $.trim($('.js-telephone').val());
        params.address = $.trim($('.js-address').val());
        params.sex = sex;

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
        $('.js-confirm-popup').show();
        helper.ajax(url.getMessageData,params,function (res) {
            var data = res.data;
            if(res.code >= 0) {
                if(!res.data.content) {
                    $('.js-confirm-popup').find('p').html('暂无回复');
                }else{
                    $('.js-confirm-popup').find('p').html("最新消息：" + res.data.content);
                }
            }
        })
    }

    return {
        init: function () {
          bindActions();
          _getUserInfo();
        }
    }
});