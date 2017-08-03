define([], function() {
    var _basePath = 'http://121.40.90.141:8003/kid/console/'; //todo 发布时改成生产地址

    return {
        //会员信息列表
        getUserList: _basePath + 'getUserList',
        //票务信息列表
        getTickets: _basePath + 'getTickets',
        //预约飞行
        getBookingTime: _basePath + 'getBookingTime',
        submitBooking: _basePath + 'submitBooking',
        //飞行日志
        getFlightDiary: _basePath + 'getFlightDiary',

    };
});