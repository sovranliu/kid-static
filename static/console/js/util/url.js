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
        deleteFlightDiary: _basePath + 'deleteFlightDiary',
        saveFlightDiary: _basePath + 'saveFlightDiary', //todo
        uploadVideo: _basePath + 'uploadFlightDiary',
        deleteVideo: _basePath + 'deleteVideo', //todo
        //预约列表
        getBookingList: _basePath + 'getBookingList',
        getBookingTime: _basePath + 'getBookingTime', //todo
        isCanBook: _basePath + 'isViableDate',
        rescheduleBooking: _basePath + 'rescheduleBooking',
        revokeBooking: _basePath + 'revokeBooking',
        getStock: _basePath + 'getBookRepositories',
        enableStock: _basePath + 'switchBookRepository',
        disableStock: _basePath + 'switchBookRepository',
        //参数配置
        getConfig: _basePath + 'getConfig',
        postConfig: _basePath + 'modifyConfig',
        //支付记录
        getOrder: _basePath + 'query/order',
        getRefund: _basePath + 'query/refund',
        //留言回复
        getMessages: _basePath + 'getMessages',
        postMessageReply: _basePath + 'postMessageReply',
        //申请
        //退票申请
        getAllRefund: _basePath + 'getAllRefund',
        accessRefund: _basePath + 'accessRefund',
        refuseRefund: _basePath + 'refuseRefund',
        //撤销申请&&&&改期申请    
        getRevokeBooks: _basePath + 'getRevokeBooks',
        approveBookChange: _basePath + 'approveBookChange',
        getRescheduleBooks: _basePath + 'getRescheduleBooks'
    };
});