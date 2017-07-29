define([], function() {
    var _basePath = 'http://121.40.90.141:8003/kid/wechat/'; //todo 发布时改成生产地址

    return {
        getTicketPrice: _basePath + 'getTicketPrice',
        getTickets: _basePath + 'getTickets',
        getUserInfo: _basePath + 'getUserInfo',
        buyFlightDiary: _basePath + 'buyFlightDiary',
        submitBooking: _basePath + 'submitBooking',
        getBookingTime: _basePath + 'getBookingTime',
        getBookableNum: _basePath + 'getBookableNum',
        buyTicket: _basePath + 'buyTicket',
        getFlightDiary: _basePath + 'getFlightDiary'
    };
});