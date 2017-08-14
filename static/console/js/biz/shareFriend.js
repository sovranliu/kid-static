define(['url', 'helper', 'mustache','message','paginator'], function (url, helper, mustache,msg,paginator) {

    var serialNumber;
    var pageNum = 1,limit = 20;

    function bindActions() {
        $('.js-add').on('click',openAdd);
        $('.js-table').on('click','.js-edit',openEdit);
        $('.js-table').on('click','.js-del',openDel);
        $('.js-reset').on('click', handleReset);
        $('.js-dialog').on('click','.js-save',saveEditData);
        $('.js-dialog').on('click','.js-confirm',saveDelData);
        $('.js-dialog').on('click','.js-change-img', showUpload);
        $('.js-dialog').on('change', '.js-upload-input', uploadFile);
        $('.js-dialog').on('click', '.js-upload-submit', submitUpload);
        $('.js-dialog').on('click', '.js-upload-cancel', cancelUpload);
        $('.js-dialog').on('click', '.js-upload-delete', deleteImage);
    }

    function handleReset() {
        $('.js-filter-input').val('');
        $('.js-table').hide();

        pageNum = 1;
        getMaterielData();
    }

    function getMaterielData() {
        var params = {
            "type":3,
            "begin": pageNum,
            "limit": limit
        }
        helper.ajax(url.getMateriel, params, function(res) {
            if(res.code >= 0) {
                if(res.data.list.length == 0) {
                    $('.js-tbody').html('<td colspan="5" class="dataNull">还没有分享资讯</td>');
                }else{
                    $('.js-tbody').html(mustache.render($('#tpl-tbody').html(), { 'data': res.data.list}));
                }
                $('.js-tpage').createPage({
                    pageCount: Math.ceil(res.data.total / limit), //todo
                    current: pageNum,
                    backFn: function (selectedPageNum) {
                        pageNum = selectedPageNum;
                        getOrderData();
                    }
                });
            }
        });
    }

    function openAdd() {
        var $row = $(this).closest("tr");
        var data = {
            "type":"新增",
            "id":"",
            "title":"",
            "imgUrl":"",
            "link":"",
        }
        $('.js-dialog').html(mustache.render($('#tpl-edit-dialog').html(), data));
        $('.js-upload-img').removeClass('hide');
    }

    function openEdit() {
        var $row = $(this).closest("tr");
        var data = {
            "type":"编辑",
            "isEdit":true,
            "id":$row.attr('data-id'),
            "title":$row.find('.js-td-title').text(),
            "imgUrl":$row.find('.js-td-img img').attr('data-src'),
            "link":$row.find('.js-td-link a').text(),
        }
        $('.js-dialog').html(mustache.render($('#tpl-edit-dialog').html(), data));
    }

    function openDel() {
        var $row = $(this).closest("tr");
        var id = $row.attr('data-id');
        var title = $row.find('.js-td-title').text();
        var data = {
            "id":id,
            "title":title
        }
        $('.js-dialog').html(mustache.render($('#tpl-del-dialog').html(), data));
    }

    function showUpload() {
        $(this).closest(".form-group").hide();
        $('.js-upload-img').removeClass('hide');
    }

    function saveEditData() {
        var $modal = $("#modal-dialog");
        var id = $(this).attr('data-id'); 
        var data = {
            "id":id || "",
            "title":$modal.find('.js-title').val(),
            "imgUrl":$modal.find('.js-img-item img').attr('src'),
            "link":$modal.find('.js-link').val(),
            "type":1
        }

        if(id != "") {
            helper.ajax(url.updateMateriel, data, function(res) {
                if(res.code >= 0) {
                    msg.success('更新成功。');
                    $('.js-dialog').modal('hide');
                    getMaterielData();
                }else{
                    msg.error(res.msg);
                }
            });
        }else{
            helper.ajax(url.insertMateriel, data, function(res) {
                if(res.code >= 0) {
                    msg.success('新增成功。');
                    $('.js-dialog').modal('hide');
                    getMaterielData();
                }else{
                    msg.error(res.msg);
                }
            });
        }
        
    }

    function saveDelData() {
        var $modal = $("#modal-dialog");
        var data = {
            "id":$(this).attr('data-id')
        }

        helper.ajax(url.deleteMateriel, data, function(res) {
            if(res.code >= 0) {
                msg.success('删除成功。');
                $('.js-dialog').modal('hide');
                getMaterielData();
            }else{
                msg.error('删除失败，请稍后尝试。');
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

        if (!/\.(jpg|jpeg|png)$/.test(filename)) {
            msg.error('仅支持jpg/png格式的图片，请重新上传', $('.js-dialog').find('.alert-message'));
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
            msg.error('请选择上传图片', $('.js-dialog').find('.alert-message'));
            cancelUpload();
            return;
        }

        var formData = new FormData();
        formData.append('file', file);
        //formData.append('qrCodesCommonReq', JSON.stringify(params));
        $.ajax({
            url: url.uploadImage,
            type: 'POST',
            cache: false,
            data: formData,
            processData: false,
            contentType: false
        }).done(function (data) {
            if(data.code >= 0) {
                msg.success('上传成功', $('.js-dialog').find('.alert-message'));
                $('.js-img-list').html(mustache.render($('#tpl-img-item').html(), { 'data': data.data }));
                cancelUpload();
            }else{
                msg.error(data.msg);
            }
        }).fail(function (data) {
            msg.error('上传失败，请重试', $('.js-dialog').find('.alert-message'));
            cancelUpload();
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

    function deleteImage() {
        var $item = $(this).closest('.js-img-item');

        $item.remove();
    }

    return {
        init: function () {
          bindActions();
          getMaterielData();
        }
    }
});