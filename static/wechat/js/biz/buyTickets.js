define(['url', 'helper','handshake'], function (url, helper,handshake) {

    function getTicketPrice() {
        var params = {};

        helper.ajax(url.getTicketPrice, params, function(res) {
            var data = res.data;

            if (res.code == 0) {
                $('.js-single-price').text(data.single);
                $('.js-group-price').text(data.group); 
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