define(['url', 'helper', 'mustache'], function (url, helper, mustache) {

    var serialNumber;

    function bindActions() {
        $('.js-buy-flightDiary').on('click', buyFlightDiary);
        $('.js-tab-item').on('click', switchTab);
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

        helper.ajax(url.getFlightDiary, params, function(data) {
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
        });
    }

    function buyFlightDiary() {
        var params = {
            'serialNumber': serialNumber
        };

        helper.ajax(url.buyFlightDiary, params, function(data) {
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
          getFlightDiary();
        }
    }
});