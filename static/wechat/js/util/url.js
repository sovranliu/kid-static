define([], function() {
    var _basePath = 'http://121.40.90.141:8003/kid/wechat/'; //todo 发布时改成生产地址

    return {
        //购票
        getTicketPrice: _basePath + 'getTicketPrice',
        getTickets: _basePath + 'getTickets',
        buyTicket: _basePath + 'buyTicket',
        //预约飞行
        getBookingTime: _basePath + 'getBookingTime',
        getBookableNum: _basePath + 'getBookableNum',
        submitBooking: _basePath + 'submitBooking',
        //飞行日志
        getFlightDiary: _basePath + 'getFlightDiary',
        buyFlightDiary: _basePath + 'buyFlightDiary',
        //编辑用户信息
        getUserInfo: _basePath + 'getUserInfo',
        postUserInfo: _basePath + 'postUserInfo',
        //留言
        getMessageData: _basePath + 'getMessageData',
        postMessageData: _basePath + 'postUserInfo',
        //会员权益
        postBenefit: _basePath + 'postUserInfo',
        //预约相关
        getUserBooks: _basePath + 'getBooks',
        //退款相关
        getRefund: _basePath + 'getRefund',
        postRefund: _basePath + 'postUserInfo',
        //赠送票券
        giveTicket: _basePath + 'giveTicket'

    };
});