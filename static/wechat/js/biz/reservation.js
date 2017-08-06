define(['url', 'helper', 'mustache', 'datePicker', 'handshake'], function (url, helper, mustache, datePicker, handshake) {

    var serialNumber, optType;

    function bindActions() {
        $('.js-time-list').on('click', '.js-select-time', selectTime);
        $('.js-year').on('change', changeDate);
        $('.js-month').on('change', changeDate);
        $('.js-day').on('change', changeDate);
        $('.js-submit').on('click', submitBooking);
        $('.js-confirm').on('click', hidePopup);
    }

    //获取url参数
    function getUrlParams() {
        serialNumber = helper.getQueryStr('ticketId');
        optType = helper.getQueryStr('type');
    }

    //初始化年月日选择框
    function initDateSelectbox() {
        $.DatePicker({ 
            YearSelector: ".js-year", 
            MonthSelector: ".js-month", 
            DaySelector: ".js-day",
            ShowDefaultText: false
        });

        $('.js-year-text').text($('.js-year option:selected').text());
        $('.js-month-text').text($('.js-month option:selected').text());
        $('.js-day-text').text($('.js-day option:selected').text());
    }

    //切换日期选择
    function changeDate(e) {
        var $dateItem = $(e.currentTarget).closest('.js-date-item');
        var $dateInput = $dateItem.find('.js-date-text');
        var selectedVal = $dateItem.find('select').val();

        selectedVal = selectedVal.toString().length < 2 ? "0" + selectedVal : selectedVal;

        $dateInput.text(selectedVal);
        getBookingTime();
    }

    //获取可预约时间段
    function getBookingTime() {
        var year = $('.js-year option:selected').text();
        var month = $('.js-month option:selected').text();
        var day = $('.js-day option:selected').text();

        month = month.length < 2 ? "0" + month : month;
        day = day.length < 2 ? "0" + day : day;

        var params = {
            'year': year,
            'month': month,
            'day': day
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
            } else {
                //todo
            }
        });
    }

    //根据所选时间段，查看可预约人数
    function selectTime(e) {
        var $activeTime = $(e.currentTarget);
        var activeTime = $activeTime.text() ? $activeTime.text().split('-') : [];
        var year = $('.js-year option:selected').text();
        var month = $('.js-month option:selected').text();
        var day = $('.js-day option:selected').text();
        var params = {};

        if (activeTime.length < 2) {
            showPopup(4);
            return;
        }

        if(!serialNumber) {
            showPopup(5);
            return;
        }

        $('.js-select-time').removeClass('current');
        $activeTime.addClass('current');

        month = month.length < 2 ? "0" + month : month;
        day = day.length < 2 ? "0" + day : day;

        params = {
            'serialNumber': serialNumber,
            'year': year,
            'month': month,
            'day': day,
            'start': activeTime[0],
            'end': activeTime[1]
        };

        helper.ajax(url.getBookableNum, params, function(res) {
            var data = res.data;

            if (res.code >= 0) {
                $('.js-bookable-num').text(data.count);
            }
        });
    }

    //提交预约
    function submitBooking() {
        var agreeDisclaimer = $('.js-disclaimer').is(':checked');
        var $activeTime = $('.js-select-time.current');
        var activeTime = $activeTime.text() ? $activeTime.text().split('-') : [];
        var year = $('.js-year option:selected').text();
        var month = $('.js-month option:selected').text();
        var day = $('.js-day option:selected').text();

        if (activeTime.length < 2) {
            showPopup(4);
            return;
        }

        if(!serialNumber) {
            showPopup(5);
            return;
        }

        if (!agreeDisclaimer) {
            showPopup(3);
            return;
        }

        month = month.length < 2 ? "0" + month : month;
        day = day.length < 2 ? "0" + day : day;

        var params = {
            'type': optType,
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
                window.location.href = "MemberCenter.html";
            } else {
                showPopup(2); //预约满
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
                $resText.html('您已成功预约该时段，请提前1小时抵达现场，进行飞行前的培训。如需调整行程，请拨打电话<i>021-57127021</i>咨询。');
                break;
            case 2:
                $resText.html('非常抱歉，该时段已约满，请重新选择，谢谢。');
                break;
            case 3:
                $resText.html('请仔细阅读并同意免责协议');
                break; 
            case 4:
                $resText.html('请选择有效预约时间段');
                break;
            case 5:
                $resText.html('请选择您要预约的飞行票');
                break;
        }
    }

    //关闭弹框
    function hidePopup() {
        $('.js-result-wrapper').hide();
    }

    return {
        init: function () {
            handshake.init();
            bindActions();
            getUrlParams();
            initDateSelectbox();
            getBookingTime();
        }
    }
});