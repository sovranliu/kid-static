define(['url','helper','handshake'], function (url,helper,handshake) {

    function bindActions () {
        $('.js-submit').on('click',_postBenefitData);
    }

    //提交会员权益确认
    function _postBenefitData() {
        window.location.href = "MemberCenter.html";
    }

    return {
        init: function () {
          handshake.init();
          bindActions();
        }
    }
});