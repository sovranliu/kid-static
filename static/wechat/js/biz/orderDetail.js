define(['url', 'helper'], function (url, helper) {

    var ticketType, ticketPrice, ticketRefundInsurance;

    function bindActions() {
        $('.js-minus-num').on('click', minusNum);
        $('.js-add-num').on('click', addNum);
        $('.js-switch-refundInsurance').on('change', setRefundInsurance);
        $('.js-buy-ticket').on('click', buyTicket);
    }

    function getUrlParams() {
        ticketType = helper.getQueryStr('type');
    }

    function initPage() {
        var $refundInsurance = $('.js-refund-insurance');

        if (ticketType == '1') {
            $refundInsurance.show();
        } else {
            $refundInsurance.hide();
        }
    }

    /*
    1，检查url是否有type参数，不存在就弹错，流程结束
    2，检查url是否有mobileno和openid，有一个没有就调prepayaction
    3，两个都有，则调payinfo，入参url上拿手机号，返回渲染数据
    4，点支付，调支付接口
    */
    function checkType() {
        if(!ticketType) {
            alert('您好，页面入口不合法，请注册后登陆购买。谢谢。');
            window.location.href = "Registerpage.html";
        }
    }

    function checkPhone() {
        var phone =  helper.getQueryStr('mobileNo');
        var openId =  helper.getQueryStr('openId');

        if(!phone || !openId) {
            helper.ajax(url.prepayAction, {}, function() {});
        }else{
            helper.ajax(url.payInfo, {"mobileNo": phone}, function() {
                var data = res.data;
                if(res.code == 0) {
                    $('.js-name').text(data.userName);
                    $('.js-phone').text(data.mobileNo);
                }
            })
        }
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

    function getTicketPrice() {
        var params = {};

        helper.ajax(url.getTicketPrice, params, function(res) {
            var data = res.data;

            if (res.code == 0) {
                ticketPrice = ticketType == '1' ? data.single : data.group;
                ticketRefundInsurance = data.refundInsurance;

                setRefundInsurance();
            } else {
                //toto
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
        var refundInsurance = ticketType == '1' ? Number($('.js-refundInsurance').text()) : 0;
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

            if (res.code == 0) {
                if (typeof WeixinJSBridge == "undefined") {
                   if ( document.addEventListener ) {
                       document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
                   } else if (document.attachEvent) {
                       document.attachEvent('WeixinJSBridgeReady', onBridgeReady); 
                       document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
                   }
                } else {
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
               if (res.err_msg == "get_brand_wcpay_request:ok") {
                    window.location.href = "PayResult.html";
               } else {
                    $('popup').show().find('p').html(res.msg)
               }
           }
       ); 
    }
    
    return {
        init: function () {
          bindActions();
          getUrlParams();
          initPage();
          checkTicketType();
          getTicketPrice();
        }
    }
});