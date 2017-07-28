define([], function() {
    var _basePath = 'http://121.40.90.141:8003/kid/wechat/'; //todo 发布时改成生产地址

    return {
        getTicketPrice: _basePath + 'getTicketPrice',
        getTickets: _basePath + 'getTickets',
        getUserInfo: _basePath + 'getUserInfo',
        payOrder: _basePath + 'payOrder'
    };
});