define(['url', 'helper', 'mustache','message'], function (url, helper, mustache,msg) {

    var serialNumber;

    function bindActions() {
        $('.js-table').on('click','.js-edit',openEdit);
        $('.js-dialog').on('click','.js-save',saveConfigData)
    }


    function getConfigData() {
        helper.ajax(url.getConfig, {}, function(res) {
            if(res.code >= 0) {
                if(res.data.length == 0) {
                    $('.js-tbody').html('<td colspan="4" class="dataNull">暂无参数</td>');
                }else{
                    $('.js-tbody').html(mustache.render($('#tpl-tbody').html(), { 'data': res.data }));
                }
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
            if(res.code >= 0) {
                msg.success('操作成功');
                $('.js-dialog').modal('hide');
                getConfigData();
            }else{
                msg.error(res.msg)
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