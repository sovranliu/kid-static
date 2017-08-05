define(['url', 'helper', 'mustache'], function (url, helper, mustache) {

    var serialNumber;

    function bindActions() {
        $('.js-table').on('click','.js-edit',openEdit);
        $('.js-dialog').on('click','.js-save',saveConfigData)
    }


    function getConfigData() {
        helper.ajax(url.getConfig, {}, function(res) {
            if(res.code == 0) {
                $('.js-tbody').html(mustache.render($('#tpl-tbody').html(), { 'data': res.data }));
            }
        });
    }

    function openEdit() {
        var $row = $(this).closest("tr");
        var data = {
            "name":$row.find('.js-td-name').attr('data-key'),
            "title":$row.find('.js-td-name').text(),
            "content":$row.find('.js-td-content').text()
        }
        $('.js-dialog').html(mustache.render($('#tpl-edit-dialog').html(), data));
    }

    function saveConfigData() {
        var data = {
            "name":$(this).attr('data-key'),
            "content":$.trim($('.js-new-content').val())
        }
        helper.ajax(url.postConfig, data, function(res) {
            if(res.code == 0) {
                $('.js-dialog').modal('hide');
                getConfigData();
            }
        });
    }

    return {
        init: function () {
          bindActions();
          getConfigData();
          //getFlightDiary();
        }
    }
});