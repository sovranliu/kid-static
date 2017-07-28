define(['url'], function (url) {

    function bindActions () {
        $('.js-gift-ticket').on("click", giftTicket);
        $('.js-send-message').on("click", sendMessage);
    }

    function giftTicket() {
        $('.popup').show();
    }

    function sendMessage() {
        $('.popup').hide();
    }

    function getTicketPrice() {
        var params = {};

        $.post(url.getTicketPrice, params, function(res) {
            if (!res.code) {
                $('.js-single-price').text(res.data.single);
                $('.js-group-price').text(res.data.group); 
            } else {
                //todo
            }
        }, 'json');
    }

    function getUserTickets() {
        var params = {};

        /*$.post(url.getUserTickets, params, function(res) {
            if (!res.code) {
                $('.js-single-price').text(res.data.single);
                $('.js-group-price').text(res.data.group); 
            } else {
                //todo
            }
        }, 'json');*/
    }

    function openAdd() {
        //el.$typeDialog.html(mustache.render($('#tpl-addEdit-dialog').html(), { 'title': cst.TITLE_REPLY_TYPE_CREATE }));
    }

    return {
        init: function () {
          bindActions();
          getTicketPrice();
          getUserTickets();
        }
    }
});