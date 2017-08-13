define(['url', 'helper','handshake'], function (url, helper,handshake) {

    var serialNumber;

    function getUrlParams() {
        serialNumber =  helper.getQueryStr('serialNumber');
    }

    function receiveTicket() {
        var params = {
            'serialNumber': serialNumber
        };

        helper.ajax(url.receiveTicket, params, function(res) {
            var data = res.data;

            if (res.code == 0) {
                if (data && data.result) {
                    $('.js-result-success').show();
                    $('.js-result-fail').hide();
                } else {
                    $('.js-result-success').hide();
                    $('.js-result-fail').show();
                    $('.js-fail-text').html(res.msg);
                }
            } else {
                $('.js-result-success').hide();
                $('.js-result-fail').show();
                $('.js-fail-text').html(res.msg);
            }
        });
    }

    return {
        init: function () {
            handshake.init();
            getUrlParams();
            receiveTicket();
        }
    }
});