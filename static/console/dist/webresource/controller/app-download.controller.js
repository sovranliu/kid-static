
define(['jquery', 'underscore', 'model/app-download.model', 'util/constant', 'util/help', 'jqPaginator'], function($, _, model, cst, help, jqPaginator) {

    "use strict";

    var $view, el;
    var AppCategory = []; //全局保存APP父类型
    var index = 0,
        flag = false;

    function mapElements() {
        el = {
            $listClass: $view.find('.js-tabs'),
            $listTable: $view.find('.tab-content'),
            $inputADName: $view.find('.js-ad-name'),
            $inputADOwner: $view.find('.js-ad-owner'),
            $modal: $view.find('#modal-dialog'),
            $modalMsg: $view.find('.js-msg-modal'),
            $btnAdd: $view.find('.js-add')
        };
    }

    function bindActions() {
        el.$listClass.on('click', '.js-category-item', _showTabs);
        el.$listTable.on('click', '.js-edit', _showModal);
        el.$listTable.on('click', '.js-del', _showDelModal);
        el.$listTable.on('click', '.js-look-adver', _showAdConfigTable);
        el.$listTable.on('click', '.js-look-url', _showUrlConfigTable);
        el.$listTable.on('click', '.js-add-new', _addNewConfig);
        el.$btnAdd.on('click', _showAddBaseModal);
        el.$modal.on('click', '.js-save', _saveBaseData);
        el.$modal.on('click', '.js-save-adver', _saveAdverData);
        el.$modal.on('click', '.js-save-url', _saveUrlData);
        el.$modal.on('click', '.js-save-del', _delData);
    }

    /**
     * 初始化页面
     */
    function _initPage() {
        _getAppCategory();
    }

    /**
     * 获取分类
     */
    function _getAppCategory() {
        var params = {
            "parentCategory": "APPDOWNLOAD"
        }

        model.getAppCategory(params, function(data) {
            AppCategory = data.adDictionaryDtoList;
            el.$listClass.html(_.template($('#categroyTmpl').html(), {
                data: AppCategory
            }));
            el.$listClass.find('li').eq(0).addClass('active').siblings('li').removeClass('active');
            var type = el.$listClass.find('li').eq(0).find('a').attr('data-sub');
            _getTableData(type);
        });
    }

    /**
     * 构建查询参数
     */
    function _getTableData(type) {
        var tagName, operator, count;
        var params = {
            "adType": type,
            "source": "", //TODO
            "sourceName": ""
        }
        model.getADLiast(params, function(data) {
            _processData(data, type)
        });
    }


    /**
     * 选择父类
     */
    function _showTabs(type) {
        flag = false;
        if (typeof(type) != 'string') {
            type = $(this).data('sub');
        }
        //初始化搜索框
        el.$inputADName.val("");
        el.$inputADOwner.val("");
        _getTableData(type);
    }


    /**
     * 预处理数据
     */
    function _processData(data, type) {
        var path = {};
        path.ADtype = type;
        _.each(data.advertiserList, function(item, i) {
            item.datachangeLasttime = help.formatDate(new Date(item.datachangeLasttime), "YYYY-MM-DD hh:mm:ss");
        });
        path.advertiserList = data.advertiserList;
        el.$listTable.html(_.template($('#tableTmpl').html(), path));

        if (flag) {
            var current = el.$listClass.find('li').eq(index);
            var atype = current.find('a').attr('data-sub');

            current.addClass('active').siblings('li').removeClass('active');
            _showTabs(atype);
        }
    }

    /**
     * 点击打开新增弹框
     */
    function _showAddBaseModal() {
        var data = {};
        var adType = el.$listClass.find('li.active a').attr('data-sub');
        el.$modal.find('.js-filter-input').val("");

        data.title = "新增基本信息";
        data.advertiserId = "";
        data.type = "add";
        data.adType = "";
        data.base = "";
        data.adDictionaryDtoList = AppCategory;
        el.$modal.html(_.template($('#aeModalTmpl').html(), data));
        el.$modal.find('.js-adType').val(adType);
    }

    /**
     * 点击打开编辑弹框
     */
    function _showModal() {
        var _this = $(this);
        var type = $(this).attr('data-editType');
        var data = {};
        data.title = "编辑";
        switch (type) {

            case "base":
                data.id = _this.closest('tr').attr('data-id');
                data.sourceName = _this.closest('tr').find('.js-td-name').text();
                data.advertiserId = _this.closest('tr').attr('data-id');
                var id = _this.closest('tr').attr('data-id');
                data.type = "edit";
                model.getDetails({
                    "type": 'BASE',
                    "advertiserId": id
                }, function(result) {
                    data.base = result.adBaseDetial;
                    el.$modal.html(_.template($('#aeModalTmpl').html(), data));
                    //渲染基础信息的状态&结算方式
                    if (data.base.status == 1) {
                        $('#statusRun').prop('checked', true)
                    } else {
                        $('#statusStop').prop('checked', true)
                    }
                    $('.js-settleType').val(data.base.settleType);

                })
                break;

            case "adver":
                data.advertiserId = _this.siblings('table').attr('data-id')
                data.type = "old";
                data.configType = _this.attr('data-type');
                data.configID = _this.attr('data-id');
                data.configKey = _this.siblings('table').find('.js-td-configKey').text();
                data.configValue = _this.siblings('table').find('.js-td-configValue').text();
                data.remark = _this.siblings('table').find('.js-td-remark').text();

                el.$modal.html(_.template($('#adConfigTmpl').html(), data));

                //如果configValue是json则格式化后展示
                var obj, pretty;
                if (!data.configValue.match("^\{(.+:.+,*){1,}\}$")) {
                    pretty = data.configValue;
                } else {
                    obj = JSON.parse(data.configValue);
                    pretty = JSON.stringify(obj, undefined, 4);
                }
                $('.js-configValue').val(pretty);
                break;

            case "url":
                data.advertiserId = _this.siblings('table').attr('data-id')
                data.type = "old";
                data.configType = _this.attr('data-type');
                data.configID = _this.attr('data-id');
                data.feedbackUrl = _this.siblings('table').find('.js-td-feedbackUrl').text();
                el.$modal.html(_.template($('#urlConfigTmpl').html(), data));
                break;
        }
    }

    /**
     * 展示广告商自定义配置信息
     */
    function _showAdConfigTable() {
        var _this = $(this);

        //渲染所有自定义信息
        var advertiserId = $(this).closest('tr').attr('data-id');

        model.getDetails({
            "advertiserId": advertiserId,
            "type": "ADCONFIG"
        }, function(data) {
            data.advertiserId = advertiserId;
            _this.closest('tr').next('.js-config-detail').html(_.template($('#adConfigTableTmpl').html(), data)).removeClass('hide');
            //如果configValue是json则格式化后展示
            if (data.adConfigDetail != null) {
                var obj, pretty, arrValue = [];
                for (var i = 0; i < data.adConfigDetail.length; i++) {
                    for (var j = 0; j < data.adConfigDetail[i].items.length; j++) {
                        if (!data.adConfigDetail[i].items[j].configValue.match("^\{(.+:.+,*){1,}\}$")) {
                            arrValue.push(data.adConfigDetail[i].items[j].configValue);
                        } else {
                            obj = JSON.parse(data.adConfigDetail[i].items[j].configValue);
                            pretty = JSON.stringify(obj, undefined, 4);
                            arrValue.push(pretty)
                        }
                    }
                }

                $('.js-td-configValue').each(function(index) {
                    $(this).val(arrValue[index]);
                })
            }

            _toggleConfigPanel(_this);

        })
    }



    /**
     * 展示URL配置信息
     */
    function _showUrlConfigTable() {
        var _this = $(this);
        var advertiserId = $(this).closest('tr').attr('data-id');

        model.getDetails({
            "advertiserId": advertiserId,
            "type": "URLCONFIG"
        }, function(data) {
            data.advertiserId = advertiserId;
            _this.closest('tr').next('.js-config-detail').html(_.template($('#urlConfigTableTmpl').html(), data)).show();

            _toggleConfigPanel(_this);

        })
    }

    /**
     * 展示隐藏的自定义信息面板
     */
    function _toggleConfigPanel(_this) {
        var $row = _this.closest('tr'),
            $class = _this.find('i').attr('class');
        if ($class.indexOf('fa-plus') != -1) {
            _this.find('i').removeClass('fa-plus').addClass('fa-minus');
            _this.parent().siblings('a').find('.fa-minus').addClass('fa-plus').removeClass('fa-minus');
            _this.closest('tr').next('.js-config-detail').show();
        } else {
            _this.find('i').removeClass('fa-minus').addClass('fa-plus');
            _this.closest('tr').next('.js-config-detail').hide();
        }
    }

    /**
     * 点击打开删除弹框
     */
    function _showDelModal() {
        var type = $(this).attr('data-delType');
        var data = {}
        switch (type) {
            case "base":
                data = {
                    "id": $(this).closest('tr').attr('data-id'),
                    "name": '渠道客户',
                    "type": 'BASE'
                }
                break;
            case "adver":
                data = {
                    "id": $(this).attr('data-id'),
                    "name": '自定义配置',
                    "type": 'ADCONFIG'
                }
                break;
            case "url":
                data = {
                    "id": $(this).attr('data-id'),
                    "name": 'URL配置',
                    "type": 'URLCONFIG'
                }
                break;
        }
        el.$modal.html(_.template($('#delModalTmpl').html(), data));

    }
    /**
     * 新增配置
     */
    function _addNewConfig() {
        //初始化弹框
        el.$modal.html("");

        var _this = $(this),
            addType = _this.attr('data-type'),
            id = _this.attr('data-id');
        var data = {
            "advertiserId": id,
            "type": "new",
            "title": "新增",
            "configType": "",
            "configID": "",
            "configKey": "",
            "remark": ""
        }
        if (addType == "adver") {
            model.getAppCategory({
                "parentCategory": 'ADER_CONFIGTYPE'
            }, function(result) {
                data.adDictionaryDtoList = result.adDictionaryDtoList;
                el.$modal.html(_.template($('#adConfigTmpl').html(), data));
            })
        }

        if (addType == "url") {
            data.feedbackUrl = "";
            model.getAppCategory({
                "parentCategory": 'URL_EVENTTYPE'
            }, function(result) {
                data.adDictionaryDtoList = result.adDictionaryDtoList;
                el.$modal.html(_.template($('#urlConfigTmpl').html(), data));
            })
        }
    }


    /**
     * 提交基础信息
     */
    function _saveBaseData() {
        var advertiserId = $('.appdownload-modal').attr('data-id');
        var status = $('#statusRun').prop('checked') ? 1 : 0;
        var params = {
            "advertiserId": advertiserId || "", //该条广告商信息id，主键
            "description": $.trim($('.js-desc').val()),
            "settleType": $('.js-settleType').val(),
            "source": $.trim($('.js-source').val()),
            "sourceName": $.trim($('.js-name').val()),
            "status": status,
            "adType": $('.js-adType').val() || $(this).attr('data-adType'),
            "secretKey": $.trim($('.js-secretKey').val()),
            "operator": $.cookie('userName')
        }
        if (_checkInput()) {
            model.updateBaseData(params, function(data) {
                _afterSaveData(data, cst.SAVE_ALL_MSG)
            })
        }
    }


    /**
     * 提交广告配置信息
     */
    function _saveAdverData() {
        var _this = $(this),
            configItem = _this.closest('.modal');
        var type = $(this).attr('data-addType');
        var advertiserId = $('.appdownload-modal').attr('data-id');

        var params = {
            "advertiserId": advertiserId,
            "configId": _this.attr('data-id') || "", // 该条配置ID，主键
            "configKey": $.trim(configItem.find('.js-configKey').val()),
            "configType": configItem.find('.js-configType').val() || _this.attr('data-type'),
            "configValue": $.trim(configItem.find('.js-configValue').val()),
            "remark": $.trim(configItem.find('.js-desc').val()),
        };
        if (_checkInput()) {
            _this.attr("disabled", true);

            model.updateAdverData(params, function(data) {
                _this.removeAttr("disabled");
                _afterSaveData(data, cst.SAVE_ALL_MSG);
            })
        }
    }

    /**
     * 提交URL配置信息
     */
    function _saveUrlData() {
        var _this = $(this),
            configItem = _this.closest('.modal');
        var type = $(this).attr('data-addType');
        var advertiserId = $('.appdownload-modal').attr('data-id');
        var feedbackConfigId, eventType;

        var params = {
            "advertiserId": advertiserId,
            "feedbackConfigId": _this.attr('data-id') || "", // 该条配置ID，主键
            "eventType": _this.attr('data-type') || configItem.find('.js-eventType').val(),
            "feedbackUrl": $.trim(configItem.find('.js-url').val())
        };
        if (_checkInput()) {
            _this.attr("disabled", true);

            model.updateUrlData(params, function(data) {
                _this.removeAttr("disabled");
                _afterSaveData(data, cst.SAVE_ALL_MSG);
            })
        }
    }

    /**
     * 确认删除事件
     */
    function _delData() {
        var id = $(this).attr('data-id'),
            type = $(this).attr('data-type');

        $(this).attr("disabled", true);

        model.delAppConfig({
            "id": id,
            "type": type
        }, function(data) {
            $(this).removeAttr("disabled");
            _afterSaveData(data, cst.SAVE_DEL_MSG);
        })
    }

    function _afterSaveData(data, msg) {
        flag = true;
        index = el.$listClass.find('li.active').index();
        el.$modal.modal('hide');
        if (data.success) {
            help.success(msg);
        } else {
            help.error(data.msg);
        }
        _getAppCategory();
    }

    function _checkInput() {
        //判断必填项是否填写
        var $input = el.$modal.find('.js-filter-input');
        var isCheck = true,
            checkName;
        try {
            $input.each(function(i) {
                if ($.trim($(this).val()) == '') {
                    $('.js-error').html(cst.NODE_CHECK_ERROR_EMPTY);
                    isCheck = false;
                    throw 'error';
                    return;
                } else {
                    isCheck = true;
                    $('.js-error').html();
                }
            });
            return isCheck;
        } catch (e) {
            return;
        }
    }

    return {
        init: function() {
            $view = $('.js-app-download');
            mapElements();
            bindActions();
            _initPage();
        }
    }
});