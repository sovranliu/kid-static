define(['url', 'helper', 'mustache', 'dateTimePicker', 'message', 'paginator'], function (url, helper, mustache, dateTimePicker, msg, paginator) {

    function bindActions() {
        $('.js-search').on('click', getStock);
        $('.js-reset').on('click', handleReset);
        $('.js-tbody').on('click', '.js-enable', enableStock);
        $('.js-tbody').on('click', '.js-disbale', disableStock);
    }

    function initPage() {
        $('.js-filter-date').datetimepicker({minView: "month",format: 'yyyy-mm-dd'});
    }

    function handleReset() {
        $('.js-filter-input').val('');
        $('.js-table').hide();
        
        getStock();
    }

    function getStock() {
        var params = {
            'date': $('.js-filter-date').val()
        };

        helper.ajax(url.getStock, params, function(res) {
            var data = res.data;

            $('.js-table').show();
            
            if (res.code >= 0) {
                if (data.length == 0) {
                    $('.js-tbody').html('<td colspan=4 class="dataNull">您选择的日期暂无预约库存信息</td>');
                } else {
                    $('.js-tbody').html(mustache.render($('#tpl-tbody').html(), { 'data': processData(data) }));
                }
            } else {
                msg.error('获取票务库存信息失败，请稍候重试');
            }
        });
    }

    function processData(data) {
        _.each(data, function(item, i) {
            if (item.status == '1') {
                item.canBook = true;
            } else {
                item.canBook = false;
            }
        });

        return data;
    }

    function enableStock() {
        var params = {
            'id': $(this).closest('tr').data('id'),
            'type': 0
        };

        helper.ajax(url.enableStock, params, function(res) {
            if (res.code >= 0) {
                msg.success('操作成功');
                getStock();
            } else {
                msg.error('操作失败，请稍候重试');
            }
        });
    }

    function disableStock() {
        var params = {
            'id': $(this).closest('tr').data('id'),
            'type': 1
        };

        helper.ajax(url.disableStock, params, function(res) {
            if (res.code >= 0) {
                msg.success('操作成功');
                getStock();
            } else {
                msg.error('操作失败，请稍候重试');
            }
        });
    }

    return {
        init: function () {
            bindActions();
            initPage();
        }
    }
});