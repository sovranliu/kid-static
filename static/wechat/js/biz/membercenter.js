define(['url','helper','handshake'], function (url,helper,handshake) {

    var result;
    function bindActions () {
        $('.js-message').on('click',_showMessage);
        $('.js-confirm').on("click", function () {
            $(".popup").hide();
        });
    }

    //获取用户的信息
    function _getUserInfoData() {
        var params = {};
        helper.ajax(url.getUserInfo,params,function (res) {
            if(res.code >= 0) {
                $('.username').html(res.data.userName);
                if(res.data.avatarUrl) {
                    $('.user-img').attr('src',res.data.avatarUrl);
                }
            }
        })
    }

    //查看回复消息
    function _getMessageData() {
        var params = {};
        helper.ajax(url.getMessageData,params,function (res) {
            if(res.code >= 0) {
                result = res;
            }
        })
    }

    function _showMessage() {
        $('.popup').show();
        if(!result.data.content) {
            $('.popup').find('p').html('暂无回复');
        }else{
            $('.popup').find('p').html(result.data.content);
        }
    }

    return {
        init: function () {
            handshake.init();
            bindActions();
            _getUserInfoData();
            _getMessageData();
        }
    }
});