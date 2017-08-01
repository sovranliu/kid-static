
define(['util/constant'], function(cst) {

    /********** API基路径 ****************/
    var _basePath, _basePathDev, basePathAuth, _basePathFetch;

    var hostname = window.location.hostname.toLowerCase();
    _basePath = '';
        
    //_basePathFetch = window.location.protocol + '//' + window.location.host + '/dmp-datamanagement/exchange-offline/';
    _basePathDev = "webresource/mock/"
    return {
        basePath: _basePath,
        basePathDev: _basePathDev, //mock
        basePathAuth: _basePathAuth, //权限相关地址
        basePathFetch: _basePathFetch //取数标签相关地址
    }
});