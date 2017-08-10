define(['url', 'helper', 'mustache', 'fileupload'], function (url, helper, mustache, fileupload) {

    var pageNum = 1, limit = 20, gId;

    function bindActions() {
        $('.js-search').on('click', getFlightDiary);
        $('.js-reset').on('click', handleReset);
        $('.js-add').on('click', openAdd);
        $('.js-tbody').on('click', '.js-delete', openDelete);
        $('.js-dialog').on('click', '.js-upload', uploadVideo);
        $('.js-dialog').on('click', '.js-cancel', cancelUpload);
        $('.js-dialog').on('click', '.js-delete', deleteVideo);
        $('.js-dialog').on('click', '.js-confirm', deleteFlightDiary);
    }

    function handleReset() {
        $('.js-filter-input').val('');
        $('.js-table').hide();
        $('.js-tpage').hide();

        pageNum = 1;
        getFlightDiary();
    }

    function buildSearchParams() {
        var serialNumber = $('.js-filter-serialNumber').val();

        var params = {
            'serialNumber': $.trim(serialNumber),
            'begin': pageNum,
            'limit': 20
        };

        return params;
    }

    function getFlightDiary() {
        var params = buildSearchParams();

        helper.ajax(url.getFlightDiary, params, function(res) {
            var data = res.data;
            
            $('.js-table').show();
            $('.js-tpage').show();

            if (data.length == 0) {
                $('.js-tbody').html('<p class="dataNull">该票号暂无礼品信息</p>');
            } else {
                $('.js-tbody').html(mustache.render($('#tpl-tbody').html(), { 'data': data }));
            }
        });
    }

    function openAdd() {
        $('.js-dialog').html(mustache.render($('#tpl-add-dialog').html(), { }));
    }

    function openDelete() {
        var gId = $(this).closest('tr').data('id');

        $('.js-dialog').html(mustache.render($('#tpl-delete-dialog').html(), { }));
    }

    function saveFlightDiary() {
        var params = {
            'serialNumber': gId,
            'videos': [] //todo
        };

        helper.ajax(url.saveFlightDiary, params, function(res) {
            var data = res.data;
            
            if (data.code == 0) {
                msg.success('视频添加成功');
                getFlightDiary();
            } else {
                msg.success('视频添加失败，请稍后重试');
            }
        });
    }

    function deleteFlightDiary() {
        var params = {
            'id': gId
        };

        helper.ajax(url.deleteFlightDiary, params, function(res) {
            var data = res.data;
            
            if (data.code == 0) {
                msg.success('视频删除成功');
                getFlightDiary();
            } else {
                msg.success('视频删除失败，请稍后重试');
            }
        });
    }

    function uploadVideo() {
         
    }

    function cancelUpload() {

    }

    function deleteVideo() {

    }


    return {
        init: function () {
            bindActions();
        }
    }
});