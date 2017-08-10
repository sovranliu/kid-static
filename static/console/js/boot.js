
requirejs.config({
    baseUrl: 'js/',
    paths: {
        /******************* libs *****************/
        underscore: 'libs/underscore-min',
        jquery: 'libs/jquery.min',
        mustache: 'libs/mustache.min',
        bootstrap: 'libs/bootstrap.min',
        jCookie: 'libs/jquery.cookie',
        dateTimePicker: 'libs/bootstrap-datetimepicker.min',
        fileupload: 'libs/jquery.fileupload',
        //datepicker: 'libs/bootstrap-datepicker',
        //dateTimePicker: 'libs/bootstrap-datetimepicker.min',
        /******************* utils *****************/
        message: 'util/message',
        paginator: 'util/paginator',
        modern: 'util/modern',
        common: 'util/common',
        helper: 'util/helper',
        url: 'util/url'
    },
    shim: {
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
        fileupload: {
            deps: ['jquery'],
            exports: 'fileupload'
        }
    }
});

require(['jquery', 'underscore', 'bootstrap', 'jCookie', 'common'], function($, _, bootstrap, jCookie, common) {
    (function() {
        var dataStart = $("script[data-main][data-start]").attr("data-start") || '';
        var startModules = dataStart.split(',');

        _.each(startModules, function(module) {
            require([module,'util/modern'], function(moduleObj) {
                if (moduleObj && moduleObj.init) {
                    moduleObj.init();
                }
            });
        });
        common.init();
    })();
});