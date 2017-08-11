define(['url', 'helper', 'mustache'], function (url, helper, mustache) {

    var serialNumber;

    function bindActions() {
        $('.js-table').on('click','.js-agree',openAgree);
        $('.js-table').on('click','.js-oppose',openOppose);
        $('.js-dialog').on('click','.js-save',saveRefundData)
    }


    function getRescheduleData() {
        helper.ajax(url.getRescheduleBooks, {}, function(res) {
            if(res.code >= 0) {
                $('.js-tbody').html(mustache.render($('#tpl-tbody').html(), { 'data': res.data.list }));
            }
        });
    }

    function openAgree() {
        var $row = $(this).closest("tr");
        var data = {
            "id":$row.attr('data-id'),
            "operate":"同意",
            "type":"1"
        }
        $('.js-dialog').html(mustache.render($('#tpl-dialog').html(), data));
    }

    function openOppose() {
        var $row = $(this).closest("tr");
        var data = {
            "id":$row.attr('data-id'),
            "operate":"驳回",
            "type":"0"
        }
        $('.js-dialog').html(mustache.render($('#tpl-dialog').html(), data));
    }

    function saveRefundData() {
        var type = $(this).attr('data-type');

        var data = {
            "id":$(this).attr('data-id'),
            "type":$(this).attr('data-type')
        }

        helper.ajax(url.approveBookChange, data, function(res) {
            if(res.code >= 0) {
                $('.js-dialog').modal('hide');
                getRescheduleData();
            }
        });
    }

    return {
        init: function () {
          bindActions();
          getRescheduleData();
          //getFlightDiary();
        }
    }
});