define(['url', 'helper'], function (url, helper) {

    var ticketType = 1;

    function bindActions() {
        $('.js-ticket-type').on('click', checkTicketType);
        $('.js-buy-ticket').on('click', buyTicket);
        $('.js-notes-open').on('click', openNote);
        $('.js-notes-close').on('click', closeNote);
        $('.js-insurance').on('click',openInsuranceNote)
        $('.js-confirm').on('click',closePay)
    }


    function checkTicketType(e) {
        var $refundInsurance = $('.js-refundInsurance');

        $('.js-ticket-type').removeClass('current');
        $(e.currentTarget).addClass('current');

        ticketType = Number($('.js-ticket-type.current').data('type'));

        if (ticketType == 0) {
            $refundInsurance.hide();
        } else {
            $refundInsurance.show();
        }
    }

    function getTicketPrice() {
        var params = {};

        helper.ajax(url.getTicketPrice, params, function(res) {
            var data = res.data;
            if(res.code >= 0) {
                $('.js-single-price').text(data.single / 100);
                $('.js-group-price').text(data.group / 100); 
            }
            
        });
    }

    function buyTicket() {
        var needRefundInsurance = $('.js-switch-refundInsurance').is(':checked');

        var params = {
            'ticketType': ticketType,
            'needRefundInsurance': needRefundInsurance
        };

        helper.ajax(url.buyTicket, params, function(res) {
            var data = res.data;

            if (res.code >= 0) {
                $('.js-pay').show();
                $('.js-pay-qrcode').attr('src', data.qrcode);
            } else {
                //todo
            }
        });
    }

    function openNote() {
        $('.js-notes').show();
    }

    function closeNote() {
        $('.popup').hide();
    }

    function openInsuranceNote() {
        $('.js-insurance-notes').show();
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