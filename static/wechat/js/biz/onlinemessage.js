define(['url','helper','handshake'], function (url,helper,handshake) {

    function bindActions () {
        $('.js-submit').on('click',_postMessageData);
        $('.js-confirm').on("click", function () {
            $(".popup").hide();
            window.location.href = "MemberCenter.html"
        });
    }

    //提交留言
    function _postMessageData() {
        var content = $.trim($('.js-message').val());
        if(content != "") {
            var params = {
                "content":content
            };

            helper.ajax(url.postMessageData,params,function (res) {
                if(res.code >= 0) {
                    $(".popup").show();
                }
            })
        }else{
            $(".popup").show();
            $(".popup").find('p').html('请输入您咨询的问题。')
        }
        
    }

    return {
        init: function () {
            handshake.init();
            bindActions();
        }
    }
});