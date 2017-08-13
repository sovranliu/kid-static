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
            window.location.href = "MyOrder.html"
        });
        $('.js-close').on('click', _closePopup);
    }

    //获取要退的票券信息
    function _getTicketData() {
        var params = {
            "serialNumber": ticketId
        }

        helper.ajax(url.getRefund, params, function(res) {
            if(res.code >= 0) {
                res.data.price = parseFloat((parseInt(res.data.price)/100).toFixed(2))
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
                $popup.find('p').html('您的退款申请已提交，请等待管理员审核，谢谢。');
                $('.js-close').hide();
            }else{
                $popup.find('p').html(res.msg);
            }
            $popup.find('.confirm-btn').removeClass('js-submit').addClass('js-confirm');
        })
    }

    function _closePopup() {
        $(this).parent().parent('.popup').hide();
    }

    return {
        init: function() {
            handshake.init();
            bindActions();
            _getTicketData();
        }
    }
});