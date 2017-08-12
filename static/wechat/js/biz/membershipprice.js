define(['mustache','url', 'helper','handshake'], function(Mustache,url, helper,handshake) {

    function _getMaterielData() {
        var params = {
            "type": 'preference'
        }

        helper.ajax(url.getMateriel, params, function(res) {
            if(res.code >= 0) {
                if(res.data.length > 2) {
                    $('.move-down').removeClass('hide');
                }

                var template = $('#template').html();
                Mustache.parse(template);
                $('.msp-list').html(Mustache.render(template, res));
            }
        })
    }

    return {
        init: function() {
            handshake.init();
            _getMaterielData();
        }
    }
});