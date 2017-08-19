define(['url','helper'], function (url,helper) {

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
                    $(".popup").show().find('p').html('您的留言已成功提交，请至会员中心“最新消息”功能查看我们的回复，谢谢关注');
                }else if(res.msg != null && res.msg != ""){
                    $(".popup").show().find('p').html(res.msg)
                }
            })
        }else{
            $(".popup").show();
            $(".popup").find('p').html('请输入您咨询的问题。')
        }
        
    }

    return {
        init: function () {
          bindActions();
        }
    }
});