define(['mustache','url', 'helper','handshake','wechat'], function(Mustache,url, helper,handshake,wx) {

    var serialNumber;

    function bindActions() {
        $('.book-list').on('click','.js-revoke',_openRevoke);
        $('.ticket-list').on('click', '.js-give', _openGiveShare);
        $('.js-submit').on('click',_postRevoke);
        $('.js-ticket-give').on('click', _openGive);
        $('.js-ticket-share').on('click', _shareTicket);
        $('.js-send-message').on('click', _sendMessage);
        $('.js-close').on('click', _closePopup);
        $('.js-confirm-message-result').on('click', _confirmMessgeResult);
        //$('.js-revoke').on('click', _handleRevoke);
        $('.revoke-popup').on('click','.js-confirm',function() {
            $('.revoke-popup').hide();
            window.location.reload();
        })
    }

    function _changeTabs() {
        $("dl.table-main>dd").hide();
        $("dl.table-main>dd").eq(0).show();
        $(".tab-plugin>a").each(function(){
            $(this).bind("click",function(){
                var $this=$(this),
                        thisIndex=$this.index(),
                        $tabContentAll=$("dl.table-main>dd");
                $this.addClass("tab-active");
                $this.siblings().removeClass("tab-active");
                $tabContentAll.hide().eq(thisIndex).show();
            })
        })
    }

    //获取票务信息
    function _getTicketData() {
        helper.ajax(url.getTickets, {}, function(res) {
            if(res.code >= 0) {
                var data = res.data;
                //如果没有飞行票则引导用户去购票页面
                if(data == null || data.length == 0) {
                    var _html = '<p class="no-title">您没有飞行票，请购买后查看。</p>';
                    $('.ticket-list').html(_html);
                }else{
                    for (var i = 0; i < data.length; i++) {
                        switch (data[i].type) {
                            case 0:
                                data[i].ticketType = "团体购票（不接受退票）";
                                break;
                            case 1:
                                data[i].ticketType = "单人购票";
                                break;
                        }
                        switch (data[i].status) {
                            case 0:
                                data[i].statusName = "可用";
                                data[i].statusStyle = "";
                                data[i].operate = true;
                                //团体票可赠送
                                if (data[i].type == 0 && data[i].isGive) {
                                    data[i].gift  = true;
                                } else if(data[i].type == 1) {
                                //单人票可退款
                                    data[i].return = true;
                                }
                                break;
                            case 1:
                                data[i].statusName = "已使用";
                                data[i].statusStyle = "gray";
                                break;
                            case 2:
                                data[i].statusName = "已过期";
                                data[i].statusStyle = "gray";
                                break;
                            case 3:
                                data[i].statusName = "退票审批中";
                                data[i].statusStyle = "gray";
                                break;
                            case 4:
                                data[i].statusName = "已退票";
                                data[i].statusStyle = "gray";
                                break;
                        }
                        data[i].price = parseFloat((parseInt(data[i].price)/100).toFixed(2));
                    }

                    var ticketList = {
                        data
                    };
                    var template = $('#ticketTemplate').html();
                    Mustache.parse(template);
                    $('.ticket-list').html(Mustache.render(template, ticketList));
                }
            }
        })
    }

    //获取预约信息
    function _getBookData() {
        helper.ajax(url.getUserBooks, {}, function(res) {
            if(res.code >= 0) {
                var data = res.data;
                //如果没有预约则显示没有预约
                if(data == null || data.length == 0) {
                    var _html = '<p class="no-title">您没有预约。</p>';
                    $('.book-list').html(_html);
                }else{
                    for (var i = 0; i < data.length; i++) {
                        switch (data[i].type) {
                            case 0:
                                data[i].isSingle = false;
                                break;
                            case 1:
                                data[i].isSingle = true;
                                break;
                        }
                        switch (data[i].status) {
                            case 0:
                                data[i].statusName = "已预约";
                                data[i].statusStyle = "";
                                data[i].operate = true;
                                break;
                            case 1:
                                data[i].statusName = "已过期";
                                data[i].statusStyle = "gray";
                                break;
                            case 2:
                                data[i].statusName = "已核销";
                                data[i].statusStyle = "gray";
                                break;
                            case 3:
                                data[i].statusName = "改期审批中";
                                data[i].statusStyle = "";
                                break;
                            case 4:
                                data[i].statusName = "已撤销";
                                data[i].statusStyle = "gray";
                                break;
                            case 5:
                                data[i].statusName = "撤销审批中";
                                data[i].statusStyle = "gray";
                                break;
                        }
                    }

                    var bookList = {
                        data
                    };
                    var template = $('#bookTemplate').html();
                    Mustache.parse(template);
                    $('.book-list').html(Mustache.render(template, bookList));
                }
            }
        })
    }

    //撤销弹框
    function _openRevoke() {
        var id = $(this).closest('li').attr('data-id');
        $('.revoke-popup').show();
        $('.revoke-popup').find('.js-submit').attr('data-id',id);
    }

    //撤销
    function _postRevoke() {
        var ticketId = $(this).attr('data-id');
        var params = {
            "serialNumber":ticketId
        };

        helper.ajax(url.postRevoke, params, function(res) {
            if(res.code >= 0) {
                $('.revoke-popup').find('p').html('您的撤销申请已提交，请等待管理员审核，谢谢。');
                $('.revoke-popup').find('.confirm-btn').removeClass('js-submit').addClass('js-confirm');
            }
        })
    }

    //打开赠送分享弹框
    function _openGiveShare() {
        serialNumber = $(this).closest('li').attr('data-id');
        $('.give-popup').show();
    }

    function _openGive() {
        $('.give-popup').hide();
        $('.send-message').show();
    }

    function _sendMessage() {
        var tel = $.trim($('.js-phone').val());

        var params = {
            'phone': tel,
            'serialNumber': serialNumber
        };

        if(!serialNumber) {
            $('.js-send-message-result').html('请选择您要赠送的飞行票。');
            $('.send-message-result').show();
            $('.give-popup').hide();
        } else if(!_checkMobileNumber(tel)) {
            $('.js-send-message-result').html('请填写有效的手机号码。');
            $('.send-message-result').show();
            $('.give-popup').hide();
        } else {
            helper.ajax(url.giveTicket, params, function(res) {
                $('.send-message').hide();
                $('.send-message-result').show();

                if(res.code >= 0) {
                    $('.js-send-message-result').html('您的票券已成功送出，请对方至会员中心的预约飞行中，查看并使用他的票券。');
                    $('.send-message-result').show();
                    $('.give-popup').hide();
                } else {
                    $('.js-send-message-result').html('被赠送者还不是会员，请通知对方先注册成为会员，才能成功接收该票券。如24小时内对方未完成注册，票券将返还到您的帐号。');
                    $('.send-message-result').show();
                    $('.give-popup').hide();
                }
            });
        }
        
    }

    function _confirmMessgeResult() {
        $('.send-message-result').hide();
        window.location.reload();
    }

    function onBridgeReady(data) {
        WeixinJSBridge.on('menu:share:appmessage', function(argv) {  
            WeixinJSBridge.invoke('sendAppMessage',{
                "appid":data.appId, //appid 设置空就好了。
                "img_url": window.location.origin + '/kid/static/wechat/images/logo.png', //分享时所带的图片路径
                "img_width": "120", //图片宽度
                "img_height": "120", //图片高度
                "link":window.location.origin + '/kid/static/wechat/ReceiveTicket.html?serialNumber=' + serialNumber, //分享附带链接地址
                "desc":"赠送飞行票给我的朋友", //分享内容介绍
                "title":"赠送飞行票"
            }, function(res){
                $('.send-message-result').show();
                $('.js-send-message-result').html('<p style="text-align:center">分享成功</p>');
            }); 
        });  
    }

    function _shareTicket() {
        window.location.href = "TicketDetail.html?serialNumber=" + serialNumber;
    }
    
    /*function _shareTicket() {
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
                }
                alert('wx config');
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
                        link: 'http://solution.slfuture.cn/kid/static/wechat/ReceiveTicket.html',
                        imgUrl: '', // 分享图标
                        success: function () {
                            $('.send-message-result').show();
                            $('.js-send-message-result').html('<p style="text-align:center;">分享成功</p>');
                        },
                        cancel: function () {
                            // 用户取消分享后执行的回调函数
                            //alert('cancel');
                        }
                    });
                    wx.onMenuShareAppMessage({ 
                        title: '赠送飞行票', // 分享标题  
                        link: 'http://solution.slfuture.cn/kid/static/wechat/ReceiveTicket.html', // 分享链接  
                        imgUrl: '', // 分享图标  
                        trigger: function (res) {
                          alert('用户点击发送给朋友');
                        },
                        success: function () {   
                            $('.send-message-result').show();
                            $('.js-send-message-result').html('<p style="text-align:center;">分享成功</p>');
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
                        // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。  
                        $('.send-message-result').show();
                        $('.js-send-message-result').html('错误信息：' + res); 
                    });  
                });
            }
        })
    }*/

    //验证手机号
    function _checkMobileNumber(num) {
        var reg = /^1[3|4|5|7|8][0-9]{9}$/; //验证规则
        return reg.test(num); //true
    }

    function _closePopup() {
        $(this).parent().parent('.popup').hide();
    }
    
    return {
        init: function() {
            handshake.init();
            bindActions();
            _changeTabs();
            _getTicketData();
            _getBookData();
        }
    }
});