define(['url','helper'], function(url,helper) {
    
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
    	$('body').on('click','.js-confirm',function() {
    		$('.js-qrcode-popup').hide();
    	})
    }
    //判断是不是首页
    function checkHomePage() {
        var path = window.location.pathname;
        if(path.indexOf("HomePage.html") != -1) {
            var islogin = helper.getQueryStr('login');
            if(islogin) {
                _getLogin();
            }else{
                _init();
            }
        }else{
            _init();
        }
    }

    //获取用户信息
    function _init() {
        helper.ajax(url.getUserInfo,{},function(res) {
            if(res.data != null) {
                $('.sign-in').html('<div class="fl"><span>姓名：' + res.data.userName + '</span><a href="MemberCenter.html"><span>会员级别：初级飞行员</span></a></div>')
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
                setInterval(_checkLogin(res.data.code),2000);
            }
    	})
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