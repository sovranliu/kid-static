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

        helper.ajax(url.getUserInfo, params, function(res) {
            var data = res.data;
            if(res.code == 0) {
                $('.js-name').text(data.userName);
                $('.js-phone').text(data.telephone);
            }
            
        });
    }

    function getTicketPrice() {
        var params = {};

        helper.ajax(url.getTicketPrice, params, function(res) {
            var data = res.data;
            if(res.code == 0) {
                ticketPrice = ticketType == '1' ? data.single : data.group;
                ticketRefundInsurance = data.refundInsurance;

                setRefundInsurance();
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
            'ticketType': ticketType,
            'ticketNum': ticketNum,
            'needRefundInsurance': needRefundInsurance
        };

        helper.ajax(url.buyTicket, params, function(res) {
            var data = res.data;
            if(res.code == 0) {
                if (typeof WeixinJSBridge == "undefined"){
                   if( document.addEventListener ){
                       document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
                   }else if (document.attachEvent){
                       document.attachEvent('WeixinJSBridgeReady', onBridgeReady); 
                       document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
                   }
                }else{
                    onBridgeReady(res);
                }
            }
        });
    }

    function onBridgeReady(res){
        var data = res.data;
       WeixinJSBridge.invoke(
           'getBrandWCPayRequest', {
               "appId":data.appId,     //公众号名称，由商户传入     
               "timeStamp":data.timestamp,         //时间戳，自1970年以来的秒数     
               "nonceStr":data.nonceStr, //随机串     
               "package":data.package,     
               "signType":"MD5",         //微信签名方式：     
               "paySign":data.paySign//微信签名 
           },
           function(res){     
               if(res.err_msg == "get_brand_wcpay_request:ok" ) {
                    window.location.href = "PayResult.html";
               }else{
                    $('popup').show().find('p').html(res.msg)
               }
           }
       ); 
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