define(['url', 'helper','wechat'], function (url, helper,wx) {

    var vurl,fromPath;
    function bindActions() {
        $('.js-confirm').on('click', closePopup);
    }
    function getUrlParams() {
        vurl =  helper.getQueryStr('vurl');
        fromPath = helper.getQueryStr('from');
        if(fromPath) {
            $('.share-wrapper').hide();
        }else{
            $('.share-wrapper').show();
        }
    }

    function getVideoDetail() {
        $('#video').attr('src',vurl);
        handleShare();
    }

    function handleShare() {
        var params = {};

        helper.ajax(url.getShareConfig, params, function(res) {
            var data = res.data;

            if(res.code >= 0) {

                wx.config({  
                    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。  
                    appId: data.appId, // 必填，公众号的唯一标识  
                    timestamp: data.timestamp, // 必填，生成签名的时间戳  
                    nonceStr: data.nonceStr, // 必填，生成签名的随机串  
                    signature: data.signature,// 必填，签名  
                    jsApiList: [  
                        'checkJsApi',  
                        'onMenuShareAppMessage' 
                    ]
                });  
              
                wx.ready(function () {  
                    
                    wx.onMenuShareAppMessage({ 
                        title: '我的飞行', // 分享标题  
                        link: 'http://yahaifeixing.cn/kid/static/wechat/VideoShare.html?vurl=' + vurl, 
                        imgUrl: 'http://yahaifeixing.cn/kid/static/portal/images/logo.png', // 分享图标  
                        success: function () {   
                            window.location.href = 'FlightDiary.html';
                        },  
                        fail: function (res) {
                        }
                    });

                    wx.error(function(res){  
                    });  
                });


            }else if(res.msg != null && res.msg != ""){
                    $('.error-popup').find('p').html(res.msg);
                }
        })
    }
    function closePopup() {
        $(this).parent().parent('.popup').hide();
    }
    return {
        init: function () {
            getUrlParams();
            getVideoDetail();
        }
    }
});