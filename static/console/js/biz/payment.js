define(['url', 'helper', 'mustache','dateTimePicker','paginator'], function (url, helper, mustache,dateTimePicker,paginator) {

    var serialNumber;
    var pageNum = 1, limit = 20;

    function bindActions() {
        $('.js-search').on('click',getOrderData);
        $('.js-reset').on('click', handleReset);
        // $('.js-dialog').on('click','.js-save',saveConfigData)
    }

    function initPage() {
        $('.js-filter-startTime').datetimepicker({language: 'zh',minView: "month",format: 'yyyy-mm-dd'});
        $('.js-filter-endTime').datetimepicker({language: 'zh', minView: "month",format: 'yyyy-mm-dd'});
        $('.js-phone').val(helper.getQueryStr('telephone') || '');
    }

    function buildSearchParams() {
        var params = {};
        params['serialNo'] = $.trim($('.js-order').val());
        params['mobileNo'] = $.trim($('.js-phone').val());
        params['beginTime'] = $.trim($('.js-filter-startTime').val());
        params['endTime'] = $.trim($('.js-filter-endTime').val());
        params['status'] = parseInt($('.js-status').val()) || "";
        params['limit'] = limit;
        params['begin'] = pageNum;

        return params;
    }    

    function handleReset() {
        $('.js-filter-input').val('');
        $('.js-filter-select').find('option:first').prop('selected', 'selected');

        pageNum = 1;
        getOrderData();
    }

    function getOrderData() {
        var params = buildSearchParams();

        helper.ajax(url.getOrder, params, function(res) {
            var data = res.data.list;
            if(res.code >= 0) {
                for(var i = 0;i < data.length; i++) {
                    switch(data[i].status) {
                        case 1:
                            data[i].statusName = "未支付";
                            break;
                        case 2:
                            data[i].statusName = "已支付";
                            break;
                        case 3:
                            data[i].statusName = "已退款";
                            break;
                    }
                    data[i].fee = parseFloat(data[i].fee/100).toFixed(2);
                    data[i].serialNo = data[i].serialNo.split(',');
                }
                if(data.length == 0) {
                     $('.js-tbody').html('<td colspan="7" class="dataNull">还没有收款纪录</td>');
                }else{
                    $('.js-tbody').html(mustache.render($('#tpl-tbody').html(), { 'data': data }));
                }
                $('.js-tpage').createPage({
                    pageCount: Math.ceil(res.data.total / limit), //todo
                    current: pageNum,
                    backFn: function (selectedPageNum) {
                        pageNum = selectedPageNum;
                        getOrderData();
                    }
                });
            }
        });
    }


    return {
        init: function () {
          bindActions();
          initPage();
          getOrderData();
          //getFlightDiary();
        }
    }
});