define(['url', 'helper'], function (url, helper) {

    var userId, ticketType, ticketPrice, ticketRefundInsurance;

    function bindActions() {
        $('.js-minus-num').on('click', minusNum);
        $('.js-add-num').on('click', addNum);
        $('.js-switch-refundInsurance').on('change', setRefundInsurance);
        $('.js-buy-ticket').on('click', buyTicket);
    }

    function getUrlParams() {
        userId = helper.getQueryStr('userId');
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

        helper.ajax(url.getUserInfo, params, function(res) {
            if (!res.code) {
                var data = res.data;

                $('.js-name').text(data.userName);
                $('.js-phone').text(data.telephone);
            } else {
                //todo
            }
        });
    }

    function getTicketPrice() {
        var params = {};

        helper.ajax(url.getTicketPrice, params, function(res) {
            if (!res.code) {
                var data = res.data;

                ticketPrice = ticketType == '1' ? data.single : data.group;
                ticketRefundInsurance = data.refundInsurance;

                setRefundInsurance();
            } else {
                //todo
            }
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
            'userId': userId,
            'type': ticketType,
            'ticketNum': ticketNum,
            'needRefundInsurance': needRefundInsurance,
            'totalPrice': Number($('.js-price').text())
        };

        helper.ajax(url.buyTicket, params, function(res) {
            if (!res.code) {
                //调起微信支付

            } else {
                //todo
            }
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