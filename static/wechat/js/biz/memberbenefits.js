define(['url','helper','handshake'], function (url,helper,handshake) {

    function bindActions () {
        $('.js-submit').on('click',_postBenefitData);
        $('.js-confirm').on("click", function () {
            $(".popup").hide();
        });
    }

    //提交会员权益确认
    function _postBenefitData() {
        var isCheck = $('.js-check').prop('checked');
        if(isCheck) {
            var params = {};
            helper.ajax(url.postBenefit,params,function (res) {
                if(res.code == 0) {
                    window.history.go(-1);
                }
            })
        }else{
            $('.popup').show();
        }
    }

    return {
        init: function () {
          handshake.init();
          bindActions();
        }
    }
});