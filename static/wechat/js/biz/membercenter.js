define(['url','helper','handshake'], function (url,helper,handshake) {

    function bindActions () {
        $('.js-message').on('click',_getMessageData);
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
            }
        })
    }

    //查看回复消息
    function _getMessageData() {
        var params = {};
        $('.popup').show();
        helper.ajax(url.getMessageData,params,function (res) {
            if(res.code >= 0) {
                $('.popup').find('p').html(res.data.content);
            }
        })
    }

    return {
        init: function () {
            handshake.init();
            bindActions();
            _getUserInfoData();
        }
    }
});