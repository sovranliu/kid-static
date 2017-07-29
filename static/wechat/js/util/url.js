define([], function() {
    var _basePath = 'http://121.40.90.141:8003/kid/wechat/'; //todo 发布时改成生产地址

    return {
        getTicketPrice: _basePath + 'getTicketPrice',
        getTickets: _basePath + 'getTickets',
        buyFlightDiary: _basePath + 'buyFlightDiary',
        submitBooking: _basePath + 'submitBooking',
        getBookingTime: _basePath + 'getBookingTime',
        getBookableNum: _basePath + 'getBookableNum',
        buyTicket: _basePath + 'buyTicket',
        getFlightDiary: _basePath + 'getFlightDiary',
        getUserTickets: _basePath + 'getTickets',
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
        getTickets: _basePath + 'getTickets',
        buyFlightDiary: _basePath + 'buyFlightDiary',
        submitBooking: _basePath + 'submitBooking',
        getBookingTime: _basePath + 'getBookingTime',
        getBookableNum: _basePath + 'getBookableNum',
        buyTicket: _basePath + 'buyTicket',
        getFlightDiary: _basePath + 'getFlightDiary'
>>>>>>> update
    };
});