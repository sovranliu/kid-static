define(['url', 'helper', 'mustache', 'datePicker'], function (url, helper, mustache, datePicker) {

    var serialNumber;

    function bindActions() {
        $('.js-time-list').on('click', '.js-select-time', selectTime);
        $('.js-year').on('change', getBookingTime);
        $('.js-month').on('change', getBookingTime);
        $('.js-day').on('change', getBookingTime);
        $('.js-submit').on('click', submitBooking);
        $('.js-confirm').on('click', hidePopup);
        $('.js-open-disclaimer').on('click', openDisclaimer);
    }

    //获取url参数
    function getUrlParams() {
        serialNumber = helper.getQueryStr('serialNumber');
    }

    //初始化年月日选择框
    function initDateSelectbox() {
        $.DatePicker({ 
            YearSelector: ".js-year", 
            MonthSelector: ".js-month", 
            DaySelector: ".js-day",
            ShowDefaultText: false
        });
    }

    //获取可预约时间段
    function getBookingTime() {
        var params = {
            'year': $('.js-year option:selected').text(),
            'month': $('.js-month option:selected').text(),
            'day': $('.js-day option:selected').text()
        };

        helper.ajax(url.getBookingTime, params, function(res) {
            var data = res.data;
            
            if (res.code >= 0) {
                if (!data || data.length == 0) {
                    $('.js-time-list').html('<p class="dataNull">您选择的日期不可预约，请重新选择。</p>');
                } else {
                    $('.js-time-list').html(mustache.render($('#timeTmpl').html(), { 'timeList': data }));
                    $('.js-select-time').eq(0).click();
                }
            }
        });
    }

    //根据所选时间段，查看可预约人数
    function selectTime(e) {
        var $activeTime = $(e.currentTarget);
        var activeTime = $activeTime.text() ? $activeTime.text().split('-') : [];
        var year = $('.js-year').val();
        var month = $('.js-month').val();
        var day = $('.js-day').val();
        var params = {};

        if (activeTime.length < 2) {
            showPopup(4);
            return;
        }

        $('.js-select-time').removeClass('current');
        $activeTime.addClass('current');

        params = {
            'serialNumber': serialNumber,
            'year': year,
            'month': month,
            'day': day,
            'start': activeTime[0],
            'end': activeTime[1]
        };

        helper.ajax(url.getBookableNum, params, function(res) {
            if (res.code >= 0) {
                $('.js-bookable-num').text(res.data.count);
            }
        });
    }

    //提交预约
    function submitBooking() {
        var agreeDisclaimer = $('.js-disclaimer').is(':checked');
        var $activeTime = $('.js-select-time.current');
        var activeTime = $activeTime.text() ? $activeTime.text().split('-') : [];
        var year = $('.js-year').val();
        var month = $('.js-month').val();
        var day = $('.js-day').val();

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
            'year': year,
            'month': month,
            'day': day,
            'start': activeTime[0],
            'end': activeTime[1]
        };

        helper.ajax(url.submitBooking, params, function(res) {
            if (res.code >= 0) {
                showPopup(1);
            } else {
                showPopup(2); //预约满 todo
            }
        });
    }

    //信息提示弹框
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

    //关闭弹框
    function hidePopup(e) {
        $(e.currentTarget).closest('.popup').hide();
    }

    function openDisclaimer() {
        $('.js-disclaimer-wrapper').show();
    }

    return {
        init: function () {
          bindActions();
          getUrlParams();
          initDateSelectbox();
          getBookingTime();
        }
    }
});