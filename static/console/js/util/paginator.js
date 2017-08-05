define(['jquery'], function ($) {
    var ms = {
        init: function (obj, args) {
            return (function () {
                ms.fillHtml(obj, args);
                ms.bindEvent(obj, args);
            })();
        },
        //填充html
        fillHtml: function (obj, args) {
            return (function () {
                obj.empty();
                //上一页
                args.current = parseInt(args.current);
                args.pageCount = parseInt(args.pageCount);
                if (args.current > 1) {
                    obj.append('<a id="data-table_previous" aria-controls="data-table" class="paginate_button previous">上一页</a>');
                } else {
                    obj.remove('.previous');
                    obj.append('<span  class="paginate_button disabled">上一页</span>');
                }
                //中间页码
                if (args.current != 1 && args.current >= 4 && args.pageCount != 4) {
                    obj.append('<a aria-controls="data-table" id="page_1" class="paginate_button">' + 1 + '</a>');
                }
                if (args.current - 2 > 2 && args.current <= args.pageCount && args.pageCount > 5) {
                    obj.append('<span>...</span>');
                }
                var start = args.current - 2, end = args.current + 2;
                if ((start > 1 && args.current < 4) || args.current == 1) {
                    end++;
                }
                if (args.current > args.pageCount - 4 && args.current >= args.pageCount) {
                    start--;
                }
                for (; start <= end; start++) {
                    if (start <= args.pageCount && start >= 1) {
                        if (start != args.current) {
                            obj.append('<a aria-controls="data-table" id="page_' + start + '" class="paginate_button tcdNumber">' + start + '</a>');
                        } else {
                            obj.append('<span id="page_' + start + '" class="paginate_button current">' + start + '</span>');
                        }
                    }
                }
                if (args.current + 2 < args.pageCount - 1 && args.current >= 1 && args.pageCount > 5) {
                    obj.append('<span>...</span>');
                }
                if (args.current != args.pageCount && args.current < args.pageCount - 2 && args.pageCount != 4) {
                    obj.append('<a aria-controls="data-table" id="page_' + args.pageCount + '" class="paginate_button tcdNumber">' + args.pageCount + '</a>');
                }
                //下一页
                if (args.current < args.pageCount) {
                    obj.append('<a id="data-table_next" aria-controls="data-table" class="paginate_button next">下一页</a>');
                } else {
                    obj.remove('.next');
                    obj.append('<span  class="paginate_button disabled">下一页</sapn>');
                }
            })();
        },
        //绑定事件
        bindEvent: function (obj, args) {
            return (function () {
                //解绑click事件
                obj.off("click");
                //当前页
                obj.on("click", "a.tcdNumber", function () {
                    var current = parseInt($(this).text());
                    if (typeof (args.backFn) == "function") {
                        args.backFn(current);
                    }
                });
                //上一页
                obj.on("click", "a.previous", function () {
                    var current = parseInt(obj.children("span.current").text());
                    if (typeof (args.backFn) == "function") {
                        args.backFn(current - 1);
                    }
                });
                //下一页
                obj.on("click", "a.next", function () {
                    var current = parseInt(obj.children("span.current").text());
                    if (typeof (args.backFn) == "function") {
                        args.backFn(current + 1);
                    }
                });
            })();
        }
        
    }
    
    $.fn.createPage = function (options) {
        var args = $.extend({
            pageCount: 10,
            current: 1,
            backFn: function () { }
        }, options);
        ms.init(this, args);
    }
});
