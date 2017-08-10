/*登陆授权*/
define(['helper','url'], function(helper,url) {

    function _init() {
        helper.ajax(url.handshake,{},function (res) {
        	if(res.code >= 0) {
                
        	}
        })
    }
    
    return {
        init: function() {
            _init()
        }
    };
});