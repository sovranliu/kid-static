define(['url','helper'], function(url,helper) {
    var checkLogin;
    var _qrcodepopup = '<div class="js-qrcode-popup popup">' 
            		 + '<div class="pop-mask"></div>'
           			 + '<div class="pop-con">'
                	 + '<img class="qrcode-img">'
                     + '<p class="cen">请打开微信客户端 扫一扫</p>'
                	 + '<button class="js-confirm fl">确认</button>'
                	 + '<div class="js-confirm close"></div></div></div>';

    function bindActions() {
    	$('.sign-in').on('click','.js-register',_getRegister);
    	$('.sign-in').on('click','.js-login',_getLogin);
        $('.sign-in').on('click','.js-logout',_logout);
    	$('body').on('click','.js-confirm',function() {
    		$('.js-qrcode-popup').hide();
            clearInterval(checkLogin);
    	})
    }
    //判断是不是首页
    function checkHomePage() {
        var path = window.location.pathname;
        if(path.indexOf("HomePage.html") != -1) {
            var islogin = helper.getQueryStr('login');
            if(islogin) {
                _getLogin();
            }
        } else if(path.indexOf("HomePage") != -1 || path.indexOf("MembershipPrice") != -1 || path.indexOf("TicketNotes") != -1 || path.indexOf("QRCode") != -1 || path.indexOf("Introduction") != -1 || path.indexOf("MemberBenefitDetail") != -1) {
            if($.cookie('userName') && $.cookie('avatarUrl')) {
                $('.sign-in').html('<img class="fl" src="' + $.cookie('avatarUrl') + '"></img><div class="fl"><a href="MemberCenter.html"><span>姓名：' + $.cookie('userName')+ '</span><span>会员级别：初级飞行员</span></a></div><div class="js-logout logout-btn">【注销】</div>')
            }else{
                $('.sign-in').html('<button class="js-login">登录</button> <button class="js-register">注册</button>');
            }
        }else{
            _init();
        }
    }

    //获取用户信息
    function _init() {
        helper.ajax(url.getUserInfo,{},function(res) {
            if(res.data != null) {
                $.cookie('userName',res.data.userName);
                $.cookie('avatarUrl',res.data.avatarUrl);
                if(!res.data.avatarUrl){
                    $.cookie('avatarUrl','images/user-default.png');
                }
                $('.sign-in').html('<img class="fl" src="' + res.data.avatarUrl + '"></img><div class="fl"><a href="MemberCenter.html"><span>姓名：' + res.data.userName + '</span><span>会员级别：初级飞行员</span></a></div><div class="js-logout logout-btn">【注销】</div>')
            }else{
                $('.sign-in').html('<button class="js-login">登录</button> <button class="js-register">注册</button>');
            }
        })
    }

    function _getRegister() {
    		$('body').append(_qrcodepopup);
    		$('.js-qrcode-popup').show().find('img').attr('src','/kid/portal/register/qrcode.jpg');
    }

    function _getLogin() {
    	helper.ajax(url.getLogin,{},function(res) {
            if(res.code >= 0) {
                $('body').append(_qrcodepopup);
                $('.js-qrcode-popup').show().find('img').attr('src',res.data.qrcode);
                checkLogin = setInterval(function() {
                    _checkLogin(res.data.code)
                },2000);
            }
    	})
    }

    function _logout() {
        $.cookie('aid', '', '/kid/static/portal');
        $.cookie('avatarUrl', '', '/kid/static/portal');
        $.cookie('sid', '', '/kid/static/portal');
        $.cookie('userName', '', '/kid/static/portal');
        window.location.href = 'MemberCenter.html';
    }

    function _checkLogin(code) {
        helper.ajax(url.checkLogin,{"code":code},function(res) {
            if(res.code >= 0) {
                if(res.data != null && res.data != "") {
                    window.location.href = "MemberCenter.html";
                }
            }
        })
    }

    return {
        init: function () {
        	bindActions();
            checkHomePage();
        }

    };
});