define(['url', 'helper', 'mustache'], function (url, helper, mustache) {

    var userId, diaryId;

    function bindActions() {
        $('.js-buy-flightDiary').on('click', buyFlightDiary);
        $('.js-tab-item').on('click', switchTab);
        //$('.js-video-has-purchase-list').on('click', 'img', showVideo);
    }

    function getUrlParams() {
        userId = helper.getQueryStr('userId');
        ticketId = helper.getQueryStr('ticketId');
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
        var params = {};

        helper.ajax(url.getFlightDiary, params, function(res) {
            if (!res.code) {
                var data = res.data;

                $('.js-video-can-purchase-list').html(mustache.render($('#imgTmpl').html(), { 'imgList': data.canPurchase.videos }));
                $('.js-video-has-purchase-list').html(mustache.render($('#videoTmpl').html(), { 'videoList': data.hasPurchased }));
                $('.js-timeDuration').html(data.timeDuration);
                $('.js-price').html(data.canPurchase.price);
            } else {
                //todo
            }
        });
    }

    /*function showVideo(e) {
        var $videoControl = $('.js-video-control');
        var url = $(e.currentTarget).data('url');

        $videoControl.show();
        $videoControl.find('source').attr('src', url);
    }*/

    function buyFlightDiary() {
        var params = {
            'userId': userId,
            'diaryId': diaryId
        };

        helper.ajax(url.buyFlightDiary, params, function(res) {
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
          getFlightDiary();
        }
    }
});