define(['url', 'helper', 'mustache'], function (url, helper, mustache) {

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
                $('.js-tbody').html(mustache.render($('#tpl-tbody').html(), { 'data': res.data }));
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
            "serialNumber":$(this).attr('data-id'),
            "type":$(this).attr('data-type')
        }

        if(type == "agree") {
            helper.ajax(url.accessRefund, data, function(res) {
                if(res.code >= 0) {
                    $('.js-dialog').modal('hide');
                    getRefundData();
                }
            });
        }else{
            helper.ajax(url.refuseRefund, data, function(res) {
                if(res.code >= 0) {
                    $('.js-dialog').modal('hide');
                    getRefundData();
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