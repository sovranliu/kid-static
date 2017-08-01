requirejs.config({
    baseUrl: 'js/',
    paths: {
        /******************* libs *****************/
        jquery: 'libs/jquery.min',
        underscore: 'libs/underscore-min',
        mustache: 'libs/mustache.min',
        bootstrap: 'libs/bootstrap.min',
        jCookie: 'libs/jquery.cookie',
        datePicker: 'libs/datePicker',
        swiper:'libs/swiper.min',
        /******************* utils *****************/
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
        }
    }
});

require(['jquery', 'underscore', 'mustache', 'bootstrap', 'jCookie','swiper'], function($, _, mustache, bootstrap, jCookie,Swiper) {
    (function() {
        var dataStart = $('script[data-main][data-start]').attr('data-start') || '';
        var startModules = dataStart.split(',');

        _.each(startModules, function(module) {
            require([module], function(moduleObj) {
                if (moduleObj && moduleObj.init) {
                    moduleObj.init();
                }
            });
        });
        var swiper = new Swiper('.swiper-container', {
            // pagination: '.swiper-pagination',
            nextButton: '.swiper-button-next',
            prevButton: '.swiper-button-prev',
            paginationClickable: true,
            spaceBetween: 30,
            centeredSlides: true,
            autoplay: 2500,
            autoplayDisableOnInteraction: false
        });
    })();
});