define(['url', 'helper', 'mustache', 'message'], function (url, helper, mustache, msg) {

    var gId;

    function bindActions() {
        $('.js-search').on('click', getFlightDiary);
        $('.js-reset').on('click', handleReset);
        $('.js-add').on('click', openAdd);
        $('.js-tbody').on('click', '.js-delete', openDelete);
        $('.js-dialog').on('change', '.js-upload-input', uploadFile);
        $('.js-dialog').on('click', '.js-upload-submit', submitUpload);
        $('.js-dialog').on('click', '.js-upload-cancel', cancelUpload);
        $('.js-dialog').on('click', '.js-upload-delete', deleteVideo);
        $('.js-dialog').on('click', '.js-save', saveFlightDiary);
        $('.js-dialog').on('click', '.js-confirm', deleteFlightDiary);
    }

    function initPage() {
        $('.js-filter-serialNumber').val(helper.getQueryStr('serialNumber') || '');

        if (helper.getQueryStr('serialNumber')) {
           getFlightDiary(); 
        }
    }

    function handleReset() {
        $('.js-filter-input').val('');
        $('.js-table').hide();

        getFlightDiary();
    }

    function buildSearchParams() {
        var serialNumber = $('.js-filter-serialNumber').val();

        var params = {
            'serialNumber': $.trim(serialNumber)
        };

        if (!serialNumber) {
            msg.error('请选择您要查询的票号');
            return;
        }

        return params;
    }

    function getFlightDiary() {
        var params = buildSearchParams();

        helper.ajax(url.getFlightDiary, params, function(res) {
            var data = res.data;
            
            $('.js-table').show();

            if (res.code >= 0) {
                if (!data || data.length == 0) {
                    $('.js-tbody').html('<td colspan=4 class="dataNull">该票号暂无礼品信息</td>');
                } else {
                    $('.js-tbody').html(mustache.render($('#tpl-tbody').html(), { 'data': data }));
                }
            } else {
                msg.error('获取礼品数据失败，请稍候重试');
            }
        });
    }

    function openAdd() {
        $('.js-dialog').html(mustache.render($('#tpl-add-dialog').html(), { }));
    }

    function openDelete() {
        gId = $(this).closest('tr').data('id');

        $('.js-dialog').html(mustache.render($('#tpl-delete-dialog').html(), { }));
    }

    function saveFlightDiary() {
        var serialNumber = $('.js-new-serialNumber').val();
        var $videoItem = $('.js-video-item');
        var videos = [];

        _.each($videoItem, function(item, i) {
            if ($(item).data('id')) {
                videos.push($(item).data('id'));
            }
        });

        if (!serialNumber) {
            msg.error('请输入票全流水号', $('.js-dialog').find('.alert-message'));
            return;
        }
        if (videos.length == 0) {
            msg.error('请上传视频', $('.js-dialog').find('.alert-message'));
            return;
        }

        var params = {
            'serialNumber': serialNumber,
            'idStr': videos.join(',')
        };

        helper.ajax(url.saveFlightDiary, params, function(res) {
            $('.js-dialog').modal('hide');
            
            if (res.code >= 0) {
                msg.success('礼品添加成功');
                $('.js-filter-serialNumber').val(serialNumber);
                getFlightDiary();
            } else {
                msg.error('礼品添加失败，请稍后重试');
            }
        });
    }

    function deleteFlightDiary() {
        var params = {
            'id': gId
        };

        helper.ajax(url.deleteFlightDiary, params, function(res) {
            $('.js-dialog').modal('hide');

            if (res.code >= 0) {
                msg.success('礼品删除成功');
                getFlightDiary();
            } else {
                msg.error('礼品删除失败，请稍后重试');
            }
        });
    }

    function uploadFile() {
        var filenameAttr = $(this).val().split('\\');
        var filename = filenameAttr[filenameAttr.length - 1];
        var $file = $('.js-upload-input');
        var file = $file.length > 0 ? $file[0].files[0] : "";

        /*if (!file || file.size >= 20480000) { //20M
            msg.error('您上传的视频超出限制，请处理后重试', $('.js-dialog').find('.alert-message'));
            cancelUpload();
            return;
        }*/

        if (!file || file.size == 0) {
            msg.error('请选择上传视频', $('.js-dialog').find('.alert-message'));
            cancelUpload();
            return;
        }

        if (!/\.(mp4)$/.test(filename)) {
            msg.error('仅支持mp4格式的视频，请重新上传', $('.js-dialog').find('.alert-message'));
            cancelUpload();
            return;
        }

        $('.js-upload-name').text(filename);
        $('.js-upload-size').text((file.size / 1000).toFixed(2) + 'KB');
    }

    function submitUpload() {
        var $file = $('.js-upload-input');
        var file = $file.length > 0 ? $file[0].files[0] : "";

        if ($file.length == 0 || !file || file.size == 0) {
            msg.error('请选择上传视频', $('.js-dialog').find('.alert-message'));
            cancelUpload();
            return;
        }

        var formData = new FormData();
        formData.append('file', file);

        $.ajax({
            url: url.uploadVideo,
            type: 'POST',
            cache: false,
            data: formData,
            processData: false,
            contentType: false
        }).done(function (res) {
            if (res.code >= 0) {
                msg.success('上传成功', $('.js-dialog').find('.alert-message'));
                $('.js-video-list').append(mustache.render($('#tpl-video-item').html(), { 'data': res.data }));
                setVideoMask();
                cancelUpload();
            } else {
                msg.error('上传失败，请重试', $('.js-dialog').find('.alert-message'));
                cancelUpload();
            }
        }).fail(function (res) {
            msg.error('上传失败，请重试', $('.js-dialog').find('.alert-message'));
            cancelUpload();
        });
    }

    function setVideoMask() {
        $('.js-video-item').hover(function() {
            $('.js-video-mask').stop().animate({height:'200px'}, 400).show();
        }, function() {
            $('.js-video-mask').stop().animate({height:'0px'}, 400).hide();
        });
    }

    function cancelUpload() {
        //清空文件名和文件大小显示容器
        $('.js-upload-name').text('');
        $('.js-upload-size').text('');
        $('.js-upload-result').text('');

        //清空input file中的内容
        $('.js-upload-input').val('');
    }

    function deleteVideo() {
        var $item = $(this).closest('.js-video-item');
        var videoId = $item.data('id');

        var params = {
            'id': videoId
        };

        helper.ajax(url.deleteFlightDiary, params, function(res) {
            if (res.code >= 0) {
                msg.success('视频删除成功', $('.js-dialog').find('.alert-message'));
                $item.remove();
            } else {
                msg.error('视频删除失败，请稍后重试', $('.js-dialog').find('.alert-message'));
            }
        });
    }


    return {
        init: function () {
            bindActions();
            initPage();
        }
    }
});