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
            }else if(res.msg != null && res.msg != ""){
                $('.popup').show().find('p').html(res.msg)
            }
        })
    }

    //查看回复消息
    function _getMessageData() {
        var params = {};
        helper.ajax(url.getMessageData,params,function (res) {
            result = res;
            var $cmsg = $.cookie('message')
            var content = res.data.content;
            if(res.code >= 0) {
                if(!content) {
                    $('.red-dot').hide();
                }else{
                    var msg = content.length + content.substr(content.length-1,1) + content.substr(0,1);
                    if(msg != $cmsg) {
                        $('.red-dot').show();
                    }else{
                        result = "";
                        $('.red-dot').hide();
                    }
                }
            }else if(res.msg != null && res.msg != ""){
                $('.popup').show().find('p').html(res.msg)
            }
        })
    }

    function _showMessage() {
        $('.popup').show();
        $('.red-dot').hide();
        var data = result.data;
        if(!data || !data.content || data.content == "") {
            $('.popup').find('p').html('暂无回复');
        }else{
            var msg = data.content.length + data.content.substr(data.content.length-1,1) + data.content.substr(0,1);
            $.cookie('message',msg);
            $('.popup').find('p').html(data.content);
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