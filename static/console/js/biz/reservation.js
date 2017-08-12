define(['url', 'helper', 'mustache', 'dateTimePicker', 'message', 'paginator', 'datePicker'], function (url, helper, mustache, dateTimePicker, msg, paginator, datePicker) {

    var pageNum = 1, pageLimit = 20, gId;

    function bindActions() {
        $('.js-search').on('click', getBookingList);
        $('.js-reset').on('click', handleReset);
        $('.js-tbody').on('click', '.js-reschedule', openReschedule);
        $('.js-tbody').on('click', '.js-revoke', openRevoke);
        $('.js-dialog').on('click', '.js-confirm-reschedule', confirmReschedule);
        $('.js-dialog').on('click', '.js-confirm-revoke', confirmRevoke);
        $('.js-dialog').on('click', '.js-select-time', selectTime);
        $('.js-dialog').on('change', '.js-year', getBookingTime);
        $('.js-dialog').on('change', '.js-month', getBookingTime);
        $('.js-dialog').on('change', '.js-day', getBookingTime);
        
    }

    function initPage() {
        $('.js-filter-startTime').datetimepicker({minView: "month",format: 'yyyy-mm-dd'});
        $('.js-filter-endTime').datetimepicker({minView: "month",format: 'yyyy-mm-dd'});
        $('.js-filter-telephone').val(helper.getQueryStr('telephone') || '');
    }

    function handleReset() {
        $('.js-filter-input').val('');
        $('.js-filter-select').find('option:first').prop('selected', 'selected');

        pageNum = 1;
        getBookingList();
    }

    function buildSearchParams() {
        var serialNumber = $('.js-filter-serialNumber').val();
        var telephone = $('.js-filter-telephone').val();
        var startTime = $('.js-filter-startTime').val();
        var endTime = $('.js-filter-endTime').val();
        var status = $('.js-filter-status').find('option:selected').data('val');

        var params = {
            'serialNumber': $.trim(serialNumber),
            'telephone': $.trim(telephone),
            'startTime': startTime,
            'endTime': endTime,
            'status': status,
            'begin': pageNum,
            'limit': pageLimit
        };

        return params;
    }

    function getBookingList() {
        var params = buildSearchParams();

        helper.ajax(url.getBookingList, params, function(res) {
            var data = res.data;
            
            if (res.code >= 0) {
                if (!data || !data.list || data.list.length == 0) {
                    $('.js-tbody').html('<td colspan=5 class="dataNull">还没有预约信息</td>');
                } else {
                    $('.js-tbody').html(mustache.render($('#tpl-tbody').html(), { 'data': data.list }));

                    $('.js-tpage').createPage({
                        pageCount: Math.ceil(data.total / pageLimit),
                        current: pageNum,
                        backFn: function (selectedPageNum) {
                            pageNum = selectedPageNum;
                            getBookingList();
                        }
                    });
                }
            } else {
                msg.error('获取预约数据失败，请稍候重试');
            }
        });
    }

    function openReschedule() {
        var $row = $(this).closest('tr');
        /*var userDate = $row.find('.js-td-time').html();
        var ymd = '';
        var ymdArr = [];
        var hms = '';

        if (userDate) {
            ymd = userDate.split(' ')[0];
            hms = userDate.split(' ')[1];
            ymdArr = ymd.split('-');
            userYear = ymd[0];
            userMonth = ymd[1];
            userDay = ymd[2];
        }*/

        gId = $row.data('id');

        $('.js-dialog').html(mustache.render($('#tpl-reschedule-dialog').html(), { }));

        $.DatePicker({ 
            YearSelector: ".js-year", 
            MonthSelector: ".js-month", 
            DaySelector: ".js-day",
            ShowDefaultText: false
        });

        getBookingTime();
    }

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

    //根据所选时间段，查看是否可预约
    function selectTime(e) {
        var $activeTime = $(e.currentTarget);
        var activeTime = $activeTime.text() ? $activeTime.text().split('-') : [];
        var year = $('.js-year option:selected').text();
        var month = $('.js-month option:selected').text();
        var day = $('.js-day option:selected').text();
        var params = {};

        if (activeTime.length < 2) {
            msg.error('请选择有效预约时间段', $('.js-dialog').find('.alert-message'));
            return;
        }

        if(!gId) {
            msg.error('请选择要改期的飞行票', $('.js-dialog').find('.alert-message'));
            return;
        }

        $('.js-select-time').removeClass('current');
        $activeTime.addClass('current');

        month = month.length < 2 ? "0" + month : month;
        day = day.length < 2 ? "0" + day : day;

        params = {
            'serialNumber': gId,
            'year': year,
            'month': month,
            'day': day,
            'start': activeTime[0],
            'end': activeTime[1]
        };

        helper.ajax(url.isCanBook, params, function(res) {
            if (res.code < 0) {
                msg.error('该时间段不可预约，请重新选择', $('.js-dialog').find('.alert-message'));
            }
        });
    }

    function openRevoke() {
        gId = $(this).closest('tr').data('id');

        $('.js-dialog').html(mustache.render($('#tpl-revoke-dialog').html(), { }));
    }

    function confirmReschedule() {
        var $activeTime = $('.js-select-time.current');
        var activeTime = $activeTime.text() ? $activeTime.text().split('-') : [];
        var year = $('.js-year option:selected').text();
        var month = $('.js-month option:selected').text();
        var day = $('.js-day option:selected').text();


        month = month.length < 2 ? "0" + month : month;
        day = day.length < 2 ? "0" + day : day;

        var params = {
            'serialNumber': gId,
            'year': year,
            'month': month,
            'day': day,
            'start': activeTime[0],
            'end': activeTime[1]
        };

        helper.ajax(url.rescheduleBooking, params, function(res) {
            $('.js-dialog').modal('hide');

            if (res.code >= 0) {
                msg.success('预约改期成功');
                getBookingList();
            } else {
                msg.error('预约改期失败，请稍后重试');
            }
        });
    }

    function confirmRevoke() {
        var params = {
            'serialNumber': gId
        };

        helper.ajax(url.revokeBooking, params, function(res) {
            $('.js-dialog').modal('hide');
            
            if (res.code >= 0) {
                msg.success('预约撤销成功');
                getBookingList();
            } else {
                msg.error('预约撤销失败，请稍后重试');
            }
        });
    }

    return {
        init: function () {
          bindActions();
          initPage();
          getBookingList();
        }
    }
});