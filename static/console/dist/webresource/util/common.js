
define(['jquery', 'jCookie', 'pace'], function($, jCookie, pace) {
    function _renderPageInit() {
        $('.js-username').html($.cookie('userName'));
    }

    function _logout() {
        $('.js-logout').on('click', function() {
            $.removeCookie('userName', {
                path: '/'
            });
            $.removeCookie('token', {
                path: '/'
            });
            $.removeCookie('dept', {
                path: '/'
            });
            $.removeCookie('email', {
                path: '/'
            });
            window.location.href = './login.html';
        })
    }

    /**
     * 初始化左侧菜单样式
     */
    function _matchMenu() {
        var menuType = window.location.pathname,
            mtArr = menuType.split('/'),
            tarType = mtArr[mtArr.length - 1];
        $('.main-sidebar').find('a').each(function() {
            var menuTypeMacth = $(this).attr('href');
            //特殊情况
            if (tarType == 'meteor-config.html') {
                tarType = 'meteor-scene.html'
            }
            if (tarType.indexOf('fetch-scene-') != -1) {
                tarType = 'fetch-scene-list.html'
            }
            if (tarType.indexOf('fetch-label-') != -1) {
                tarType = 'fetch-label-list.html'
            }
            if (menuTypeMacth == tarType) {
                $(this).parent('li').addClass('active');
                if (!$(this).parent().hasClass('treeview')) {
                    $(this).parent().parent().parent('.treeview').addClass('active');
                }
            }

        })
    }

    return {
        init: function() {
            _renderPageInit();
            _matchMenu();
            _logout();
            pace.start();
        }
    }

});