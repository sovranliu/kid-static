
requirejs.config({
    baseUrl: 'webresource',
    paths: {
        /******************* libs *****************/
        underscore: 'libs/underscore-min',
        jquery: 'libs/jquery-2.2.3.min',
        mustache: 'libs/mustache.min',
        bootstrap: 'libs/bootstrap/js/bootstrap.min',
        jCookie: 'libs/jquery.cookie',
        mock: 'http://mockjs.com/dist/mock',
        datepicker: 'libs/bootstrap-datepicker',
        dateTimePicker: 'libs/bootstrap-datetimepicker.min',
        wizard: 'libs/jquery.easyWizard',
        select: 'libs/bootstrap-select.min',
        typeahead: 'libs/typeahead',
        select2: 'libs/select2/select2.full.min',
        pace: 'libs/pace/pace.min',
        icheck: 'libs/iCheck/icheck.min',
        echarts: 'libs/echarts.min',
        jsplumb: 'libs/jsplumb.min',
        jqPaginator: 'libs/jqPaginator',
        jsplumbtoolkit: 'libs/jsplumbtoolkit',
        support: 'util/support',
        common: 'util/common',
        /******************* mvcr *****************/
        controller: 'controller',
        model: 'model',
        util: 'util'
    },
    shim: {
        underscore: {
            exports: '_'
        },
        jquery: {
            exports: '$'
        },
        jCookie: {
            deps: ['jquery'],
            exports: 'jCookie'
        },
        bootstrap: {
            deps: ['jquery'],
            exports: 'bootstrap'
        },
        jsplumbtoolkit: {
            deps: ['jsplumb'],
            exports: 'jsplumbtoolkit'
        },
        support: {
            deps: ['jsplumbtoolkit'],
            exports: 'support'
        }
    }
});

require(['jquery', 'underscore', 'bootstrap', 'jCookie', 'common'], function($, _, bootstrap, jCookie, common) {
    //模块化加载页面文件
    (function() {
        var dataStart = $("script[data-main][data-start]").attr("data-start") || '';
        var startModules = dataStart.split(',');

        _.each(startModules, function(module) {
            require([module, 'app'], function(moduleObj) {
                if (moduleObj && moduleObj.init) {
                    moduleObj.init();
                }
            });
        });
        common.init();
    })();
});