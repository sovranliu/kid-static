define(['url', 'helper'], function (url, helper) {

    var ticketType, ticketPrice, ticketRefundInsurance;

    function bindActions() {
        $('.js-minus-num').on('click', minusNum);
        $('.js-add-num').on('click', addNum);
        $('.js-switch-refundInsurance').on('change', setRefundInsurance);
        $('.js-buy-ticket').on('click', buyTicket);
    }

    function getUrlParams() {
        ticketType = helper.getQueryStr('ticketType');
    }

    function checkTicketType() {
        if (ticketType == '1') {
            $('.js-num-single').show();
            $('.js-num-group').hide();
        } else {
            $('.js-num-single').hide();
            $('.js-num-group').show();
            setMinusButton();
        }
    }

    function getUserInfo() {
        var params = {};

        helper.ajax(url.getUserInfo, params, function(data) {
            $('.js-name').text(data.userName);
            $('.js-phone').text(data.telephone);
        });
    }

    function getTicketPrice() {
        var params = {};

        helper.ajax(url.getTicketPrice, params, function(data) {
            ticketPrice = ticketType == '1' ? data.single : data.group;
            ticketRefundInsurance = data.refundInsurance;

            setRefundInsurance();
        });
    }

    function minusNum() {
        var $currentNum = $('.js-current-num');
        var currentNum = Number($currentNum.val());

        currentNum > 3 && $currentNum.val(--currentNum);

        setMinusButton();
        calculateTotal();
    }

    function addNum() {
        var $currentNum = $('.js-current-num');
        var currentNum = Number($currentNum.val());

        $currentNum.val(++currentNum);

        calculateTotal();
    }

    function setMinusButton() {
        var $minusNum = $('.js-minus-num');
        var currentNum = Number($('.js-current-num').val());

        currentNum <= 3 ? $minusNum.addClass('disable') : $minusNum.removeClass('disable');
    }

    function setRefundInsurance() {
        var $refundInsuranceWrapper= $('.js-refundInsurance-wrapper');
        var $refundInsurance = $('.js-refundInsurance');
        var needRefundInsurance = $('.js-switch-refundInsurance').is(':checked');

        if (needRefundInsurance) {
            $refundInsuranceWrapper.show();
            $refundInsurance.text(ticketRefundInsurance);
        } else {
            $refundInsuranceWrapper.hide();
            $refundInsurance.text('');
        }

        calculateTotal();
    }

    function calculateTotal() {
        var ticketNum = ticketType == '1' ? 1 : Number($('.js-current-num').val());
        var refundInsurance = Number($('.js-refundInsurance').text()) || 0;
        var total = ticketPrice * ticketNum + refundInsurance;

        $('.js-price').text(total);
    }

    function buyTicket() {
        var ticketNum = ticketType == '1' ? 1 : Number($('.js-current-num').val());
        var needRefundInsurance = $('.js-switch-refundInsurance').is(':checked');

        var params = {
            'ticketType': ticketType,
            'ticketNum': ticketNum,
            'needRefundInsurance': needRefundInsurance
        };

        helper.ajax(url.buyTicket, params, function(data) {
            //调起微信支付
            wx.chooseWXPay({
                timestamp: data.timestamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                nonceStr: data.nonceStr, // 支付签名随机串，不长于 32 位
                package: data.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
                signType: 'MD5', // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                paySign: data.paySign, // 支付签名
                success: function (res) {
                    // 支付成功后的回调函数
                    window.location.href = 'PayResult.html';
                },
                error: function() {
                }
            });
        });
    }


    return {
        init: function () {
          bindActions();
          getUrlParams();
          checkTicketType();
          getUserInfo();
          getTicketPrice();
        }
    }
});