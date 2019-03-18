
/**
* Theme: Adminto Admin Template
* Author: Coderthemes
* Dashboard
*/

!function($) {
    "use strict";

    var Dashboard1 = function() {
    	this.$realData = []
    };

    //creates Bar chart
    Dashboard1.prototype.createBarChart  = function(element, data, xkey, ykeys, labels, lineColors) {
        Morris.Bar({
            element: element,
            data: data,
            xkey: xkey,
            ykeys: ykeys,
            labels: labels,
            hideHover: 'auto',
            resize: true, //defaulted to true
            gridLineColor: '#eeeeee',
            barSizeRatio: 0.2,
            barColors: lineColors
        });
    },

    //creates line chart
    Dashboard1.prototype.createLineChart = function(element, data, xkey, ykeys, labels, opacity, Pfillcolor, Pstockcolor, lineColors) {
        Morris.Line({
          element: element,
          data: data,
          xkey: xkey,
          ykeys: ykeys,
          labels: labels,
          fillOpacity: opacity,
          pointFillColors: Pfillcolor,
          pointStrokeColors: Pstockcolor,
          behaveLikeLine: true,
          gridLineColor: '#eef0f2',
          hideHover: 'auto',
          resize: true, //defaulted to true
          pointSize: 0,
          lineColors: lineColors
        });
    },

    //creates Donut chart
    Dashboard1.prototype.createDonutChart = function(element, data, colors) {
        Morris.Donut({
            element: element,
            data: data,
            resize: true, //defaulted to true
            colors: colors
        });
    },
    
    
    Dashboard1.prototype.init = function() {
        var $barData  = [];
        $.each(allmonthReport, function(k,v){
            if(k !== 6){
                if(v.month == thisMonth && v.year == thisYear){
                    var totalMeal = 0;
                    $.each(thisMonthAllMeal,function(ka,va){
                        totalMeal = totalMeal + va.lunch + va.dinner + va.breakfast + va.guest;
                    });
                    var data = { m: moment(v.month,'MM').format('MMMM'), a:totalMeal}
                    $barData.push(data);

                }else if(v.year == thisYear){

                    var data = { m: moment(v.month,'MM').format('MMMM'), a: (v.total_meal == '')? 0:v.total_meal}
                    $barData.push(data);
                }
            }
        });

        //creating bar chart
        // var $barData  = [
        //     { m: allmonthReport[0].month, a: allmonthReport[0].total_meal },
        //     { m: '02', a: 42 }
        // ];
        this.createBarChart('meal-bar-example', $barData, 'm', ['a'], ['Total Meal'], ['#10c469']);
        var $totalBazar  = [];
        $.each(allmonthReport, function(k,v){
            if(k !== 6){
                if(v.month == thisMonth && v.year == thisYear){
                    var totalBazar = 0;
                    $.each(bazar_list,function(ka,va){
                        totalBazar = totalBazar + Number(va.total_amount);
                    });
                    var data = { m: moment(v.month,'MM').format('MMMM'), a:totalBazar}
                    $totalBazar.push(data);

                }else if(v.year == thisYear){
                    var data = { m: moment(v.month,'MM').format('MMMM'), a: (v.total_meal == '')? 0:v.total_bazar}
                    $totalBazar.push(data);
                }
            }
        });
        this.createBarChart('bazar-bar-example', $totalBazar, 'm', ['a'], ['Total Bazar'], ['#188ae2']);


        var $mealRate  = [];
        $.each(allmonthReport, function(k,v){
            if(k !== 6){
                if(v.month == thisMonth && v.year == thisYear){
                    var mealRate = 0;
                    var totalBazar = 0;
                    $.each(bazar_list,function(ka,va){
                        totalBazar = totalBazar + Number(va.total_amount);
                    });
                    var totalMeal = 0;
                    $.each(thisMonthAllMeal,function(ka,va){
                        totalMeal = totalMeal + va.lunch + va.dinner + va.breakfast + va.guest;
                    });
                    mealRate = Math.ceil(totalBazar / totalMeal);
                    var data = { m: moment(v.month,'MM').format('MMMM'), a:mealRate}
                    $mealRate.push(data);

                }else if(v.year == thisYear){

                    var data = { m: moment(v.month,'MM').format('MMMM'), a: (v.meal_rate == '')? 0:v.meal_rate}
                    $mealRate.push(data);
                }
            }
        });
        this.createBarChart('mealRate-bar-example', $mealRate, 'm', ['a'], ['Meal Rate'], ['#f9c851']);
        
        var $acBalance  = [];
        $.each(allUserList, function(k,v){
            console.log(v)
            var data = { m: v.user_name, a:v.account}
            $acBalance.push(data);
        });
        this.createBarChart('balance-bar-example', $acBalance, 'm', ['a'], ['A/C Balance'], ['#35b8e0']);

        //create line chart
        var $data  = [
            { y: '2008', a: 50, b: 0 },
            { y: '2009', a: 75, b: 50 },
            { y: '2010', a: 30, b: 80 },
            { y: '2011', a: 50, b: 50 },
            { y: '2012', a: 75, b: 10 },
            { y: '2013', a: 50, b: 40 },
            { y: '2014', a: 75, b: 50 },
            { y: '2015', a: 100, b: 70 }
          ];
        this.createLineChart('morris-line-example', $data, 'y', ['a','b'], ['Series A','Series B'],['0.9'],['#ffffff'],['#999999'], ['#10c469','#188ae2']);

        //creating donut chart
        var $donutData = [
                {label: "Download Sales", value: 12},
                {label: "In-Store Sales", value: 30},
                {label: "Mail-Order Sales", value: 20}
            ];
        this.createDonutChart('morris-donut-example', $donutData, ['#ff8acc', '#5b69bc', "#35b8e0"]);
    },
    //init
    $.Dashboard1 = new Dashboard1, $.Dashboard1.Constructor = Dashboard1
}(window.jQuery),

//initializing 
function($) {
    "use strict";
    $.Dashboard1.init();
}(window.jQuery);