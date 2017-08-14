define([], function() {
    //var _basePath = 'http://121.40.90.141:8003/kid/console/'; //todo 发布时改成生产地址
    var _basePath = '/kid/console/'
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
        getFlightDiary: _basePath + 'getFlightDiary',
        deleteFlightDiary: _basePath + 'deleteFlightDiary',
        saveFlightDiary: _basePath + 'postFlightDiary',
        uploadVideo: _basePath + 'uploadFlightDiary',
        //预约列表
        getBookingList: _basePath + 'getBookingList',
        getBookingTime: _basePath + 'getBookingTime',
        isCanBook: _basePath + 'isViableDate',
        rescheduleBooking: _basePath + 'rescheduleBooking',
        revokeBooking: _basePath + 'revokeBooking',
        completeBooking: _basePath + 'completeBooking',
        getStock: _basePath + 'getBookRepositories',
        enableStock: _basePath + 'switchBookRepository',
        disableStock: _basePath + 'switchBookRepository',
        //参数配置
        getConfig: _basePath + 'getConfig',
        postConfig: _basePath + 'modifyConfig',
        //支付记录
        getOrder: _basePath + 'query/order',
        getRefund: _basePath + 'query/refund',
        //物料
        getMateriel: _basePath + 'getMateriel',
        uploadImage: _basePath + 'uploadImage',
        insertMateriel: _basePath + 'insertMateriel',
        updateMateriel: _basePath + 'updateMateriel',
        deleteMateriel: _basePath + 'deleteMateriel',
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
        getRescheduleBooks: _basePath + 'getRescheduleBooks',
        //更新管理员
        updateAdmin: _basePath + 'updateAdmin',
        modifyPassword: _basePath + 'modifyPassword'
    };
});