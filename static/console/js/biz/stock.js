define(['url', 'helper', 'mustache', 'dateTimePicker', 'message', 'paginator'], function (url, helper, mustache, dateTimePicker, message, paginator) {

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
            'date': $('js-filter-date').val()
        };

        helper.ajax(url.getStock, params, function(res) {
            var data = res.data;

            $('.js-table').show();
            
            if (data.length == 0) {
                $('.js-tbody').html('<p class="dataNull">您选择的日期暂无预约库存信息</p>');
            } else {
                $('.js-tbody').html(mustache.render($('#tpl-tbody').html(), { 'data': data }));
            }
        });
    }

    function enableStock() {
        var params = {
            'id': $('js-filter-date').val()
        };

        helper.ajax(url.enableStock, params, function(res) {
            var data = res.data;
            
            if (data.code == 0) {
                msg.success('操作成功');
                getStock();
            } else {
                msg.success('操作失败，请稍候重试');
            }
        });
    }

    function disableStock() {
        var params = {
            'id': $('js-filter-date').val()
        };

        helper.ajax(url.disableStock, params, function(res) {
            var data = res.data;
            
            if (data.code == 0) {
                msg.success('操作成功');
                getStock();
            } else {
                msg.success('操作失败，请稍候重试');
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