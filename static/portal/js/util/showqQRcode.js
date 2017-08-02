define(['url','helper'], function(url,helper) {
    
    var _qrcodepopup = '<div class="js-qrcode-popup popup">' 
            		 + '<div class="pop-mask"></div>'
           			 + '<div class="pop-con">'
                	 + '<img>'
                	 + '<button class="js-confirm fl">确认</button>'
                	 + '<div class="js-confirm close"></div></div></div>';

    function bindActions() {
    	$('.js-register').on('click',_getRegister);
    	$('.js-login').on('click',_getLogin);
    	$('body').on('click','.js-confirm',function() {
    		$('.js-qrcode-popup').hide();
    	})
    }

    function _getRegister() {
    		$('body').append(_qrcodepopup);
    		$('.js-qrcode-popup').show().find('img').attr('scr','/kid/portal/qrcode/register.jpg');
    }

    function _getLogin() {
    	helper.ajax(url.getLogin,{},function(res) {
    		$('body').append(_qrcodepopup);
    		debugger

    		$('.js-qrcode-popup').show().find('img').attr('scr',res);
    	})
    }

    return {
        init: function () {
        	bindActions();
        }

    };
});