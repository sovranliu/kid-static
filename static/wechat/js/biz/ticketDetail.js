define(['url', 'helper','handshake'], function (url, helper,handshake) {

    var serialNumber;

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

                $('.js-ticket-number').html(data.serialNumber);
                $('.js-ticket-type').html(Number(data.type) == 0 ? '团体票' : '单人票' );
                $('.js-ticket-price').html('¥' + (data.price / 100));
                $('.js-ticket-expire').html(data.expire);

                handleShare();
            } else {
                $('.js-result-success').hide();
                $('.js-result-fail').show();
            }
        });
    }

    function handleShare() {
        var params = {};

        helper.ajax(url.getShareConfig, params, function(res) {
            var data = res.data;

            alert(JSON.stringify(res));

            if(res.code >= 0) {

                /*if (typeof WeixinJSBridge == "undefined") {
                   if (document.addEventListener) {
                       document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
                   } else if (document.attachEvent) {
                       document.attachEvent('WeixinJSBridgeReady', onBridgeReady); 
                       document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
                   }
                } else {
                    onBridgeReady(data);
                }*/

                wx.config({  
                    debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。  
                    appId: data.appId, // 必填，公众号的唯一标识  
                    timestamp: data.timestamp, // 必填，生成签名的时间戳  
                    nonceStr: data.nonceStr, // 必填，生成签名的随机串  
                    signature: data.signature,// 必填，签名  
                    jsApiList: [  
                        'checkJsApi',  
                        'onMenuShareTimeline',  
                        'onMenuShareAppMessage' 
                    ]
                });  
              
                wx.ready(function () {  
                    alert('http://solution.slfuture.cn/kid/static/wechat/ReceiveTicket.html?serialNumber=' + serialNumber);
                    
                    wx.checkJsApi({ 
                      jsApiList: [
                        'onMenuShareTimeline',
                        'onMenuShareAppMessage'
                      ],
                      success: function (res) {
                        alert('分享接口可调用');
                      },
                      fail:function(){
                        alert('抱歉您的微信版本有问题不支持分享功能！');
                      }
                    });

                    wx.onMenuShareTimeline({
                        title: '赠送飞行票', // 分享标题
                        link: 'http://solution.slfuture.cn/kid/static/wechat/ReceiveTicket.html?serialNumber=' + serialNumber,
                        imgUrl: '', // 分享图标
                        success: function () {
                            window.location.href = 'MyOrder.html';
                        },
                        cancel: function () {
                            // 用户取消分享后执行的回调函数
                            //alert('cancel');
                        }
                    });

                    wx.onMenuShareAppMessage({ 
                        title: '赠送飞行票', // 分享标题  
                        link: 'http://solution.slfuture.cn/kid/static/wechat/ReceiveTicket.html?serialNumber=' + serialNumber, 
                        imgUrl: '', // 分享图标  
                        trigger: function (res) {
                          alert('用户点击发送给朋友');
                        },
                        success: function () {   
                            window.location.href = 'MyOrder.html';
                        },  
                        cancel: function (res) {   
                           alert(JSON.stringify(res)); 
                        },
                        fail: function (res) {
                          alert(JSON.stringify(res));
                        }
                    });

                    wx.error(function(res){  
                        alert('wx error');
                    });  
                });


            }
        })
    }

    return {
        init: function () {
            handshake.init();
            getUrlParams();
            getTicketDetail();
        }
    }
});