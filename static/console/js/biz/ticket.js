define(['url', 'helper', 'mustache', 'dateTimePicker', 'message', 'paginator'], function (url, helper, mustache, dateTimePicker, msg, paginator) {

    var pageNum = 1, pageLimit = 20, gId;

    function bindActions() {
        $('.js-search').on('click', getTicketList);
        $('.js-reset').on('click', handleReset);
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

    function getTicketList() {
        var params = buildSearchParams();

        helper.ajax(url.getTicketList, params, function(res) {
            var data = res.data;

            if (res.code >= 0) {
                if (!data || !data.list || data.list.length == 0) {
                    $('.js-tbody').html('<td colspan=7 class="dataNull">还没有票务信息</td>');
                } else {
                    $('.js-tbody').html(mustache.render($('#tpl-tbody').html(), { 'data': processData(res.data.list) }));

                    $('.js-tpage').createPage({
                        pageCount: Math.ceil(data.total / pageLimit),
                        current: pageNum,
                        backFn: function (selectedPageNum) {
                            pageNum = selectedPageNum;
                            getTicketList();
                        }
                    });
                }
            } else {
                msg.error('获取票务数据失败，请稍候重试');
            }            
        });
    }

    function processData(data) {
        var statusDesc = '';

        _.each(data, function(item, i) {
            switch(Number(item.status)) {
                case 0:
                    statusDesc = '可用';
                    break;
                case 1:
                    statusDesc = '已使用';
                    break;
                case 2:
                    statusDesc = '已过期';
                    break;
                case 3:
                    statusDesc = '退款申请中';
                    break;
                case 4:
                    statusDesc = '已退票';
                    break;

            }
            
            item.statusDesc = statusDesc;
        })
    }

    return {
        init: function () {
            bindActions();
            initPage();
            getTicketList();
        }
    }
});