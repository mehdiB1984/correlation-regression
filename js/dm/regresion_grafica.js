$(function(){
         var chart;
         var data_point =[];
         var min = 0, max = 100;
         var chart_series_options = {
      
            chart: {
                renderTo: 'dm_chart_container',
                type: 'scatter',
                zoomType: 'xy',
                showAxes:true
            },
            title: {
                text: 'Representación Gráfica'
            },
            
            xAxis: [{
                     min: min,
                     max: max,
                     showEmpty: true,
                     title: {
                             text: 'X value'
                             }
               
            }],
            yAxis: [{
                   min: min,
                   max: max,
                  showEmpty: true,
                  title: {
                          text: 'Y value'
                         }
           }],
            
           
    plotOptions: {
        scatter: {
            marker: {
                symbol: 'circle'
            }
        }
    },          
    series: []               
 

  };
function getRandomInt(){

      return Math.floor(Math.random() * (max - min + 1)) + min;
}


$(document).ready(function () {
    chart = new Highcharts.Chart(chart_series_options);
});

$(document).on('click', '#dm_oneByOne', function () {
    var numberPoint = parseInt($('#dm_points_value').val());
    chart_series_options.series = [], data_point = [];
   
   
    /** Integer values */
    for (var i = 0; i < numberPoint; i++) {
        data_point.push([getRandomInt(), getRandomInt()]);
    }

    chart_series_options.series.push({
        regression: true,
        regressionSettings: {
            type: 'linear',
            color: '#000000',
            hideInLegend: true
        },
        name: 'XY data',
        color: '#FF0000',
        data: data_point
    });

    chart = new Highcharts.Chart(chart_series_options);

});




/*$(document).on('click', '#dm_start', function () {
    
    var data = [];  
   
   
    for (var i = 0; i < 300; i++) {
        data.push([getRandomInt(), getRandomInt()]);
    }

    chart_series_options.series.push({
        
        name: 'Population',
        color: 'green',
        data: data
    });

  chart = new Highcharts.Chart(chart_series_options);
    });

/**$(document).on('click', '#cc_start', function () {
    var numberPoint = parseInt($('#cc_points_value').val());
    chart_series_options.series = [], data_point = [];
  
   
    
    for (var i = 0; i < numberPoint; i++) {
        data_point.push([getRandomInt(), getRandomInt()]);
    }

    chart_series_options.series.push({
        regression: false,
        regressionSettings: {
            type: 'linear',
            color: 'rgba(223, 83, 83, .9)',
            hideInLegend: true
        },
        name: ' ',
        color: '#FF0000',
        data: data_point
    });
*/


$(document).on('click', '#dm_reset', function () {
    chart_series_options.series = [];
    chart = new Highcharts.Chart(chart_series_options);
    this.disabled = false;
});














  })  