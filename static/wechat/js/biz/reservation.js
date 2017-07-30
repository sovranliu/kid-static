define(['url', 'helper', 'mustache'], function (url, helper, mustache) {

    var serialNumber;

    function bindActions() {
        $('.js-time-list').on('click', '.js-select-time', selectTime);
        $('.js-submit').on('click', submitBooking);
        $('.js-confirm').on('click', hidePopup);
    }

    function getUrlParams() {
        serialNumber = helper.getQueryStr('serialNumber');
    }

    function getBookingTime() {
        var params = {};

        helper.ajax(url.getBookingTime, params, function(data) {
            $('.js-time-list').html(mustache.render($('#timeTmpl').html(), { 'timeList': data }));
            $('.js-select-time').eq(0).click();
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
            'serialNumber': serialNumber,
            'date': '2017-08-01',
            'startTime': activeTime[0],
            'endTime': activeTime[1]
        };

        helper.ajax(url.getBookableNum, params, function(data) {
            $('.js-bookable-num').text(data.count);
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
            'serialNumber': serialNumber,
            'date': '2017-08-01',
            'startTime': activeTime[0],
            'endTime': activeTime[1]
        };

        helper.ajax(url.submitBooking, params, function(data) {
            showPopup(1);
            //showPopup(2); //预约满
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