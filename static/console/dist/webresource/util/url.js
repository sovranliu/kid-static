
define(['util/constant', 'util/env'], function(cst, env) {
    var _urls = {},
        _get, _gets, _getAuth, _getFetch;

    _urls = {
        //登录
        getLogin: 'dmplogin',
        //角色分配权限
        getAllRoles: 'selectrolefuzzy',
        getRoleAuth: 'selectroleauth',
        addRoleAuth: 'roleauthmapping',
        delRoleAuth: 'deleteauthmapping',
        //节点
        getAllNodes: 'listmeteornodemeta',
        addNodes: 'addmeteornodemeta',
        updateNodes: 'updatemeteornodemeta',
        removeNodes: 'delmeteornodemeta',
        getTargetNode: 'getNodeMetaByID',
        //场景
        getAllScenes: 'listmeteorscene',
        addScenes: 'addMeteorScene',
        updateScenes: 'updateMeteorScene',
        delScenes: 'delMeteorScene',
        getTargetScene: 'getscenebyid',
        getSceneStatus: 'getscenestatusbyid',
        getSceneOperate: 'operationscenebyid',
        //取数-标签
        getSubCategory: 'tag/get/category/get',
        getLabelList: 'tag/get/query',
        getLabelCount: 'tag/get/count',
        getLabelDetail: 'tag/get/',
        addLabel: 'tag/put',
        getLog: 'log/get/taglog',
        //取数-产线
        getProductLine: 'productline/get/getAll',
        getUserProductLine: 'productline/get/getUserProductLine',
        addUserProductLine: 'productline/put/putUserProductline',
        //取数-场景
        getFetchScenes: 'scene/list',
        getRealtimeCategory: 'category/get/query',
        getSceneTagDetail: 'scene/get/createSenceDetail',
        getSceneLog: 'log/get/sencelog',
        addScene: 'scene/add',
        getSendProductLine: 'scene/sendproductlines',
        getFetchScenesStatus: 'scene/getstatus',
        operationScene: 'scene/operationscene',
        getOfflineChartData: 'statistic/scene/statistic',
        //取数-标签-mock
        getAllLabels: 'label.js',
        //app下载
        getAppCategory: 'app-download/category',
        getADLiast: 'app-download/adlist',
        getDetails: 'app-download/details',
        delAppConfig: 'app-download/delete',
        updateBaseData: 'app-download/update/baseInfo',
        updateAdverData: 'app-download/update/aderconfig',
        updateUrlData: 'app-download/update/urlconfig',
        //本地数据mock
        getBrowse: 'browse.js',
        getOrder: 'order.js',
        getCity: 'city.js',
        getCountry: 'country.js'
    };


    _get = function(_key) {
        return env.basePath + _urls[_key];
    };
    _gets = function(_key) {
        return env.basePathDev + _urls[_key];
    };
    _getAuth = function(_key) {
        return env.basePathAuth + _urls[_key];
    };
    _getFetch = function(_key) {
        return env.basePathFetch + _urls[_key];
    };
    return {
        /************ 登录 **************/
        getLogin: function() {
            return _getAuth('getLogin');
        },
        /************ 权限 **************/
        getAllRoles: function() {
            return _getAuth('getAllRoles');
        },
        getRoleAuth: function() {
            return _getAuth('getRoleAuth');
        },
        addRoleAuth: function() {
            return _getAuth('addRoleAuth');
        },
        delRoleAuth: function() {
            return _getAuth('delRoleAuth');
        },
        /************ 节点 **************/
        getAllNodes: function() {
            return _get('getAllNodes');
        },
        addNodes: function() {
            return _get('addNodes');
        },
        updateNodes: function() {
            return _get('updateNodes');
        },
        removeNodes: function() {
            return _get('removeNodes');
        },
        getTargetNode: function() {
            return _get('getTargetNode');
        },
        /************ 场景 **************/
        getAllScenes: function() {
            return _get('getAllScenes');
        },
        addScenes: function() {
            return _get('addScenes');
        },
        updateScenes: function() {
            return _get('updateScenes');
        },
        delScenes: function() {
            return _get('delScenes');
        },
        getTargetScene: function() {
            return _get('getTargetScene');
        },
        getSceneStatus: function() {
            return _get('getSceneStatus');
        },
        getSceneOperate: function() {
            return _get('getSceneOperate');
        },
        /************ 标签 **************/
        getSubCategory: function() {
            return _getFetch('getSubCategory');
        },
        getLabelList: function() {
            return _getFetch('getLabelList');
        },
        getLabelCount: function() {
            return _getFetch('getLabelCount');
        },
        getLabelDetail: function() {
            return _getFetch('getLabelDetail');
        },
        addLabel: function() {
            return _getFetch('addLabel');
        },
        getLog: function() {
            return _getFetch('getLog');
        },
        /************ 权限- 产线 **************/
        getProductLine: function() {
            return _getFetch('getProductLine');
        },
        getUserProductLine: function() {
            return _getFetch('getUserProductLine');
        },
        addUserProductLine: function() {
            return _getFetch('addUserProductLine');
        },
        /************ 取数场景 **************/
        getFetchScenes: function() {
            return _getFetch('getFetchScenes');
        },
        getRealtimeCategory: function() {
            return _getFetch('getRealtimeCategory');
        },
        getSceneTagDetail: function() {
            return _getFetch('getSceneTagDetail');
        },
        getSceneLog: function() {
            return _getFetch('getSceneLog');
        },
        addScene: function() {
            return _getFetch('addScene');
        },
        getSendProductLine: function() {
            return _getFetch('getSendProductLine');
        },
        getFetchScenesStatus: function() {
            return _getFetch('getFetchScenesStatus');
        },
        operationScene: function() {
            return _getFetch('operationScene');
        },
        operationScene: function() {
            return _getFetch('operationScene');
        },
        /************ APP下载 **************/
        getAppCategory: function() {
            return _getFetch('getAppCategory');
        },
        getADLiast: function() {
            return _getFetch('getADLiast');
        },
        getDetails: function() {
            return _getFetch('getDetails');
        },
        delAppConfig: function() {
            return _getFetch('delAppConfig');
        },
        updateBaseData: function() {
            return _getFetch('updateBaseData');
        },
        updateAdverData: function() {
            return _getFetch('updateAdverData');
        },
        getOfflineChartData: function() {
            return _getFetch('getOfflineChartData');
        },
        /************ 本地数据 mock**************/
        getBrowse: function() {
            return _gets('getBrowse');
        },
        getOrder: function() {
            return _gets('getOrder');
        },
        getCity: function() {
            return _gets('getCity');
        },
        getCountry: function() {
            return _gets('getCountry');
        }
    };
});