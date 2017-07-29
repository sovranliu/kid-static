define(['url','helper'], function (url,helper) {

    function bindActions () {
        $('.js-submit').on('click',_postMessageData);
        $('.js-confirm').on("click", function () {
            $(".popup").hide();
        });
    }

    //提交留言
    function _postMessageData() {
        var params = {
            "content":$.trim($('.js-message').val())
        };

        helper.ajax(url.postMessageData,params,function (res) {
            $(".popup").show();
        })
    }

    return {
        init: function () {
          bindActions();
        }
    }
});