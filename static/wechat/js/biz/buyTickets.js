define(['url', 'helper'], function (url, helper) {

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
            if (!res.code) {
                $('.js-single-price').text(res.data.single);
                $('.js-group-price').text(res.data.group); 
            } else {
                //todo
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
          //bindActions();
          getTicketPrice();
          //getTickets();
        }
    }
});