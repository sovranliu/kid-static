define(['jCookie'], function(jCookie) {
    function _initPage() {
        $('.js-header-username').html($.cookie('userName'));
    }

    function _logout() {
        $('.js-header-logout').on('click', function() {
            $.removeCookie('userName', {
                path: '/'
            });
            $.removeCookie('token', {
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
        $('.menu').find('a').each(function() {
            var menuTypeMacth = $(this).attr('href');
            
            if (menuTypeMacth == tarType) {
                $(this).parent('li').addClass('active');
                if (!$(this).parent().hasClass('droplink')) {
                    $(this).parent().parent().parent('.droplink').addClass('active open');
                }
            }

        })
    }

    return {
        init: function() {
            _initPage();
            _matchMenu();
            _logout();
        }
    }

});