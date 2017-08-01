define(['url', 'helper'], function (url, helper) {

    var ticketType;

    function bindActions() {
        $('.js-ticket-type').on('click', checkTicketType);
        $('.js-buy-ticket').on('click', buyTicket);
        $('.js-notes-open').on('click', openNote);
        $('.js-notes-close').on('click', closeNote);
    }

    function getUrlParams() {
        ticketType = helper.getQueryStr('ticketType');
    }

    function checkTicketType(e) {
        $('.js-ticket-type').removeClass('current');
        $(e.currentTarget).addClass('current');
    }

    function getTicketPrice() {
        var params = {};

        helper.ajax(url.getTicketPrice, params, function(data) {
            $('.js-single-price').text(data.single);
            $('.js-group-price').text(data.group); 
        });
    }

    function buyTicket() {
        var needRefundInsurance = $('.js-switch-refundInsurance').is(':checked');

        var params = {
            'ticketType': ticketType,
            'needRefundInsurance': needRefundInsurance
        };

        helper.ajax(url.buyTicket, params, function(data) {
            //服务端返回二维码，用于微信端操作
        });
    }

    function openNote() {
        $('.js-notes').show();
    }

    function closeNote() {
        $('.js-notes').hide();
    }

    return {
        init: function () {
          bindActions();
          getUrlParams();
          getTicketPrice();
        }
    }
});