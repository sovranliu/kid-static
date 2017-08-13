define(['url', 'helper', 'mustache', 'datePicker'], function (url, helper, mustache, datePicker) {

    var serialNumber, optType;

    function bindActions() {
        $('.js-time-list').on('click', '.js-select-time', selectTime);
        $('.js-year').on('change', getBookingTime);
        $('.js-month').on('change', getBookingTime);
        $('.js-day').on('change', getBookingTime);
        $('.js-rsv-ticket').on('change', changeTicket);
        $('.js-submit').on('click', submitBooking);
        $('.js-confirm').on('click', hidePopup);
        $('.js-open-disclaimer').on('click', openDisclaimer);
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
    }

    //获取所有票券
    function getTicketList() {
        if (!serialNumber) {

            helper.ajax(url.getTickets, {}, function(res) {
                if (res.code >= 0) {
                    var data = res.data;
                    var tcList = [];
                    
                    _.each(data, function(item, i) {
                        if (Number(item.status) == 0) {
                            //var serialNo = item.serialNumber;
                            //item.type = item.ticketType == 0 ? '团体票' : '单人票';
                            //item.sno = serialNo.replace(serialNo.substring(10, serialNo.length-5), '****');
                            tcList.push(item);
                        }
                    });

                    if (!tcList || tcList.length == 0) {
                        showPopup(5);
                    } else {
                        $('.js-rsv-ticket').html(mustache.render($('#ticketTmpl').html(), {'data': tcList}));
                    }

                    changeTicket();
                }
            })
        } else {
            $('.js-rsv-ticket').html(mustache.render($('#ticketTmpl').html(), {'data': [{'serialNumber': serialNumber}]})).attr('disabled', 'disabled');
        }
    }

    function changeTicket() {
        serialNumber = $('.js-rsv-ticket option:selected').data('val');
    }

    //获取可预约时间段
    function getBookingTime() {
        var curDate = new Date();
        var curYear = curDate.getFullYear().toString();
        var curMonth = (curDate.getMonth() + 1).toString();
        var curDay = curDate.getDate().toString();
        var curHour = curDate.getHours();
        var year = $('.js-year option:selected').text();
        var month = $('.js-month option:selected').text();
        var day = $('.js-day option:selected').text();

        month = month.length < 2 ? "0" + month : month;
        day = day.length < 2 ? "0" + day : day;
        curMonth = curMonth.length < 2 ? "0" + curMonth : curMonth;
        curDay = curDay.length < 2 ? "0" + curDay : curDay;

        var params = {
            'year': year,
            'month': month,
            'day': day
        };

        helper.ajax(url.getBookingTime, params, function(res) {
            var data = res.data;
            var timeList = [];

            if (res.code >= 0) {
                //只显示比当天当时晚的时间段
                if ((year == curYear && month < curMonth) ||
                    (year == curYear && month == curMonth && day < curDay)) {
                    timeList = [];
                } else if (year == curYear && month == curMonth && day == curDay) {
                    _.each(data, function(item, i) {
                        if (Number(item.start.split(':')[0]) > curHour) {
                            timeList.push(item);
                        }
                    });
                } else {
                    timeList = data;
                }
                
                //渲染页面
                if (!timeList || timeList.length == 0) {
                    $('.js-time-list').html('<p class="dataNull">您选择的日期不可预约，请重新选择。</p>');
                } else {
                    $('.js-time-list').html(mustache.render($('#timeTmpl').html(), { 'timeList': timeList }));
                    $('.js-select-time').eq(0).click();
                }
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
        var year = $('.js-year option:selected').text();
        var month = $('.js-month option:selected').text();
        var day = $('.js-day option:selected').text();

        if (activeTime.length < 2) {
            showPopup(4);
            return;
        }

        if (!agreeDisclaimer) {
            showPopup(3);
            return;
        }

        month = month.length < 2 ? "0" + month : month;
        day = day.length < 2 ? "0" + day : day;

        var params = {
            'type': optType || '0',
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
                text = Number(optType) == 0 ? '您已成功预约该时段，请提前1小时抵达现场，进行飞行前的培训。如需调整行程，请拨打电话<i>021-57127021</i>咨询。' : '您已成功提交改期申请，请耐心等待管理员审核。如有任何问题，请拨打电话<i>021-57127021</i>咨询。';
                $resText.html(text);
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
                $resText.html('请先购买飞行票，再进行预约');
                $('.js-confirm').on('click', function() {
                    window.location.href = 'BuyTickets.html';
                });
                break;
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
          getTicketList();
          getBookingTime();
        }
    }
});