define(['url', 'helper'], function (url, helper) {

    var ticketType;

    function bindActions() {
        $('.js-ticket-type').on('click', checkTicketType);
        $('.js-buy-ticket').on('click', buyTicket);
        $('.js-notes-open').on('click', openNote);
        $('.js-notes-close').on('click', closeNote);
        $('.js-confirm').on('click',closePay)
    }


    function checkTicketType(e) {
        $('.js-ticket-type').removeClass('current');
        $(e.currentTarget).addClass('current');
    }

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

    function buyTicket() {
        var needRefundInsurance = $('.js-switch-refundInsurance').is(':checked');
        ticketType = $('current').data('type')
        var params = {
            'ticketType': parseInt(ticketType),
            'needRefundInsurance': needRefundInsurance
        };

        helper.ajax(url.buyTicket, params, function(res) {
            var data = res.data;
            if(res.code == 0) {
                $('.js-pay').show().find('img').attr('scr',data.qrcode);
            }
        });
    }

    function openNote() {
        $('.js-notes').show();
    }

    function closeNote() {
        $('.js-notes').hide();
    }
    function closePay() {
        $('.js-pay').hide();
    }

    return {
        init: function () {
          bindActions();
          getTicketPrice();
        }
    }
});