define(['mustache','url','helper'], function (Mustache,url,helper) {

    function bindActions () {
        $('.js-submit').on("click", _postUserInfoData);
    }

    //获取用户编辑过的信息
    function _getUserInfoData() {
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
            $('.pi-list').html(Mustache.render(template, res));
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
            alert('修改成功');
        })
    }

    return {
        init: function () {
          bindActions();
          _getUserInfoData();
        }
    }
});