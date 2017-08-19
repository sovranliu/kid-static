define(['mustache','url', 'helper'], function(Mustache,url, helper) {

    function bindActions() {
        $('.error-popup').on('click','.js-confirm', function() {
            $('.error-popup').hide();
        });
    }

    function _getMaterielData() {
        var params = {
            "type": 1
        }

        helper.ajax(url.getMateriel, params, function(res) {
            if (res.code >= 0) {
                var template = $('#template').html();
                Mustache.parse(template);
                $('.yh-mp-list').html(Mustache.render(template, res));
            } else {
                res.msg && $('.error-popup').show().find('p').html(res.msg);
            }
        })
    }

    return {
        init: function() {
            bindActions();
            _getMaterielData();
        }
    }
});