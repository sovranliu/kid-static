define(['url', 'helper', 'mustache'], function (url, helper, mustache) {

    var serialNumber,openId,mobileNo;

    function bindActions() {
        $('.js-buy-flightDiary').on('click', buyFlightDiary);
        $('.js-tab-item').on('click', switchTab);
        $('.popup').on('click', '.js-confirm',function() {
            $popup.hide();
        });
    }

    function getUrlParams() {
        serialNumber = helper.getQueryStr('serialNumber');
        openId =  helper.getQueryStr('openId');
        mobileNo = helper.getQueryStr('mobileNo');
    }

    function checkPhone() {
        if(!mobileNo || !openId) {
            helper.ajax(url.prepayAction,{},function() {})
        }else{
            helper.ajax(url.payInfo,{"mobileNo":mobileNo,"openId":openId},function() {
                if(res.code == 0) {
                    var data = res.data;
                    $('.js-name').text(data.user.userName);
                    $('.js-phone').text(data.user.mobileNo);
                }
            })
        }
    }

    function switchTab(e) {
        var $activeTab = $(e.currentTarget);
        var tabIndex = Number($activeTab.data('index'));

        $('.js-tab-item').removeClass('current');
        $('.js-tab-content').hide();

        $activeTab.addClass('current');
        $('.js-tab-content').eq(tabIndex).show();
    }

    function getFlightDiary() {
        var params = {
            'mobileNo': mobileNo
        };

        helper.ajax(url.getFlightDiary, params, function(res) {
            if(res.code == 0) {
                var data = res.data;
                if (data.canPurchase.length == 0) {
                    $('.js-video-can-purchase-list').html('<p class="dataNull">您还没有飞行礼品</p>');
                } else {
                    $('.js-video-can-purchase-list').html(mustache.render($('#videoTmpl').html(), { 'videoList': data.canPurchase }));
                }
                
                if (data.hasPurchased.length == 0) {
                    $('.js-video-has-purchase-list').html('<p class="dataNull">您还没有购买飞行礼品。</p>');
                } else {
                    $('.js-video-has-purchase-list').html(mustache.render($('#videoTmpl').html(), { 'videoList': data.hasPurchased }));
                }
                $('.js-timeDuration').html(data.timeDuration);
                $('.js-price').html(data.canPurchasePrice);
            }
        });
    }

    function buyFlightDiary() {
        var params = {
            "goodsType":'30000',
            "openId":openId
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
               "nonceStr":data.nonceString, //随机串     
               "package":"prepay_id=" + data.prepayId ,     
               "signType":"MD5",         //微信签名方式：     
               "paySign":data.signature//微信签名 
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
          getFlightDiary();
        }
    }
});