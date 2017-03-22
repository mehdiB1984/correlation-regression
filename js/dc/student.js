/*global dcProbability */

/**
 * T-Student continuous distribution chart class
 *
 * @param $container The chart container DOM as jquery object
 * @param grid  If the chart must be show the grid or not
 * @param dataDistribution Data to show into distribution chart
 * @param dataDensity Data to show into density chart
 * @param normalDensity Data to show into normal density chart
 * @returns {DistStudentChart}
 * @constructor
 *
 * Created by Jose David Jurado Alonso <i22jualj@uco.es> on 07/15.
 */
function DistStudentChart($container, grid, dataDistribution, dataDensity, normalDensity) {

    var options = {
        chart: {
            zoomType: 'xy',
            animation: false,
            shadow: false
        },
        tooltip: {
            enabled: false
        },
        title: {
            text: Texts.decodeURIComponent("dc.charts.student")
        },
        subtitle: UtilsChart.subtitleConfig,
        plotOptions: {
            columnrange: dcProbability.getPlotOptions()
        },
        xAxis: {
            min: -10,
            max: 10,
            tickInterval: 1,
            gridLineWidth: grid ? 1 : 0
        },
        yAxis: [{
            min: 0,
            max: 1.1,
            tickInterval: 0.10,
            title: {
                text: Texts.decodeURIComponent("dc.charts.func.dist")
            },
            gridLineWidth: grid ? 1 : 0
        }, {
            min: 0,
            max: 1.1,
            tickInterval: 0.10,
            title: {
                text: Texts.decodeURIComponent("dc.charts.func.density")
            },
            gridLineWidth: grid ? 1 : 0,
            opposite: true
        }], series: [
            UtilsDCChart.getDistributionSerie(dataDistribution),
            UtilsDCChart.getDensitySerie(dataDensity),
            UtilsDCChart.getNormalSerie(normalDensity),
            UtilsDCChart.getAreaSerie([]),
            dcProbability.getProbabilitySerie()
        ]
    };

    $container.highcharts(options);

    var chart = $container.highcharts();
    dcProbability.setCurrentChart(chart);

    /**
     * Update the chart subtitle
     *
     * @param value
     */
    this.updateSubtitle = function (value) {
        chart.setTitle(null, {text: "t( " + value + " )"});
    };

    /**
     * Return the highchart object
     *
     * @returns {*}
     */
    this.getHighchart = function () {
        return chart;
    };

    return this;
}

/**
 * T-Student continuous distribution handler class
 *
 * @param gradesValue Distribution 'grades' parameter value
 * @param startValue The start value of x axis
 * @param endValue The end value of x axis
 * @param totalPoints The total points of chart
 * @constructor
 *
 * Created by Jose David Jurado Alonso <i22jualj@uco.es> on 07/15.
 */
function DistStudent(gradesValue, startValue, endValue, totalPoints) {

    var start = parseFloat(startValue);
    var grades = parseInt(gradesValue);
    var student = new StudentDistribution(grades);
    var xAxisPoints = UtilsChart.getXAxisPoints(startValue, endValue, totalPoints);

    /************************************** METHODS ********************************************************/

    /**
     * Get the data points of distribution and density charts
     *
     * @returns {{dist: Array, density: Array}}
     */
    this.getPoints = function () {
        var distributionPoints = [], densityPoints = [];
        var x, y, z;
        for (var i = 0, size = xAxisPoints.length; i < size; i++) {
            x = xAxisPoints[i];
            y = student.density(x);
            z = (x < start) ? 0.0 : student.CDF(x);
            densityPoints[i] = [x, y];
            distributionPoints[i] = [x, z];
        }
        return {dist: distributionPoints, density: densityPoints}
    };

    /**
     * Get the data points of probability area charts
     *
     * @param lower The lower probability value
     * @param higher The higher probability value
     * @returns {Array}
     */
    this.getAreaPoints = function (lower, higher) {
        var area = [];
        var point = [];
        var y;
        var increment = UtilsChart.getIncrement(lower, higher, totalPoints);
        for (var i = lower; i <= higher; i = i + increment) {
            y = student.density(i);
            point = [i, 0, y];
            area.push(point);
        }
        return area;
    };

    /**
     * Set the 'grades' parameter value
     *
     * @param gradesValue
     */
    this.setGrades = function (gradesValue) {
        grades = gradesValue;
        student = new StudentDistribution(gradesValue);
    };

    /**
     * Get the 'grades' parameter value
     *
     * @returns {Number}
     */
    this.getGrades = function () {
        return grades;
    };

    /**
     * Get the distribution object
     *
     * @returns {StudentDistribution}
     */
    this.getDistribution = function () {
        return student;
    }
}
