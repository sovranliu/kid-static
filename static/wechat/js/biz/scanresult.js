define(['url','helper'], function (url,helper) {

    var result;
    function bindActions () {
        
    }

    function getUrlParams() {
        result =  helper.getQueryStr('result');
    }
    
    function renderResult() {
        if(result == "true") {
            $('.scan-result-img').html('<img src="images/right.png" alt=""><p>扫码成功！</p>')
        }else{
            $('.scan-result-img').html('<img src="images/error.png" alt=""><p>扫码失败！</p>')
        }   
    }

    return {
        init: function () {
            getUrlParams();
            renderResult();
        }
    }
});