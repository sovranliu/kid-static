define(['url', 'helper','handshake'], function (url, helper,handshake) {

    function getTicketPrice() {
        var params = {};

        helper.ajax(url.getTicketPrice, params, function(res) {
            var data = res.data;

            if (res.code >= 0) {
                $('.js-single-price').text((Number(data.single) / 100).toFixed(2));
                $('.js-group-price').text((Number(data.group) / 100).toFixed(2)); 
            }
        });
    }

    return {
        init: function () {
            handshake.init();
            getTicketPrice();
        }
    }
});