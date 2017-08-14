define([], function() {
    //var _basePath = 'http://121.40.90.141:8003/kid/portal/'; //todo 发布时改成生产地址
    var _basePath = '/kid/portal/'; //todo 发布时改成生产地址
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
        getVerificationCode: _basePath + 'getVerificationCode',
        //留言
        getMessageData: _basePath + 'getMessage',
        postMessageData: _basePath + 'postMessage',
        //会员权益
        postBenefit: _basePath + 'postBenefit',
        //预约相关
        getUserBooks: _basePath + 'getBooks',
        postRevoke: _basePath + 'postRevoke',
        //退款相关
        getRefund: _basePath + 'getRefund',
        postRefund: _basePath + 'postRefund',
        //赠送票券
        giveTicket: _basePath + 'giveTicket',
        //会员特惠
        getMateriel: _basePath + 'getMateriel',
        //登陆注册
        getLogin: _basePath + 'login/qrcode',
        checkLogin: _basePath + 'login/check'
    };
});