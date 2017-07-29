define(['url', 'helper', 'mustache'], function (url, helper, mustache) {

    var userId, ticketId;

    function bindActions() {
        $('.js-time-list').on('click', '.js-select-time', selectTime);
        $('.js-submit').on('click', submitBooking);
        $('.js-confirm').on('click', hidePopup);
    }

    function getUrlParams() {
        userId = helper.getQueryStr('userId');
        ticketId = helper.getQueryStr('ticketId');
    }

    function getBookingTime() {
        var params = {};

        helper.ajax(url.getBookingTime, params, function(res) {
            if (!res.code) {
                $('.js-time-list').html(mustache.render($('#timeTmpl').html(), { 'timeList': res.data }));
                $('.js-select-time').eq(0).click();
            } else {
                //todo
            }
        });
    }

    function selectTime(e) {
        var $activeTime = $(e.currentTarget);
        var activeTime = $activeTime.text() ? $activeTime.text().split('-') : [];
        var params = {};

        if (activeTime.length < 2) {
            showPopup(4);
            return;
        }

        $('.js-select-time').removeClass('current');
        $activeTime.addClass('current');

        params = {
            'ticketId': ticketId,
            'date': '2017-08-01',
            'startTime': activeTime[0],
            'endTime': activeTime[1]
        };

        helper.ajax(url.getBookableNum, params, function(res) {
            if (!res.code) {
                $('.js-bookable-num').text(res.data.count);
            } else {
                //todo
            }
        });
    }

    function submitBooking() {
        var agreeDisclaimer = $('.js-disclaimer').is(':checked');
        var $activeTime = $('.js-select-time.current');
        var activeTime = $activeTime.text() ? $activeTime.text().split('-') : [];

        if (activeTime.length < 2) {
            showPopup(4);
            return;
        }

        if (!agreeDisclaimer) {
            showPopup(3);
            return;
        }

        var params = {
            'userId': userId,
            'ticketId': ticketId,
            'date': '2017-08-01',
            'startTime': activeTime[0],
            'endTime': activeTime[1]
        };

        helper.ajax(url.submitBooking, params, function(res) {
            if (!res.code) {
                showPopup(1);
            } else {
                showPopup(2); //todo
            }
        });
    }

    function showPopup(type) {
        var $resWrapper = $('.js-result-wrapper');
        var $resText = $('.js-result');
        
        $resWrapper.show();

        switch(type) {
            case 1:
                $resText.html('您已成功预约改时段，请提前1小时抵达现场，进行飞行前的培训。如需调整行程，请拨打电话<i>021-57127021</i>咨询。');
                break;
            case 2:
                $resText.html('非常抱歉，该时段已约满，请重新选择，谢谢。');
                break;
            case 3:
                $resText.html('请仔细阅读并同意免责协议');
                break; 
            case 4:
                $resText.html('请选择有效预约时间段');
        }
    }

    function hidePopup() {
        $('.js-result-wrapper').hide();
    }


    return {
        init: function () {
          bindActions();
          getUrlParams();
          getBookingTime();
        }
    }
});