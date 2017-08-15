define(['url', 'helper', 'mustache'], function (url, helper, mustache) {

    var openId, mobileNo, gData;

    function bindActions() {
        $('.js-tab-item').on('click', switchTab);
        $('.popup').on('click', '.js-confirm',function() {
            $('.popup').hide();
        });
        $('.js-buy-flightDiary').on('click', buyFlightDiary);
        $('.js-rsv-ticket').on('change', changeTicket);
    }

    function getUrlParams() {
        openId =  helper.getQueryStr('openId');
        mobileNo = helper.getQueryStr('mobileNo');
    }

    function checkPhone() {
        if (!mobileNo || !openId) {
            helper.ajax(url.prepay,{},function() {})
        } else {
            helper.ajax(url.payInfo, {"mobileNo":mobileNo, "openId":openId}, function(res) {
                if (res.code >= 0) {
                    var data = res.data;
                    $('.js-name').text(data.user.userName);
                    $('.js-phone').text(data.user.mobileNo);
                }
            })
        }
    }

    function getFlightDiary() {
        var params = {
            'mobileNo': mobileNo
        };

        helper.ajax(url.getFlightDiary, params, function(res) {
            if (res.code >= 0) {
                var data = res.data;
                var $dqVideoItem;
                var $ygVideoItem;
                var dqWidth = 0;
                var dqHeight = 0;
                var ygWidth = 0;
                var ygHeight = 0;

                if (!data || !data.canPurchase || data.canPurchase.length == 0) {
                    $('.js-video-can-purchase-list').html('<p class="dataNull">您还没有飞行礼品</p>');
                    $('.fd-time').hide();
                    $('.fd-dq-desc').hide();
                    $('.js-fd-payment').hide();
                    $('.js-rsv-ticket').hide();
                } else {
                    gData = data.canPurchase;
                    $('.js-rsv-ticket').html(mustache.render($('#ticketTmpl').html(), {'data': gData}));
                    changeTicket();
                }
                
                if (!data || !data.hasPurchased || data.hasPurchased.length == 0) {
                    $('.js-video-has-purchase-list').html('<p class="dataNull">您还没有购买飞行礼品。</p>');
                } else {
                    $('.js-video-has-purchase-list').html(mustache.render($('#videoTmpl').html(), { 'videoList': data.hasPurchased, 'isPurchased': true }));
                }

                if (data) {
                    $('.js-timeDuration').html(data.timeDuration);
                    $('.js-price').html((Number(data.singlePrice) / 100).toFixed(2));
                }

                //动态设置遮罩的宽度，高度在样式中写死200px
                $dqVideoItem = $('.js-video-can-purchase-list .fd-video-item');
                if ($dqVideoItem.length > 0) {
                    dqWidth = $dqVideoItem.eq(0).width();
                    $('.fd-dq-pop').css('width', dqWidth+'px');
                }

                $ygVideoItem = $('.js-video-has-purchase-list .fd-video-item');
                if ($ygVideoItem.length > 0) {
                    ygWidth = $ygVideoItem.eq(0).width();
                    $('.fd-yg-pop').css('width', ygWidth+'px');
                }
            } else {
                $('.fd-time').hide();
                $('.fd-dq-desc').hide();
                $('.js-fd-payment').hide();
                $('.js-rsv-ticket').hide();
            }
        });
    }

    function changeTicket() {
        var selectedList = [];

        serialNumber = $('.js-rsv-ticket option:selected').data('val');

        _.each(gData, function(item, i) {
            if (item.serialNo == serialNumber) {
                selectedList = item.records;
            }
        });

        if (selectedList && selectedList.length > 0) {
            $('.js-video-can-purchase-list').html(mustache.render($('#videoTmpl').html(), { 'videoList': selectedList, 'isPurchased': false }));
            $('.fd-time').show();
            $('.fd-dq-desc').show();
            $('.js-fd-payment').show();
            $('.js-rsv-ticket').show();
        } else {
            $('.js-video-can-purchase-list').html('<p class="dataNull">您还没有飞行礼品</p>');
            $('.fd-time').hide();
            $('.fd-dq-desc').hide();
            $('.js-fd-payment').hide();
            $('.js-rsv-ticket').hide();
        }
    }

    function buyFlightDiary() {
        var params = {
            "serialNo": serialNumber,
            "goodsType":'30000',
            "openId":openId,
            "mobileNo":mobileNo
        };

        helper.ajax(url.buyTicket, params, function(res) {
            if (res.code >= 0) {
                if (typeof WeixinJSBridge == "undefined") {
                   if (document.addEventListener) {
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

    function switchTab(e) {
        var $activeTab = $(e.currentTarget);
        var tabIndex = Number($activeTab.data('index'));

        $('.js-tab-item').removeClass('current');
        $('.js-tab-content').hide();

        $activeTab.addClass('current');
        $('.js-tab-content').eq(tabIndex).show();
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
                    $('popup').show().find('p').html(res.msg)
               }
           }
       ); 
    }

    return {
        init: function () {
          bindActions();
          getUrlParams();
          checkPhone();
          getFlightDiary();
        }
    }
});