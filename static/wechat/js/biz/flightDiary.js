define(['url', 'helper', 'mustache','handshake'], function (url, helper, mustache,handshake) {

    var serialNumber;

    function bindActions() {
        $('.js-tab-item').on('click', switchTab);
        $('.js-buy-flightDiary').on('click', buyFlightDiary);
    }

    function getUrlParams() {
        serialNumber = helper.getQueryStr('serialNumber');
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
            'serialNumber': serialNumber
        };

        helper.ajax(url.getFlightDiary, params, function(res) {
            if(res.code == 0) {
                var data = res.data;
                var $dqVideoItem;
                var $ygVideoItem;
                var dqWidth = 0;
                var dqHeight = 0;
                var ygWidth = 0;
                var ygHeight = 0;

                if (data.canPurchase.length == 0) {
                    $('.js-video-can-purchase-list').html('<p class="dataNull">您还没有飞行礼品</p>');
                } else {
                    $('.js-video-can-purchase-list').html(mustache.render($('#videoTmpl').html(), { 'videoList': data.canPurchase, 'isPurchased': false }));
                }
                
                if (data.hasPurchased.length == 0) {
                    $('.js-video-has-purchase-list').html('<p class="dataNull">您还没有购买飞行礼品。</p>');
                } else {
                    $('.js-video-has-purchase-list').html(mustache.render($('#videoTmpl').html(), { 'videoList': data.hasPurchased, 'isPurchased': true }));
                }

                $('.js-timeDuration').html(data.timeDuration);
                $('.js-price').html(data.canPurchasePrice);
                
                var timer = setInterval(function() {
                    if (document.getElementsByTagName("video")[0].readyState != 0) {
                        $dqVideoItem = $('.js-video-can-purchase-list .fd-video-item');
                        if ($dqVideoItem.length > 0) {
                            dqWidth = $dqVideoItem.eq(0).width();
                            dqHeight = $dqVideoItem.eq(0).height();
                            $('.fd-dq-pop').css('width', dqWidth+'px');
                            $('.fd-dq-pop').css('height', dqHeight+'px');
                            $('.fd-dq-pop').css('margin-top', '-'+dqHeight+'px');
                        }

                        $ygVideoItem = $('.js-video-has-purchase-list .fd-video-item');
                        if ($ygVideoItem.length > 0) {
                            ygWidth = $ygVideoItem.eq(0).width();
                            ygHeight = $ygVideoItem.eq(0).height();
                            $('.fd-yg-pop').css('width', ygWidth+'px');
                            $('.fd-yg-pop').css('height', ygHeight+'px');
                            $('.fd-yg-pop').css('margin-top', '-'+ygHeight+'px');
                        }
                
                        clearInterval(timer);
                    }
                }, 10);
                
            }
        });
    }

    function buyFlightDiary() {
        var params = {
            'serialNumber': serialNumber
        };

        helper.ajax(url.buyFlightDiary, params, function(res) {
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
          handshake.init();
          bindActions();
          getUrlParams();
          getFlightDiary();
        }
    }
});