define(['url', 'helper','handshake'], function (url, helper,handshake) {

    function getTicketPrice() {
        var params = {};

        helper.ajax(url.getTicketPrice, params, function(res) {
            var data = res.data;

            if (res.code >= 0) {
                $('.js-single-price').text(data.single / 100);
                $('.js-group-price').text(data.group / 100); 
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