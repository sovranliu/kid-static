define(['url', 'helper','handshake'], function (url, helper,handshake) {

    /*function bindActions() {
        $('.js-gift-ticket').on('click', giftTicket);
        $('.js-send-message').on('click', sendMessage);
    }

    function giftTicket() {
        $('.popup').show();
    }

    function sendMessage() {
        $('.popup').hide();
    }*/

    function getTicketPrice() {
        var params = {};

        helper.ajax(url.getTicketPrice, params, function(res) {
            var data = res.data;
            if(res.code == 0) {
                $('.js-single-price').text(data.single);
                $('.js-group-price').text(data.group); 
            }
        });
    }

    /*function getTickets() {
        var params = {};

        helper.ajax(url.getTickets, params, function(res) {
            if (!res.code) {
                $('.js-ticket-list').html(mustache.render($('#ticketTmpl').html(), { 'ticketList': res.data }));
            } else {
                //todo
            }
        });
    }*/

    return {
        init: function () {
            handshake.init();
          //bindActions();
            getTicketPrice();
          //getTickets();
        }
    }
});