define([], function() {
    var _basePath = 'http://121.40.90.141:8003/kid/console/'; //todo 发布时改成生产地址

    return {
        //会员信息列表
        getUserList: _basePath + 'getUserList',
        //票务信息列表
        getTicketList: _basePath + 'getTicketList',
        //退票
        refundTicket: _basePath + 'refundTicket',
        //飞行日志列表
        getFlightDiary: _basePath + 'getFlightDiary',
        //预约列表
        getBookingList: _basePath + 'getBookingList',

    };
});