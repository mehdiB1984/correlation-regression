/*global dcProbability */

/**
 * Chi-Square continuous distribution chart class
 *
 * @param $container The chart container DOM as jquery object
 * @param grid  If the chart must be show the grid or not
 * @param dataDistribution Data to show into distribution chart
 * @param dataDensity Data to show into density chart
 * @param normalDensity Data to show into normal density chart
 * @returns {DistNormalChart}
 * @constructor
 *
 * Created by Jose David Jurado Alonso <i22jualj@uco.es> on 07/15.
 */
function DistNormalChart($container, grid, dataDistribution, dataDensity, normalDensity) {

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
            text: Texts.decodeURIComponent("dc.charts.normal")
        },
        subtitle: UtilsChart.subtitleConfig,
        plotOptions: {
            columnrange: dcProbability.getPlotOptions()
        },
        xAxis: {
            min: -20,
            max: 20,
            tickInterval: 2,
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
     * @param average
     * @param sigma
     */
    this.updateSubtitle = function (average, sigma) {
        chart.setTitle(null, {text: "N( " + average + " , " + sigma + " )"});
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
 * Normal continuous distribution handler class
 *
 * @param averageValue Distribution 'average' parameter value
 * @param sigmaValue Distribution 'sigma' parameter value
 * @param startValue The start value of x axis
 * @param endValue The end value of x axis
 * @param totalPoints The total points of chart
 * @constructor
 *
 * Created by Jose David Jurado Alonso <i22jualj@uco.es> on 07/15.
 */
function DistNormal(averageValue, sigmaValue, startValue, endValue, totalPoints) {

    var average = parseFloat(averageValue);
    var sigma = parseFloat(sigmaValue);
    var normal = new NormalDistribution(average, sigma);
    var xAxisPoints = UtilsChart.getXAxisPoints(startValue, endValue, totalPoints);


    /************************************** METHODS ********************************************************/

    var distributionPoints = [], densityPoints = [];

    /**
     * Get the data points of distribution and density charts
     *
     * @returns {{dist: Array, density: Array}}
     */
    this.getPoints = function () {
        if (distributionPoints.length == 0 || densityPoints.length == 0) {
            var x, y, z;
            for (var i = 0, size = xAxisPoints.length; i < size; i++) {
                x = xAxisPoints[i];
                y = normal.density(x);
                z = normal.CDF(x);
                densityPoints[i] = [x, y];
                distributionPoints[i] = [x, z];
            }
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
            y = normal.density(i);
            point = [i, 0, y];
            area.push(point);
        }
        return area;
    };

    /**
     * Set the 'average' parameter value
     *
     * @param averageValue
     */
    this.setAverage = function (averageValue) {
        average = averageValue;
        distributionPoints = [];
        densityPoints = [];
        normal = new NormalDistribution(average, sigma);
    };

    /**
     * Set the 'sigma' parameter value
     *
     * @param sigmaValue
     */
    this.setDeviation = function (sigmaValue) {
        sigma = sigmaValue;
        distributionPoints = [];
        densityPoints = [];
        normal = new NormalDistribution(average, sigma);
    };

    /**
     * Update average and sigma parameters values
     *
     * @param averageValue
     * @param sigmaValue
     */
    this.update = function (averageValue, sigmaValue) {
        average = averageValue;
        sigma = sigmaValue;
        distributionPoints = [];
        densityPoints = [];
        normal = new NormalDistribution(average, sigma);
    };

    /**
     * Get the 'average' parameter value
     *
     * @returns {Number}
     */
    this.getAverage = function () {
        return average;
    };

    /**
     * Get the 'sigma' parameter value
     *
     * @returns {Number}
     */
    this.getSigma = function () {
        return sigma;
    };

    /**
     * Get the distribution object
     *
     * @returns {NormalDistribution}
     */
    this.getDistribution = function () {
        return normal;
    }
}
