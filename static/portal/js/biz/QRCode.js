define(['mustache','url', 'helper'], function(Mustache,url, helper) {

    function _getMaterielData() {
        var params = {
            "type": 3
        }

        helper.ajax(url.getMateriel, params, function(res) {
            if(res.code >= 0) {
                var template = $('#template').html();
                Mustache.parse(template);
                $('.yh-qr-list').html(Mustache.render(template, res));
            }
        })
    }

    return {
        init: function() {
            _getMaterielData();
        }
    }
});