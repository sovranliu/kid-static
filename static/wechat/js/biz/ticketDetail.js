define(['url', 'helper','handshake','wechat'], function (url, helper,handshake,wx) {

    var serialNumber;

    function bindActions() {
        $('.error-popup').on('click','.js-confirm', function() {
            $('.error-popup').hide();
        });
    }

    function getUrlParams() {
        serialNumber =  helper.getQueryStr('serialNumber');
    }

    function getTicketDetail() {
        var params = {
            'serialNumber': serialNumber
        };

        helper.ajax(url.getTicketDetail, params, function(res) {
            var data = res.data;

            if (res.code >= 0) {
                $('.js-result-success').show();
                $('.js-result-fail').hide();
                $('.share-wrapper').show();

                $('.js-ticket-number').html(data.serialNumber);
                $('.js-ticket-type').html(Number(data.type) == 0 ? '团体票' : '单人票' );
                $('.js-ticket-price').html('¥' + (data.price / 100));
                $('.js-ticket-expire').html(data.expire);

                handleShare();
            } else {
                $('.js-result-success').hide();
                $('.js-result-fail').show();
                $('.share-wrapper').hide();
            }
        });
    }

    function handleShare() {
        var params = {};

        helper.ajax(url.getShareConfig, params, function(res) {
            var data = res.data;

            if(res.code >= 0) {

                wx.config({  
                    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。  
                    appId: data.appId, // 必填，公众号的唯一标识  
                    timestamp: data.timestamp, // 必填，生成签名的时间戳  
                    nonceStr: data.nonceStr, // 必填，生成签名的随机串  
                    signature: data.signature,// 必填，签名  
                    jsApiList: [  
                        'checkJsApi',  
                        'onMenuShareAppMessage' 
                    ]
                });  
              
                wx.ready(function () {  
                    
                    wx.onMenuShareAppMessage({ 
                        title: '赠送飞行票', // 分享标题  
                        link: 'http://yahaifeixing.cn/kid/static/wechat/ReceiveTicket.html?serialNumber=' + serialNumber, 
                        imgUrl: 'http://yahaifeixing.cn/kid/static/portal/images/logo.png', // 分享图标  
                        success: function () {   
                            window.location.href = 'MyOrder.html';
                        },  
                        fail: function (res) {
                        }
                    });

                    wx.error(function(res){  
                    });  
                });
            } else {
                res.msg && $('.error-popup').show().find('p').html(res.msg);
            }
        })
    }

    return {
        init: function () {
            handshake.init();
            bindActions();
            getUrlParams();
            getTicketDetail();
        }
    }
});