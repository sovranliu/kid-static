define(['url', 'helper', 'mustache', 'dateTimePicker', 'message', 'paginator'], function (url, helper, mustache, dateTimePicker, msg, paginator) {

    var pageNum = 1, gId;

    function bindActions() {
        $('.js-search').on('click', getBookingList);
        $('.js-reset').on('click', handleReset);
        $('.js-tbody').on('click', '.js-reschedule', openReschedule);
        $('.js-tbody').on('click', '.js-revoke', openRevoke);
    }

    function initPage() {
        $('.js-filter-startTime').datetimepicker({minView: "month",format: 'yyyy-mm-dd'});
        $('.js-filter-endTime').datetimepicker({minView: "month",format: 'yyyy-mm-dd'});
        $('.js-filter-serialNumber').val(helper.getQueryStr('serialNumber') || '');
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
            'limit': 20
        };

        return params;
    }

    function openReschedule() {

    }

    function openRevoke() {

    }

    function getBookingList() {
        var params = buildSearchParams();

        helper.ajax(url.getBookingList, params, function(res) {
            var data = res.data;
            
            if (data.length == 0) {
                $('.js-tbody').html('<p class="dataNull">还没有预约信息</p>');
            } else {
                $('.js-tbody').html(mustache.render($('#tpl-tbody').html(), { 'data': data }));
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