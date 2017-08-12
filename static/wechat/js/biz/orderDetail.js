define(['url', 'helper'], function (url, helper) {

    var ticketType, openId, mobileNo, ticketPrice, ticketRefundInsurance;

    function bindActions() {
        $('.js-minus-num').on('click', minusNum);
        $('.js-add-num').on('click', addNum);
        $('.js-switch-refundInsurance').on('change', setRefundInsurance);
        $('.js-buy-ticket').on('click', buyTicket);
        $('.popup').on('click', '.js-confirm',function() {
            $popup.hide();
        });
    }

    function getUrlParams() {
        ticketType = helper.getQueryStr('type');
        openId =  helper.getQueryStr('openId');
        mobileNo = helper.getQueryStr('mobileNo');
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
    3，两个都有，则调payinfo，入参url上拿手机号和openid，返回渲染数据
    4，点支付，调支付接口
    */
    function checkType() {
        if(!ticketType) {
            alert('您好，页面入口不合法，请注册后登陆购买。谢谢。');
            window.location.href = "Registerpage.html";
        }
        checkPhone();
    }

    function checkPhone() {
        if(!mobileNo || !openId) {
            helper.ajax(url.prepay,{},function() {})
        }else{
            helper.ajax(url.payInfo,{"mobileNo":mobileNo,"openId":openId},function(res) {
                if(res.code >= 0) {
                    var data = res.data;
                    $('.js-name').text(data.user.name);
                    $('.js-phone').text(data.user.mobileNo);
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

            if (res.code >= 0) {
                ticketPrice = ticketType == '1' ? (data.single / 100) : (data.group / 100);
                ticketRefundInsurance = data.refundInsurance / 100;

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
        var total = Number(ticketPrice * ticketNum + refundInsurance);

        $('.js-price').text(!isNaN(total) ? total : '' );
    }

    function buyTicket() {
        var ticketNum = ticketType == '1' ? 1 : Number($('.js-current-num').val());
        var needRefundInsurance = $('.js-switch-refundInsurance').is(':checked');
        var insurance = 0;
        var goodsType;

        if(needRefundInsurance) {
            insurance = 1000;
        }
        switch(ticketType) {
            case "0":
                goodsType = 20000 + ticketNum;
                break;
            case "1":
                goodsType = 10000 + insurance + 1;
                break;
        }
        
        var params = {
            "goodsType":goodsType,
            "openId":openId,
            "mobileNo":mobileNo
        };


        helper.ajax(url.buyTicket, params, function(res) {
            var data = res.data;
            if (res.code >= 0) {
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
               "nonceStr":data.nonceString, //随机串     
               "package":"prepay_id=" + data.prepayId ,     
               "signType":"MD5",         //微信签名方式：     
               "paySign":data.signature//微信签名 
           },
           function(res){  
               if (res.err_msg == "get_brand_wcpay_request:ok") {
                    window.location.href = "PayResult.html";
               } else {
                    $('popup').show().find('p').html(res.err_msg)
               }
           }
       ); 
    }
    
    return {
        init: function () {
          bindActions();
          getUrlParams();
          checkType();
          initPage();
          checkTicketType();
          getTicketPrice();
        }
    }
});