define(['url', 'helper', 'mustache'], function (url, helper, mustache) {

    var serialNumber;
    var begin = 0;

    function bindActions() {
        $('.js-table').on('click','.js-edit',openEdit);
        $('.js-dialog').on('click','.js-save',saveConfigData);
        $('.js-search').on('click',getMessageData)
    }

   function buildParams() {
        var params = {};
        params['mobileNo'] = $.trim($('.js-phone').val());
        params['beginDate'] = $.trim($('.js-begin-time').val());
        params['endDate'] = $.trim($('.js-end-time').val());
        params['size'] = 10;
        params['begin'] = begin;

        return params;
   }

    function getMessageData() {
        var params = buildParams();

        helper.ajax(url.getMessages, params, function(res) {
            if(res.code == 0) {
                $('.js-tbody').html(mustache.render($('#tpl-tbody').html(), { 'data': res.data }));
            }
        });
    }

    function openEdit() {
        var $row = $(this).closest("tr");
        var data = {
            "id":$row.attr('data-id'),
            "title":"回复留言"
        }
        $('.js-dialog').html(mustache.render($('#tpl-edit-dialog').html(), data));
    }

    function saveConfigData() {
        var data = {
            "id":$(this).attr('data-id'),
            "answer":$.trim($('.js-reply').val())
        }
        helper.ajax(url.postMessageReply, data, function(res) {
            if(res.code == 0) {
                $('.js-dialog').modal('hide');
                getMessageData();
            }
        });
    }

    return {
        init: function () {
          bindActions();
          getMessageData();
          //getFlightDiary();
        }
    }
});