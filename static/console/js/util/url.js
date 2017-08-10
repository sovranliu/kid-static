define([], function() {
    var _basePath = 'http://121.40.90.141:8003/kid/console/'; //todo 发布时改成生产地址

    return {
        //登陆
        getLogin: _basePath + 'getLogin',
        //会员信息列表
        getUserList: _basePath + 'getUserList',
        //票务信息列表
        getTicketList: _basePath + 'getTicketList',
        //退票
        refundTicket: _basePath + 'refundTicket',
        //飞行日志列表
        getFlightDiary: _basePath + 'getFlightDiary', //todo
        deleteFlightDiary: _basePath + 'deleteFlightDiary', //todo
        saveFlightDiary: _basePath + 'saveFlightDiary', //todo
        //预约列表
        getBookingList: _basePath + 'getBookingList',
        getStock: _basePath + 'getStock', //todo
        enableStock: _basePath + 'enableStock', //todo
        disableStock: _basePath + 'disableStock', //todo
        //参数配置
        getConfig: _basePath + 'getConfig',
        postConfig: _basePath + 'modifyConfig',
        //支付记录
        getOrder: _basePath + 'query/order',
        getRefund: _basePath + 'query/refund',
        //留言回复
        getMessages: _basePath + 'getMessages',
        postMessageReply: _basePath + 'postMessageReply'
    };
});