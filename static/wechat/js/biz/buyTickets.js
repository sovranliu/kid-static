define(['url', 'helper','handshake'], function (url, helper,handshake) {

    function bindActions() {
        $('.error-popup').on('click','.js-confirm', function() {
            $('.error-popup').hide();
        });
    }

    function getTicketPrice() {
        var params = {};

        helper.ajax(url.getTicketPrice, params, function(res) {
            var data = res.data;

            if (res.code >= 0) {
                $('.js-single-price').text((Number(data.single) / 100).toFixed(2));
                $('.js-group-price').text((Number(data.group) / 100).toFixed(2)); 
            } else {
                res.msg && $('.error-popup').show().find('p').html(res.msg);
            }
        });
    }

    return {
        init: function () {
            handshake.init();
            bindActions();
            getTicketPrice();
        }
    }
});