define(['mustache','url', 'helper'], function(Mustache,url, helper) {

    function bindActions() {
        $('.book-list').on('click','.js-revoke',_openRevoke);
        $('.js-submit').on('click',_postRevoke);
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
            //如果没有飞行票则引导用户去购票页面
            if(res == null) {
                var _html = '<p class="no-title">您没有飞行票，请购买后查看。</p>';
                $('.ticket-list').html(_html);
            }

            for (var i = 0; i < res.length; i++) {
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
                        if (res[i].type == 0) {
                            res[i].gift  = true;
                        } else {
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
        })
    }

    //获取预约信息
    function _getBookData() {
        helper.ajax(url.getUserBooks, {}, function(res) {
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
                        res[i].statusName = "改期申请中";
                        res[i].statusStyle = "";
                        break;
                }
            }

            var bookList = {
                res
            };
            var template = $('#bookTemplate').html();
            Mustache.parse(template);
            $('.book-list').html(Mustache.render(template, bookList));
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
            "ticketId":ticketId
        };

        helper.ajax(url.getTickets, params, function(res) {
            $('.revoke-popup').find('p').html('撤销成功，请至我的飞行票查看。');
            $('.revoke-popup').find('.confirm-btn').removeClass('js-submit').addClass('js-confirm');
        })
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