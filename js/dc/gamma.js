/*global dcProbability */

/**
 * Gamma continuous distribution chart class
 *
 * @param $container The chart container DOM as jquery object
 * @param grid  If the chart must be show the grid or not
 * @param dataDistribution Data to show into distribution chart
 * @param dataDensity Data to show into density chart
 * @param isExpo If it is an exponential chart or not
 * @param isBig If require big axies values or not
 * @returns {DistGammaChart}
 * @constructor
 *
 * Created by Jose David Jurado Alonso <i22jualj@uco.es> on 07/15.
 */
function DistGammaChart($container, grid, dataDistribution, dataDensity, isExpo, isBig) {

    var title = Texts.decodeURIComponent("dc.charts.gamma");
    var xMin = 0, xMax = 100, xInterval = 5, yMax = 1;

    if (isExpo) {
        title = Texts.decodeURIComponent("dc.charts.expo");
        xMin = 0;
        xMax = 40;
        xInterval = 2;
        if (isBig) {
            yMax = 1.6;
        }
    }

    var options = {
        chart: {
            zoomType: 'xy',
            animation: false,
            shadow: false
            //alignTicks: false
        },
        tooltip: {
            enabled: false
        },
        title: {
            text: title
        },
        subtitle: UtilsChart.subtitleConfig,
        plotOptions: {
            series: {
                animation: false
            },
            columnrange: dcProbability.getPlotOptions()
        },
        xAxis: {
            min: xMin,
            max: xMax,
            tickInterval: xInterval,
            gridLineWidth: grid ? 1 : 0
        },
        yAxis: [{
            min: 0,
            max: yMax,
            tickInterval: 0.10,
            title: {
                text: Texts.decodeURIComponent("dc.charts.func.dist")
            },
            gridLineWidth: grid ? 1 : 0
        }, { // Secondary yAxis
            min: 0,
            max: yMax,
            tickInterval: 0.10,
            title: {
                text: Texts.decodeURIComponent("dc.charts.func.density")
            },
            gridLineWidth: grid ? 1 : 0,
            opposite: true
        }], series: [
            UtilsDCChart.getDistributionSerie(dataDistribution),
            UtilsDCChart.getDensitySerie(dataDensity),
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
     * @param k
     * @param b
     */
    this.updateSubtitle = function (k, b) {
        chart.setTitle(null, {text: "Gamma( " + k + " , " + b + " )"});
    };

    /**
     * Update the chart subtitle in exponential chart case
     *
     * @param value
     */
    this.updateSubtitleExpo = function (value) {
        chart.setTitle(null, {text: "Expo( " + value + " )"});
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
 * Gamma continuous distribution handler class
 *
 * @param kValue Distribution 'k' parameter value
 * @param bValue Distribution 'b' parameter value
 * @param startValue The start value of x axis
 * @param endValue The end value of x axis
 * @param totalPoints The total points of chart
 * @constructor
 *
 * Created by Jose David Jurado Alonso <i22jualj@uco.es> on 07/15.
 */
function DistGamma(kValue, bValue, startValue, endValue, totalPoints) {

    var k = parseFloat(kValue);
    var b = parseFloat(bValue);
    var start = parseFloat(startValue);
    var end = parseFloat(endValue);
    var gamma = new GammaDistribution(k, b);
    var xAxisPoints = UtilsChart.getXAxisPoints(start, end, totalPoints);

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
            y = (x <= 0.0) ? 0.0 : gamma.density(x);
            z = (x <= 0.0) ? 0.0 : gamma.CDF(x);
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
            y = (i <= 0.0) ? 0.0 : gamma.density(i);
            point = [i, 0, y];
            area.push(point);
        }
        return area;
    };

    /**
     * Set the 'k' parameter value
     *
     * @param kValue
     */
    this.setK = function (kValue) {
        k = kValue;
        gamma = new GammaDistribution(k, b);
    };

    /**
     * Set the 'b' parameter value
     *
     * @param bValue
     */
    this.setB = function (bValue) {
        b = bValue;
        gamma = new GammaDistribution(k, b);
    };

    /**
     * Get the 'k' parameter value
     *
     * @returns {Number}
     */
    this.getK = function () {
        return k;
    };

    /**
     * Get the 'b' parameter value
     *
     * @returns {Number}
     */
    this.getB = function () {
        return b;
    };

    /**
     * Get the distribution object
     *
     * @returns {GammaDistribution}
     */
    this.getDistribution = function () {
        return gamma;
    }
}
