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
            $('.js-video-can-purchase-list').html(mustache.render($('#videoTmpl').html(), { 'videoList': data.canPurchase.videos }));
            $('.js-video-has-purchase-list').html(mustache.render($('#videoTmpl').html(), { 'videoList': data.hasPurchased }));
            $('.js-timeDuration').html(data.timeDuration);
            $('.js-price').html(data.canPurchase.price);
        });
    }

    function buyFlightDiary() {
        var params = {
            'serialNumber': serialNumber
        };

        helper.ajax(url.buyFlightDiary, params, function(data) {
            //调起微信支付
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