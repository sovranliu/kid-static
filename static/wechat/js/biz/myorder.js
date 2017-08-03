define(['mustache','url', 'helper'], function(Mustache,url, helper) {

    var serialNumber;

    function bindActions() {
        $('.book-list').on('click','.js-revoke',_openRevoke);
        $('.ticket-list').on('click', '.js-give', _openGiveShare);
        $('.js-submit').on('click',_postRevoke);
        $('.js-ticket-give').on('click', _openGive);
        $('.js-ticket-share').on('click', _shareTicket);
        $('.js-send-message').on('click', _sendMessage);
        $('.js-confirm-message-result').on('click', _confirmMessgeResult);
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
            if(res.code == 0) {
                var data = res.data;
                //如果没有飞行票则引导用户去购票页面
                if(data == null) {
                    var _html = '<p class="no-title">您没有飞行票，请购买后查看。</p>';
                    $('.ticket-list').html(_html);
                }

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
                            if (data[i].type == 0) {
                                data[i].gift  = true;
                            } else {
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
                            data[i].statusName = "退款申请中";
                            data[i].statusStyle = "gray";
                            break;
                        case 4:
                            data[i].statusName = "已退票";
                            data[i].statusStyle = "gray";
                            break;
                    }
                }

                var ticketList = {
                    data
                };
                var template = $('#ticketTemplate').html();
                Mustache.parse(template);
                $('.ticket-list').html(Mustache.render(template, ticketList));
            }
            
        })
    }

    //获取预约信息
    function _getBookData() {
        helper.ajax(url.getUserBooks, {}, function(res) {
            if(res.code == 0) {
                var data = res.data;
                for (var i = 0; i < data.length; i++) {
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
                            data[i].statusName = "改期申请中";
                            data[i].statusStyle = "";
                            break;
                        case 4:
                            data[i].statusName = "已撤销";
                            data[i].statusStyle = "gray";
                            break;
                        case 5:
                            data[i].statusName = "撤销审核中";
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
            if(res.code == 0) {
                $('.revoke-popup').find('p').html('撤销成功，请至我的飞行票查看。');
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

        if(_checkMobileNumber(tel)) {
            helper.ajax(url.giveTicket, params, function(res) {
                if(res.code == 0) {
                    //todo 对方非会员的处理
                    $('.send-message').hide();
                    $('.send-message-result').show();
                    $('.js-send-message-result').html('您的票券已成功送出，请对方至会员中心的预约飞行中，查看并使用他的票券。');
                }
            });
        }
        
    }

    function _confirmMessgeResult() {
        $('.send-message-result').hide();
    }

    function _shareTicket() {

        helper.ajax(url.getTickets, params, function(res) {
            if(res.code == 0) {
                $('.revoke-popup').find('p').html('撤销成功，请至我的飞行票查看。');
                $('.revoke-popup').find('.confirm-btn').removeClass('js-submit').addClass('js-confirm');
            }
        })
    }

    //验证手机号
    function _checkMobileNumber(num) {
        var reg = /^1[3|4|5|7|8][0-9]{9}$/; //验证规则
        return reg.test(num); //true
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