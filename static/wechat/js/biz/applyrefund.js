define(['mustache','url', 'helper','handshake'], function(Mustache,url, helper,handshake) {

    var ticketId = helper.getQueryStr('ticketId');
    var $popup = $('.popup');
    function bindActions() {
        $('.js-refund').on('click', function() {
            $popup.show();
            $popup.find('p').html('确认取消该门票吗？');
        });
        $('.js-submit').on('click',_postRefundData);
        $popup.on('click', '.js-confirm',function() {
            $popup.hide();
            window.history.go(-1);
        });
    }

    //获取要退的票券信息
    function _getTicketData() {
        var params = {
            "serialNumber": ticketId
        }

        helper.ajax(url.getRefund, params, function(res) {
            if(res.code >= 0) {
                var template = $('#template').html();
                Mustache.parse(template);
                $('.ar-content').html(Mustache.render(template, res.data));
            }
        })
    }

    //提交退款
    function _postRefundData() {
        var params = {
            "serialNumber": ticketId
        }

        helper.ajax(url.postRefund, params, function(res) {
            if(res.code >=0) {
                $popup.find('p').html('退款成功，零钱支付的退款20分钟内到账，银行卡支付的退款3个工作日后到账，请知晓。');
            }else{
                $popup.find('p').html(res.msg);
            }
            $popup.find('.confirm-btn').removeClass('js-submit').addClass('js-confirm');
        })
    }

    return {
        init: function() {
            handshake.init();
            bindActions();
            _getTicketData();
        }
    }
});