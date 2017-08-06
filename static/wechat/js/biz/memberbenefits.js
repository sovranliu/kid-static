define(['url','helper','handshake'], function (url,helper,handshake) {

    function bindActions () {
        $('.js-submit').on('click',_postBenefitData);
        $('.js-confirm').on("click", function () {
            $(".popup").hide();
        });
    }

    //提交会员权益确认
    function _postBenefitData() {
        window.history.go(-1);
    }

    return {
        init: function () {
          handshake.init();
          bindActions();
        }
    }
});