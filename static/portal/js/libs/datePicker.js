(function($){ 
  $.extend({ 
    DatePicker: function (options) { 
       var defaults = { 
             YearSelector: "#sel_year", 
             MonthSelector: "#sel_month", 
             DaySelector: "#sel_day", 
             FirstYearText: "--",
             FirstMonthText: "--", 
             FirstDayText: "--", 
             FirstValue: 0,
             ShowDefaultText: true
       }; 
       var opts = $.extend({}, defaults, options); 
       var $YearSelector = $(opts.YearSelector); 
       var $MonthSelector = $(opts.MonthSelector); 
       var $DaySelector = $(opts.DaySelector); 
       var FirstYearText = opts.FirstYearText; 
       var FirstMonthText = opts.FirstMonthText; 
       var FirstDayText = opts.FirstDayText;  
       var FirstValue = opts.FirstValue; 
       var ShowDefaultText = opts.ShowDefaultText;

       var today = new Date();
       var DefaultYearRel = today.getFullYear();
       var DefaultMonthRel = today.getMonth() + 1;
       var DefaultDayRel = today.getDate();

       // 初始化 
       if (ShowDefaultText) {
         $YearSelector.html("<option value=\"" + FirstValue + "\">"+FirstYearText+"</option>"); 
         $MonthSelector.html("<option value=\"" + FirstValue + "\">"+FirstMonthText+"</option>"); 
         $DaySelector.html("<option value=\"" + FirstValue + "\">"+FirstDayText+"</option>"); 
       }

       // 年份列表 
       var yearSel = $YearSelector.attr("rel") || DefaultYearRel; 
       for (var i = DefaultYearRel; i <= 2020; i++) { 
            var sed = yearSel==i?"selected":""; 
            var yearStr = "<option value=\"" + i + "\" " + sed+">"+i+"</option>"; 
            $YearSelector.append(yearStr); 
       } 
     
        // 月份列表 
        var monthSel = $MonthSelector.attr("rel") || DefaultMonthRel; 
        for (var i = 1; i <= 12; i++) {
            //if ((DefaultYearRel != Number($YearSelector.val())) || i >= DefaultMonthRel ) {
              var sed = monthSel==i?"selected":""; 
              var monthStr = "<option value=\"" + i + "\" "+sed+">"+ (i.toString().length < 2 ? "0" + i : i) +"</option>"; 
              $MonthSelector.append(monthStr); 
            //} 
        } 
     
        BuildDay();

        // 日列表(仅当选择了年月) 
        function BuildDay() { 
            if ($YearSelector.val() == 0 || $MonthSelector.val() == 0) { 
                // 未选择年份或者月份 
                $DaySelector.html("<option value=\"" + FirstValue + "\">"+FirstDayText+"</option>"); 
            } else { 
                //$DaySelector.html("<option value=\"" + FirstValue + "\">"+FirstDayText+"</option>"); 
                $DaySelector.html('');
                var year = parseInt($YearSelector.val()); 
                var month = parseInt($MonthSelector.val()); 
                var dayCount = 0; 
                switch (month) { 
                     case 1: 
                     case 3: 
                     case 5: 
                     case 7: 
                     case 8: 
                     case 10: 
                     case 12: 
                          dayCount = 31; 
                          break; 
                     case 4: 
                     case 6: 
                     case 9: 
                     case 11: 
                          dayCount = 30; 
                          break; 
                     case 2: 
                          dayCount = 28; 
                          if ((year % 4 == 0) && (year % 100 != 0) || (year % 400 == 0)) { 
                              dayCount = 29; 
                          } 
                          break; 
                     default: 
                          break; 
                } 
                         
                var daySel = $DaySelector.attr("rel") || DefaultDayRel; 
                for (var i = 1; i <= dayCount; i++) { 
                    var sed = daySel==i?"selected":""; 
                    var dayStr = "<option value=\"" + i + "\" "+sed+">" + (i.toString().length < 2 ? "0" + i : i) + "</option>"; 
                    $DaySelector.append(dayStr); 
                 } 
             } 
          } 
          $MonthSelector.change(function () { 
             BuildDay(); 
          }); 
          $YearSelector.change(function () { 
             BuildDay(); 
          }); 
          if($DaySelector.attr("rel")!=""){ 
             BuildDay(); 
          } 
       }
  }); 
})(jQuery); 