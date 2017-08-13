define(['mustache','url','helper','handshake'], function (Mustache,url,helper,handshake) {

    function bindActions () {
        $('.js-submit').on("click", _postUserInfoData);
        $('.js-confirm').on("click", _closePopup);
    }

    //获取用户编辑过的信息
    function _getUserInfoData() {
        var params = {};
        helper.ajax(url.getUserInfo,params,function (res) {
            var data = res.data;
            if(res.code >= 0) {
                data.ismale = function(){  
                    if(this.sex == 0 ){  
                        return true;  
                    }else{
                        return false;  
                    }  
                };
                var template = $('#template').html();
                Mustache.parse(template);
                $('.pi-list').html(Mustache.render(template, data));
            }
        })
    }

    //提交用户信息
    function _postUserInfoData() {
        var params = {};
        var $pop = $('.popup');
        var sex = $('.js-sex').prop('checked') ? 1 : 2;

        params.userName = $.trim($('.js-username').val());
        params.telephone = $.trim($('.js-telephone').val());
        params.address = $.trim($('.js-address').val());
        params.sex = sex;


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
        window.location.href = 'MemberCenter.html';
    }

    return {
        init: function () {
            handshake.init();
            bindActions();
            _getUserInfoData();
        }
    }
});