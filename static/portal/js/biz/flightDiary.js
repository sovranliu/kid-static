define(['url', 'helper', 'mustache'], function (url, helper, mustache) {

    function getUrlParams() {
        
    }

    function getFlightDiary() {
        var params = {};

        helper.ajax(url.getFlightDiary, params, function(res) {
            var data = res.data;
            if(res.code == 0) {
                if (data.hasPurchased.length == 0) {
                    $('.js-video-list').html('<p class="dataNull">您还没有飞行礼品</p>');
                } else {
                    $('.js-video-list').html(mustache.render($('#videoTmpl').html(), { 'videoList': data.hasPurchased }));
                }
            }
        });
    }

    return {
        init: function () {
          getUrlParams();
          getFlightDiary();
        }
    }
});