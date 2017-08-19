define(['url','helper','handshake'], function (url,helper,handshake) {

    function bindActions () {
        //$('.js-submit').on('click',_postBenefitData);
        $('.js-confirm').on("click", _closePopup);
    }

    //提交会员权益确认
    function _postBenefitData() {
        var $pop = $(".popup");
        var isCheck = $('.js-check').prop('checked');
        if(isCheck) {
            var params = {};
            helper.ajax(url.postBenefit,params,function (res) {
                $pop.show().find('p').html('感谢您已确认会员协议。');
            })
        }else{
            $pop.show().find('p').html('请确认协议。');
        }
    }

    //提交会员权益确认
    function _getBenefitData() {
        helper.ajax(url.getBenefit,{},function (res) {
            if(res.code >= 0) {
                if(res.data.check) {
                    $('.js-check').prop('checked',true).attr('disabled','disabled');
                    $('.js-submit').hide();
                }
            }
        })
    }

    function _closePopup() {
        $(this).parent().parent('.popup').hide();
        window.location.href = 'MemberCenter.html';
    }

    return {
        init: function () {
            handshake.init();
            bindActions();

        }
    }
});