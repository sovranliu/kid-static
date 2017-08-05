define(['url', 'helper', 'mustache'], function (url, helper, mustache) {

    var serialNumber;
    var begin = 0;

    function bindActions() {
        $('.js-search').on('click',getOrderData);
        // $('.js-dialog').on('click','.js-save',saveConfigData)
    }

   function buildParams() {
        var params = {};
        params['orderNo'] = $.trim($('.js-order').val());
        params['mobileNo'] = $.trim($('.js-phone').val());
        params['beginTime'] = $.trim($('.js-begin-time').val());
        params['endTime'] = $.trim($('.js-end-time').val());
        params['status'] = parseInt($('.js-status').val()) || "";
        params['size'] = 10;
        params['begin'] = begin;

        return params;
   }

    function getOrderData() {
        var params = buildParams();

        helper.ajax(url.getOrder, params, function(res) {
            var data = res.data;
            if(res.code == 0) {
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
                }
                $('.js-tbody').html(mustache.render($('#tpl-tbody').html(), { 'data': res.data }));
            }
        });
    }


    return {
        init: function () {
          bindActions();
          getOrderData();
          //getFlightDiary();
        }
    }
});