define(['jquery'], function($) {
    var usedRe = {
        interval: /^(\d+)([smhdMy])$/,
        toDateTime: /^(\d{4})-(\d{1,2})-(\d{1,2})( (\d{1,2}):(\d{1,2}):(\d{1,2})(\.\d+)?)?$/,
        toIntFix: /,/g
    };
    _formatDate = function(date, template) {
        var result;

        var YYYY = '0000' + date.getFullYear();
        var MM = '00' + (date.getMonth() + 1);
        var DD = '00' + date.getDate();
        var hh = '00' + date.getHours();
        var mm = '00' + date.getMinutes();
        var ss = '00' + date.getSeconds();

        YYYY = YYYY.substring(YYYY.length - 4);
        MM = MM.substring(MM.length - 2);
        DD = DD.substring(DD.length - 2);
        hh = hh.substring(hh.length - 2);
        mm = mm.substring(mm.length - 2);
        ss = ss.substring(ss.length - 2);

        if (!template) {
            result = date.getUTCFullYear() + "-" + (date.getUTCMonth() + 1) + "-" + date.getUTCDate() + " " + (date.getUTCHours() < 10 ? "0" + date.getUTCHours() : date.getUTCHours()) + ":" + (date.getUTCMinutes() < 10 ? "0" + date.getUTCMinutes() : date.getUTCMinutes()) + ":" + (date.getUTCSeconds() < 10 ? "0" + date.getUTCSeconds() : date.getUTCSeconds());
        } else {
            result = template;
            result = result.replace("YYYY", YYYY);
            result = result.replace("MM", MM);
            result = result.replace("DD", DD);
            result = result.replace("hh", hh);
            result = result.replace("mm", mm);
            result = result.replace("ss", ss);
        }

        return result;
    };

    _formatJsonDate = function(jsonDate, template) {         
        if  (!jsonDate) {             
            return;        
        }          
        var  formatedDate;        
        formatedDate = jsonDate.substring(6, jsonDate.length - 2).replace(/[\+|\-]+([^\+\-]+)$/,  '');        
        formatedDate = parseInt(formatedDate, 10);        
        formatedDate = isNaN(formatedDate) ?  new  Date() :  new  Date(formatedDate);        
        formatedDate = _formatDate(formatedDate, template); 

                
        return  formatedDate;    
    };
    _formatDateToJava = function(date) {
        var tt = new Date(date).getTime();
        tt = "/Date(" + tt + "+0800)/";
        return tt;
    }

    $.extend(Date.prototype, {
        /**
         * @method addYears
         * 加上特定的年份
         * @param {integer} 需要加上的特定年份
         * @return {object} 返回加好年份的日期对象
         */
        addYears: function(y) {
            var d = new Date(+this);
            d.setYear(d.getFullYear() + y);
            return d;
        },

        /**
         * @method addMonths
         * 加上特定的月份
         * @param {integer} 需要加上的特定月份
         * @return {object} 返回加好月份的日期对象
         */
        addMonths: function(M) {
            var d = new Date(+this);
            d.setMonth(d.getMonth() + M);
            return d;
        },

        /**
         * @method addDays
         * 加上特定的天数
         * @param {integer} 需要加上的特定天数
         * @return {object} 返回加好天数的日期对象
         */
        addDays: function(D) {
            var d = new Date(+this);
            d.setDate(d.getDate() + D);
            return d;
        },

        /**
         * @method addHours
         * 加上特定的小时数
         * @param {integer} 需要加上的特定小时数
         * @return {object} 返回加好小时数的日期对象
         */
        addHours: function(h) {
            var d = new Date(+this);
            d.setHours(d.getHours() + h);
            return d;
        },

        /**
         * @method addMinutes
         * 加上特定的分钟数
         * @param {integer} 需要加上的特定分钟数
         * @return {object} 返回加好分钟数的日期对象
         */
        addMinutes: function(m) {
            var d = new Date(+this);
            d.setMinutes(d.getMinutes() + m);
            return d;
        },

        /**
         * @method addSeconds
         * 加上特定的秒数
         * @param {integer} 需要加上的特定秒数
         * @return {object} 返回加好秒数的日期对象
         */
        addSeconds: function(s) {
            var d = new Date(+this);
            d.setSeconds(d.getSeconds() + s);
            return d;
        },
        /**
         * @method toDate
         * 生成对应的日期对象
         * @return {object} 返回日期对象
         */
        toDate: function() {
            return new Date(this.getFullYear(), this.getMonth(), this.getDate());
        },

        /**
         * @method toStdDateString
         * 生成对应的日期字符串
         * @return {string} 返回日期字符串
         */
        toStdDateString: function() {
            return this.getFullYear() + '-' + (this.getMonth() + 1) + '-' + this.getDate();
        },

        toStdDateTimeString: function() {
            function checkTime(i) {
                if (i < 10) {
                    i = "0" + i
                }
                return i
            }
            return this.getFullYear() + '-' + checkTime(this.getMonth() + 1) + '-' + checkTime(this.getDate()) + ' ' + checkTime(this.getHours()) + ':' + checkTime(this.getMinutes()) + ':' + checkTime(this.getSeconds());
        },

        /**
         * @method toEngDateString
         * 生成对应的英文版日期字符串
         * @return {string} 返回英文版日期字符串
         */
        toEngDateString: function() {
            var h = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            return h[this.getMonth()] + '-' + this.getDate() + '-' + this.getFullYear();
        },

        /**
         * @method toFormatString
         * 生成需要的格式的日期字符串
         * @param {string} 格式　例如(yyyy-mm-dd)
         * @return {string} 返回特定格式的日期字符串
         */
        toFormatString: function(fmt) {
            var h = {
                'y': this.getFullYear(),
                'M': this.getMonth() + 1,
                'd': this.getDate(),
                'h': this.getHours(),
                'm': this.getMinutes(),
                's': this.getSeconds(),
                'S': this.getMilliseconds()
            };
            var minL = {
                'y': 2
            };
            for (var name in h) {
                if (h.hasOwnProperty(name) && !(name in minL))
                    minL[name] = h[name].toString().length;
            }
            return fmt.replace(usedRe.toFormatString, function(a, b) {
                var t = h[b];
                var l = Math.max(a.length, minL[b]);
                return ('0'.repeat(l) + t).slice(-l);
            });
        },
        DatePart: function(interval) {
            var myDate = this;
            var partStr = '';
            var Week = ['日', '一', '二', '三', '四', '五', '六'];
            switch (interval) {
                case 'y':
                    partStr = myDate.getFullYear();
                    break;
                case 'm':
                    partStr = myDate.getMonth() + 1;
                    break;
                case 'd':
                    partStr = myDate.getDate();
                    break;
                case 'w':
                    partStr = Week[myDate.getDay()];
                    break;
                case 'ww':
                    partStr = myDate.WeekNumOfYear();
                    break;
                case 'h':
                    partStr = myDate.getHours();
                    break;
                case 'n':
                    partStr = myDate.getMinutes();
                    break;
                case 's':
                    partStr = myDate.getSeconds();
                    break;
            }
            return parseInt(partStr, 10);
        }
    });

    _getQueryString = function(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    }
    _addTime = function(baseTime, interval, times) {
        var self = this;
        var arr = interval.match(usedRe.interval);

        if (!arr) {
            return null;
        }
        var val = _toInt(arr[1]);
        var unit = arr[2] || 's';
        var ret;
        switch (unit) {
            case 's':
                ret = baseTime.addSeconds(val * times);
                break;
            case 'm':
                ret = baseTime.addMinutes(val * times);
                break;
            case 'h':
                ret = baseTime.addHours(val * times);
                break;
            case 'd':
                ret = baseTime.addDays(val * times);
                break;
            case 'M':
                ret = baseTime.addMonths(val * times);
                break;
            case 'y':
                ret = baseTime.addYears(val * times);
                break;
            default:
                return null;
        }
        return ret;
    };
    //近n天
    _getBeforeDate = function(n) {
        var n = n;
        var d = new Date();
        var year = d.getFullYear();
        var mon = d.getMonth() + 1;
        var day = d.getDate();
        var hour = d.getHours();
        var minute = d.getMinutes();
        var second = d.getSeconds();
        if (day <= n) {
            if (mon > 1) {
                mon = mon - 1;
            } else {
                year = year - 1;
                mon = 12;
            }
        }
        d.setDate(d.getDate() - n);
        year = d.getFullYear();
        mon = d.getMonth() + 1;
        day = d.getDate();

        if (hour < 10) {
            hour = "0" + hour;
        }
        if (minute < 10) {
            minute = "0" + minute;
        }
        if (second < 10) {
            second = "0" + second;
        }
        s = year + "-" + (mon < 10 ? ('0' + mon) : mon) + "-" + (day < 10 ? ('0' + day) : day) + " " + hour + ":" + minute + ":" + second;
        console.log(s)
        return s;
    }
    _toInt = function(date) {
        return parseInt(date.replace(usedRe.toIntFix, ''), 10);
    };
    _toDateTime = function(date) {
        var arr = date.match(usedRe.toDateTime);
        if (arr) {
            var y = _toInt(arr[1]),
                m = _toInt(arr[2]) - 1,
                d = _toInt(arr[3]);
            var h = _toInt((arr[5] || '')) || 0,
                min = _toInt((arr[6] || '')) || 0,
                s = _toInt((arr[7] || '')) || 0;
            var t = new Date(y, m, d, h, min, s);
            if (t.getFullYear() == y && t.getMonth() == m && t.getDate() == d && t.getHours() == h && t.getMinutes() == min && t.getSeconds() == s)
                return t;
        }
        return null;
    };
    _message = function(message, type, $elem) {

        var time = 2000,
            fadeTime = 500;

        var $messageNode = $elem || $('.alert-message'),
            $messageText = $messageNode.find('span'),
            $closeBtn = $messageNode.find('.close');

        message = $.trim(message);

        $closeBtn.on('click', function() {
            $messageNode.addClass('hide');
        });
        $messageText.text(message);
        $messageNode.fadeIn(fadeTime, function() {
            $messageNode.addClass('alert-' + type).removeClass('hide');
            window.setTimeout(function() {
                $messageNode.fadeOut(fadeTime, function() {
                    $messageNode.addClass('hide').removeClass('alert-' + type);
                });
            }, time);
        });
    };
    _ajax = function(url, params, callback, json) {
        var contentType;
        if (!json) {
            contentType = 'application/x-www-form-urlencoded; charset=UTF-8'
        } else {
            contentType = 'application/json';
        }
        $.ajax({
            url: url,
            type: 'POST',
            data: params,
            dataType: 'json',
            contentType: contentType,
            beforeSend: function(request) {
                request.setRequestHeader("token", $.cookie('token'));
            },
            headers: {
                'token': $.cookie('token')
            },
            statusCode: {
                401: function() {
                    $('#modal-dialog').html(_.template($('#errorTmpl').html(), {
                        msg: '您没有权限进行操作，请联系管理员。'
                    }));
                    $('#modal-dialog').modal("show");
                    setTimeout(function() {
                        window.location.href = "./fetch-scene-list.html";
                    }, 1000)
                },
                302: function() {
                    window.location.href = './login.html';
                }
            },
            success: function(data) {
                callback(data);
            }
        });
    };
    return {
        formatDate: _formatDate,
        formDate: _formatJsonDate,
        formatJavaDate: _formatDateToJava,
        getQueryStr: _getQueryString,
        getBeforeDate: _getBeforeDate,
        addTime: _addTime,
        toInt: _toInt,
        toDateTime: _toDateTime,
        message: _message,
        ajax: _ajax,
        error: function(message, $elem) {
            this.message(message, 'danger', $elem);
        },
        success: function(message, $elem) {
            this.message(message, 'success', $elem);
        },
        info: function(message, $elem) {
            this.message(message, 'info', $elem);
        },
        warn: function(message, $elem) {
            this.message(message, 'warning', $elem);
        }
    }
});