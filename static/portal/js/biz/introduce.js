define(['mustache','url', 'helper'], function(Mustache,url, helper) {

    function bindActions() {
        $('.error-popup').on('click','.js-confirm', function() {
            $('.error-popup').hide();
        });
    }
    
    function _getMaterielData() {
        var params = {
            "type": 2
        }

        helper.ajax(url.getMateriel, params, function(res) {
            if(res.code >= 0) {
                var template = $('#template').html();
                Mustache.parse(template);

                _.each(res.data, function(item, i) {
                    item.odd = (i%2 == 0) ? true : false;
                });

                $('.yh-conwrap').html(Mustache.render(template, res));
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