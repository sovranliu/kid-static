define(['url', 'helper', 'mustache','message'], function (url, helper, mustache,msg) {

    var serialNumber;

    function bindActions() {
        $('.js-table').on('click','.js-agree',openAgree);
        $('.js-table').on('click','.js-oppose',openOppose);
        $('.js-dialog').on('click','.js-save',saveRefundData)
    }


    function getRefundData() {
        var params = {
            "begin": 1,
            "limit": 999
        }
        helper.ajax(url.getAllRefund, params, function(res) {
            if(res.code >= 0) {
                if(res.data.length == 0){
                    $('.js-tbody').html('<td colspan="7" class="dataNull">暂无退票申请</td>');
                }else{
                    for(var i = 0;i < res.data.length; i++) {
                        res.data[i].price = parseFloat(res.data[i].price/100);
                        res.data[i].backPrice = parseFloat(res.data[i].backPrice/100);
                    }
                    $('.js-tbody').html(mustache.render($('#tpl-tbody').html(), { 'data': res.data}));
                }
            }
        });
    }

    function openAgree() {
        var $row = $(this).closest("tr");
        var data = {
            "serialNumber":$row.find('.js-td-serialNumber').text(),
            "operate":"同意",
            "type":"agree"
        }
        $('.js-dialog').html(mustache.render($('#tpl-dialog').html(), data));
    }

    function openOppose() {
        var $row = $(this).closest("tr");
        var data = {
            "serialNumber":$row.find('.js-td-serialNumber').text(),
            "operate":"驳回",
            "type":"oppose"
        }
        $('.js-dialog').html(mustache.render($('#tpl-dialog').html(), data));
    }

    function saveRefundData() {
        var type = $(this).attr('data-type');

        var data = {
            "serialNumber":$(this).attr('data-id')
        }

        if(type == "agree") {
            helper.ajax(url.accessRefund, data, function(res) {
                if(res.code >= 0) {
                    $('.js-dialog').modal('hide');
                    getRefundData();
                }else{
                    msg.error(res.msg);
                }
            });
        }else{
            helper.ajax(url.refuseRefund, data, function(res) {
                if(res.code >= 0) {
                    msg.success('操作成功');
                    $('.js-dialog').modal('hide');
                    getRefundData();
                }else{
                    msg.error(res.msg);
                }
            });
        }
        
        
    }

    return {
        init: function () {
          bindActions();
          getRefundData();
          //getFlightDiary();
        }
    }
});