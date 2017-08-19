define(['url', 'helper', 'mustache'], function (url, helper, mustache) {

    function getUrlParams() {
        
    }

    function bindActions() {
        $('.error-popup').on('click','.js-confirm', function() {
            $('.error-popup').hide();
        });
    }

    function getFlightDiary() {
        var params = {};

        helper.ajax(url.getFlightDiary, params, function(res) {
            var data = res.data;

            if (res.code >= 0) {
                if (!data || data.hasPurchased.length == 0) {
                    $('.js-video-list').html('<p class="dataNull">您还没有飞行礼品</p>');
                } else {
                    $('.js-video-list').html(mustache.render($('#videoTmpl').html(), { 'videoList': data.hasPurchased }));
                }
            } else {
                res.msg && $('.error-popup').show().find('p').html(res.msg);
            }
        });
    }

    return {
        init: function () {
          getUrlParams();
          bindActions();
          getFlightDiary();
        }
    }
});