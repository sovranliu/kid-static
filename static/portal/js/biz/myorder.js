define(['mustache','url', 'helper'], function(Mustache,url, helper) {

    var serialNumber;

    function bindActions() {
        $('.book-list').on('click','.js-revoke',_openRevoke);
        $('.ticket-list').on('click', '.js-give', _openGiveShare);
        $('.ticket-list').on('click','.js-return',_openRefund);
        $('.js-submit-refund').on('click',_postRufund);
        $('.js-submit').on('click',_postRevoke);
        $('.js-ticket-share').on('click', _shareTicket);
        $('.js-send-message').on('click', _sendMessage);
        $('.js-confirm-message-result').on('click', _confirmMessgeResult);
        $('.js-confirm').on('click',_closePopup);
        $('.revoke-popup').on('click','.js-confirm',function() {
            window.location.reload();
        })
    }

    function _changeTabs(){            
        $("dl.yh-bt-con>dd").hide();
        $("dl.yh-bt-con>dd").eq(0).show();
        $(".yh-bt-nav>li").each(function(){
            $(this).bind("click",function(){
                var $this=$(this),
                        thisIndex=$this.index(),
                        $tabContentAll=$("dl.yh-bt-con>dd");
                $this.addClass("current");
                $this.siblings().removeClass("current");
                $tabContentAll.hide().eq(thisIndex).show();
            })
        })
    }

    //获取票务信息
    function _getTicketData() {
        helper.ajax(url.getTickets, {}, function(data) {
            var res = data.data;
            if(data.code >= 0) {
                //如果没有飞行票则引导用户去购票页面
                if(res == null || res.length == 0) {
                    var _html = '<p class="no-title">您没有飞行票，请购买后查看。</p>';
                    $('.ticket-list').html(_html);
                }else{
                    for (var i = 0; i < res.length; i++) {
                        res[i].price = parseFloat((parseInt(res[i].price)/100).toFixed(2));
                        switch (res[i].type) {
                            case 0:
                                res[i].ticketType = "团体购票（不接受退票）";
                                break;
                            case 1:
                                res[i].ticketType = "单人购票";
                                break;
                        }
                        switch (res[i].status) {
                            case 0:
                                res[i].statusName = "可用";
                                res[i].statusStyle = "";
                                res[i].operate = true;
                                //团体票可赠送
                                if (res[i].type == 0 && res[i].isGive) {
                                    res[i].gift  = true;
                                } else if(res[i].type == 1){
                                //单人票可退款
                                    res[i].return = true;
                                }
                                break;
                            case 1:
                                res[i].statusName = "已使用";
                                res[i].statusStyle = "gray";
                                break;
                            case 2:
                                res[i].statusName = "已过期";
                                res[i].statusStyle = "gray";
                                break;
                            case 3:
                                res[i].statusName = "退票审批中";
                                res[i].statusStyle = "gray";
                                break;
                            case 4:
                                res[i].statusName = "已退票";
                                res[i].statusStyle = "gray";
                                break;
                        }
                    }

                    var ticketList = {
                        res
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
        helper.ajax(url.getUserBooks, {}, function(data) {
            var res = data.data;
            if(data.code >= 0) {
                //如果没有飞行票则引导用户去购票页面
                if(res == null || res.length == 0) {
                    var _html = '<p class="no-title">您没有预约。</p>';
                    $('.book-list').html(_html);
                }else{
                    for (var i = 0; i < res.length; i++) {
                        switch (res[i].status) {
                            case 0:
                                res[i].statusName = "已预约";
                                res[i].statusStyle = "";
                                res[i].operate = true;
                                break;
                            case 1:
                                res[i].statusName = "已过期";
                                res[i].statusStyle = "gray";
                                break;
                            case 2:
                                res[i].statusName = "已核销";
                                res[i].statusStyle = "gray";
                                break;
                            case 3:
                                res[i].statusName = "改期审批中";
                                res[i].statusStyle = "";
                                break;
                            case 4:
                                res[i].statusName = "已撤销";
                                res[i].statusStyle = "gray";
                                break;
                            case 5:
                                res[i].statusName = "撤销审批中";
                                res[i].statusStyle = "gray";
                                break;
                        }
                    }

                    var bookList = {
                        res
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
        $('.send-message').show();
    }

    function _sendMessage() {
        var tel = $.trim($('.js-phone').val());
        var params = {
            'phone': tel,
            'serialNumber': serialNumber
        };

        if (!serialNumber) {
            $('.js-send-message-result').html('请选择您要赠送的飞行票。');
            $('.send-message-result').show();
        } else if (!_checkMobileNumber(tel)) {
            $('.js-send-message-result').html('请填写有效的手机号码。');
            $('.send-message-result').show();
        } else {
            helper.ajax(url.giveTicket, params, function(res) {
                $('.send-message').hide();
                $('.send-message-result').show();

                if(res.code >= 0) {
                    $('.js-send-message-result').html('您的票券已成功送出，请对方至会员中心的预约飞行中，查看并使用他的票券。');
                    $('.send-message-result').show();
                } else {
                    $('.js-send-message-result').html('被赠送者还不是会员，请通知对方先注册成为会员，才能成功接收该票券。如24小时内对方未完成注册，票券将返还到您的帐号。');
                    $('.send-message-result').show();
                }
            });
        }
    }

    //打开退票弹框
    function _openRefund() {
        serialNumber = $(this).closest('li').attr('data-id');
        $('.refund-popup').show();
    }

    function _postRufund() {
        var $popup = $('.refund-popup');
        var params = {
            'serialNumber': serialNumber
        };

        helper.ajax(url.postRefund, params, function(res) {
            if(res.code >= 0) {
                $popup.find('p').html('您的退款申请已提交，请等待管理员审核，谢谢。');
                $popup.find('.confirm-btn').removeClass('js-submit-refund').addClass('js-confirm');
            }
        });
        $(this).off('click',_postRufund)
    }

    function _confirmMessgeResult() {
        $('.send-message-result').hide();

        //确认弹框后刷新页面
        window.location.reload();
    }

    function _shareTicket() {

        helper.ajax(url.getTickets, params, function(res) {
            if(res.code >= 0) {
                $('.revoke-popup').find('p').html('您的撤销申请已提交，请等待管理员审核，谢谢。');
                $('.revoke-popup').find('.confirm-btn').removeClass('js-submit').addClass('js-confirm');
            }
        })
    }
    //验证手机号
    function _checkMobileNumber(num) {
        var reg = /^1[3|4|5|7|8][0-9]{9}$/; //验证规则
        return reg.test(num); //true
    }

    function _closePopup() {
        $(this).parent().parent('.popup').hide();
        window.location.reload();
    }
    
    return {
        init: function() {
            bindActions();
            _changeTabs();
            _getTicketData();
            _getBookData();
        }
    }
});