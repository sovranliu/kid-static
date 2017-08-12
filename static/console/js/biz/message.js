define(['url', 'helper', 'mustache','paginator','message'], function (url, helper, mustache,paginator,msg) {

    var serialNumber;
    var pageNum = 1;

    function bindActions() {
        $('.js-table').on('click','.js-edit',openEdit);
        $('.js-dialog').on('click','.js-save',saveConfigData);
        $('.js-search').on('click',getMessageData);
        $('.js-reset').on('click', handleReset);
    }

    function buildParams() {
        var params = {};
        params['mobileNo'] = $.trim($('.js-phone').val());
        params['beginDate'] = $.trim($('.js-begin-time').val());
        params['endDate'] = $.trim($('.js-end-time').val());
        params['size'] = 20;
        params['begin'] = pageNum;

        return params;
    }

    function handleReset() {
        $('.js-filter-input').val('');
        $('.js-table').hide();

        pageNum = 1;
        getMessageData();
    }

    function getMessageData() {
        var params = buildParams();

        helper.ajax(url.getMessages, params, function(res) {
            if(res.code >= 0) {
                if(res.data.list.length == 0) {
                    $('.js-tbody').html('<td colspan="5" class="dataNull">暂无留言</td>');
                }else{
                    $('.js-tbody').html(mustache.render($('#tpl-tbody').html(), { 'data': res.data.list }));
                }
                $('.js-tpage').createPage({
                    pageCount: Math.ceil(res.data.total / limit), //todo
                    current: pageNum,
                    backFn: function (selectedPageNum) {
                        pageNum = selectedPageNum;
                        getMessageData();
                    }
                });
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
            if(res.code >= 0) {
                msg.success('操作成功。')
                $('.js-dialog').modal('hide');
                getMessageData();
            }else{
                msg.error(res.msg)
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