define(['mustache','url','helper'], function (Mustache,url,helper) {

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
        $('.js-edit-popup').show();
        _getUserInfo();
    }

    function _getUserInfo() {
        var params = {};
        helper.ajax(url.getUserInfo,params,function (res) {
            res.ismale = function(){  
                if(this.sex == 0 ){  
                    return true;  
                }else{
                    return false;  
                }  
            };
            var template = $('#template').html();
            Mustache.parse(template);
            $('.pop-list').html(Mustache.render(template, res));
        })
    }

    //提交用户信息
    function _postUserInfoData() {
        var params = {};

        var sex = $('.js-sex').prop('checked') ? 0 : 1;

        params.userName = $.trim($('.js-username').val());
        params.telephone = $.trim($('.js-telephone').val());
        params.address = $.trim($('.js-address').val());
        params.sex = sex;

        helper.ajax(url.postUserInfo,params,function (res) {
            //todo 弹层提示成功
            $('.js-edit-popup').hide();
            $('.js-confirm-popup').show().find('p').html('编辑成功。');
        })
    }

    //查看回复消息
    function _getMessageData() {
        var params = {};
        $('.js-confirm-popup').show();
        helper.ajax(url.getMessageData,params,function (res) {
            $('.js-confirm-popup').find('p').html(res.content);
        })
    }

    return {
        init: function () {
          bindActions();
        }
    }
});