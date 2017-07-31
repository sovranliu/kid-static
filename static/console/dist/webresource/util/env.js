
define(['util/constant'], function(cst) {

    /********** API基路径 ****************/
    var _basePath, _basePathDev, basePathAuth, _basePathFetch;

    var hostname = window.location.hostname.toLowerCase();
    if (hostname.indexOf("localhost") > -1 || hostname.indexOf("10.32") > -1 || hostname.indexOf("fat") > -1) {
        _basePath = 'http://webapi.soa.fws.qa.nt.ctripcorp.com/api/12830/';
        _basePathAuth = 'http://gateway.m.fws.qa.nt.ctripcorp.com/restapi/soa2/11755/';
        _basePathFetch = 'http://10.2.84.106:8080/dmp-datamanagement/exchange-offline/';
        //_basePathFetch = 'http://10.32.42.35:8080/dmp-datamanagement/exchange-offline/';
    } else if (hostname.indexOf("uat") > -1) {
        _basePath = 'http://webapi.soa.uat.qa.nt.ctripcorp.com/api/12830/';
        _basePathAuth = 'http://gateway.m.uat.qa.nt.ctripcorp.com/restapi/soa2/11755/';
    } else {
        _basePath = 'http://webapi.soa.ctripcorp.com/api/12830/';
        _basePathAuth = 'http://m.ctrip.com/restapi/soa2/11755/';
    }
    //_basePathFetch = window.location.protocol + '//' + window.location.host + '/dmp-datamanagement/exchange-offline/';
    _basePathDev = "webresource/mock/"
    return {
        basePath: _basePath,
        basePathDev: _basePathDev, //mock
        basePathAuth: _basePathAuth, //权限相关地址
        basePathFetch: _basePathFetch //取数标签相关地址
    }
});