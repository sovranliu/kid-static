define(['url','helper'], function(url,helper) {
    
    var _qrcodepopup = '<div class="js-qrcode-popup popup">' 
            		 + '<div class="pop-mask"></div>'
           			 + '<div class="pop-con">'
                	 + '<img>'
                     + '<p class="cen">请打开微信客户端“扫一扫” </p>'
                	 + '<button class="js-confirm fl">确认</button>'
                	 + '<div class="js-confirm close"></div></div></div>';

    function bindActions() {
    	$('.sign-in').on('click','.js-register',_getRegister);
    	$('.sign-in').on('click','.js-login',_getLogin);
    	$('body').on('click','.js-confirm',function() {
    		$('.js-qrcode-popup').hide();
    	})
    }

    //获取用户信息
    function _init() {
        helper.ajax(url.getUserInfo,{},function(res) {
            if(res.data != null) {
                $('.sign-in').html('<div class="fl"><span>姓名：' + res.data.userName + '</span><span>会员级别：初级飞行员</spam></div>')
            }else{
                $('.sign-in').html('<button class="js-login">登录</button> <button class="js-register">注册</button>');
            }
        })
    }

    function _getRegister() {
    		$('body').append(_qrcodepopup);
    		$('.js-qrcode-popup').show().find('img').attr('scr','/kid/portal/qrcode/register.jpg');
    }

    function _getLogin() {
    	helper.ajax(url.getLogin,{},function(res) {
            if(res.code == 0) {
                $('body').append(_qrcodepopup);
                $('.js-qrcode-popup').show().find('img').attr('scr',res.qrcode);
            }
    	})
        setInterval(_checkLogin(res.code),2000);
    }

    function _checkLogin(code) {
        helper.ajax(url.checkLogin,{"code":code},function(res) {
            if(res.code == 0) {
                if(res.data != null && res.data != "") {
                    window.location.reload();
                }
            }
        })
    }

    return {
        init: function () {
            _init();
        	bindActions();
        }

    };
});