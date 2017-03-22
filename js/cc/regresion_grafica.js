var chart;
var data_point = [];
var min = 0, max = 100;
var chart_series_options = {
    chart: {
        renderTo: 'cc_chart_container',
        type: 'scatter',
        showAxes: true,
        zoomType: 'xy'
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
/**
 * Returns a random number between min (inclusive) and max (exclusive)
 */
function getRandomArbitrary() {
    return Math.random() * (max - min) + min;
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt() {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

$(document).ready(function () {
    chart = new Highcharts.Chart(chart_series_options);
});

$(document).on('click', '#cc_start', function () {
    var numberPoint = parseInt($('#cc_points_value').val());
    chart_series_options.series = [], data_point = [];
    $('#cc_regresionLine, #cc_coeficient').prop('checked', false);
    $('#cc_coeficient_text').val('');
    $('#cc_regresionLine_text').val('');
   
    /** Integer values */
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
        name: 'XY data',
        color: 'green',
        data: data_point
    });

    chart = new Highcharts.Chart(chart_series_options);

    /** decimal values */
    /*for (var i = 0; i < numberPoint; i++) {
     data_dec.push([getRandomArbitrary(min, max), getRandomArbitrary(min, max)]);
     }
     $('#container_1').highcharts({
     chart: {
     type: 'scatter'
     },
     title: {
     text: 'Highcharts'
     },
     xAxis: [{
     title: {
     text: 'X value'
     }
     
     }],
     yAxis: [{
     title: {
     text: 'Y value'
     }
     
     }],
     series: [{
     name: 'XY data',
     data: data_dec,
     marker: {
     radius: 1.5
     }
     }]
     });*/

});

$(document).on('click', '#cc_reset', function () {
    chart_series_options.series = [];
    chart = new Highcharts.Chart(chart_series_options);
    this.disabled = false;
});

$(document).on('click', '#cc_regresionLine', function () {
    if ($(this).is(':checked')) {
        if (chart_series_options.series.length === 0) {
            $(this).prop('checked', false);
            alert('Inserta los puntos a generar');
            return false;
        }
          
        chart_series_options.series[0].regression = true;
    } else {

        $('#cc_regresionLine_text').val('');
        chart_series_options.series = [];
        chart_series_options.series.push({
            regression: false,
            regressionSettings: {
                type: 'linear',
                color: 'rgba(223, 83, 83, .9)'
            },
            name: 'XY data',
            color: 'green',
            data: data_point
          
        });
      
    

    }

    chart = new Highcharts.Chart(chart_series_options);     
    var coeficient_text = chart.series[1].name;
    $('#cc_regresionLine_text').val(coeficient_text.replace('Equation: ', ''));
});



$(document).on('click', '#cc_coeficient', function () {
    if ($(this).is(':checked')) {
        if (!$('#cc_regresionLine').is(':checked')) {
            $(this).prop('checked', false);
            alert('Primero crea la línea de regresión');
            return false;
        }
        var coeficient_text = chart.series[1].name;
        $('#cc_coeficient_text').val(coeficient_text.replace('r2: ', ''));
    } else {
        $('#cc_coeficient_text').val('');
    }
});