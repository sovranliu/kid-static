define(['url', 'helper', 'mustache', 'dateTimePicker', 'message', 'paginator'], function (url, helper, mustache, dateTimePicker, message, paginator) {

    var pageNum = 1, limit = 20, gId;

    function bindActions() {
        $('.js-search').on('click', getTicketList);
        $('.js-reset').on('click', handleReset);
        $('.js-tbody').on('click', '.js-refund', openDelete);
        $('.js-tbody').on('click', '.js-flightDiary', getFlightDiary);
        $('.js-dialog').on('click', '.js-confirm', refundTicket);
    }

    function initPage() {
        $('.js-filter-startTime').datetimepicker({minView: "month",format: 'yyyy-mm-dd'});
        $('.js-filter-endTime').datetimepicker({minView: "month",format: 'yyyy-mm-dd'});
        $('.js-filter-serialNumber').val(helper.getQueryStr('serialNumber') || '');
        $('.js-filter-telephone').val(helper.getQueryStr('telephone') || '');
    }

    function handleReset() {
        $('.js-filter-input').val('');
        $('.js-filter-select').find('option:first').prop('selected', 'selected');

        pageNum = 1;
        getTicketList();
    }

    function openDelete() {
        var $row = $(this).closest('tr');

        gId = $row.data('id');

        $('.js-dialog').html(mustache.render($('#tpl-delete-dialog').html(), { 'id': gId })).modal();
    }

    function refundTicket() {
        var params = {
            'serialNumber': gId
        };

        helper.ajax(url.postConfig, params, function(res) {
            if (res.code == '0') {
                $('.js-dialog').modal('hide');
                msg.success('退票成功');
            } else {
                msg.error(res.msg);
            }
        });
    }

    function getFlightDiary() {
        var params = {
            'serialNumber': gId
        };

        helper.ajax(url.getFlightDiary, params, function(res) {
            if (res.code == '0') {
                //todo
            } else {
                //todo
            }
        });
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
            'limit': limit
        };

        return params;
    }

    function getTicketList() {
        var params = buildSearchParams();

        helper.ajax(url.getTicketList, params, function(res) {
            if (res.code == '0') {
                if (res.data.length == 0) {
                    $('.js-tbody').html('<p class="dataNull">还没有票务信息</p>');
                } else {
                    $('.js-tbody').html(mustache.render($('#tpl-tbody').html(), { 'data': res.data }));
                }

                $('.js-tpage').createPage({
                    pageCount: Math.ceil(100 / limit), //todo
                    current: pageNum,
                    backFn: function (selectedPageNum) {
                        pageNum = selectedPageNum;
                        getTicketList();
                    }
                });
            } else {
                //todo
            }            
        });
    }

    return {
        init: function () {
            bindActions();
            initPage();
            getTicketList();
        }
    }
});