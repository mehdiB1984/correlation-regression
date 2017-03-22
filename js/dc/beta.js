/*global dcProbability*/

/**
 * Beta continuous distribution chart class
 *
 * @param $container The chart container DOM as jquery object
 * @param grid  If the chart must be show the grid or not
 * @param dataDistribution Data to show into distribution chart
 * @param dataDensity Data to show into density chart
 * @returns {DistBetaChart}
 * @constructor
 *
 * Created by Jose David Jurado Alonso <i22jualj@uco.es> on 07/15.
 */
function DistBetaChart($container, grid, dataDistribution, dataDensity) {

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
            text: Texts.decodeURIComponent("dc.charts.beta")
        },
        subtitle: UtilsChart.subtitleConfig,
        plotOptions: {
            series: {
                animation: false
            },
            columnrange: dcProbability.getPlotOptions()
        },
        xAxis: {
            min: 0,
            max: 1.2,
            tickInterval: 0.05,
            gridLineWidth: grid ? 1 : 0
        },
        yAxis: [{
            min: 0,
            //max: 1.1,
            //tickInterval: 0.10,
            title: {
                text: Texts.decodeURIComponent("dc.charts.func.dist")
            },
            gridLineWidth: grid ? 1 : 0
        }, { // Secondary yAxis
            min: 0,
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
     * @param a
     * @param b
     */
    this.updateSubtitle = function (a, b) {
        chart.setTitle(null, {text: "B( " + a + " , " + b + " )"});
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
 * Beta continuous distribution handler class
 *
 * @param aValue Distribution 'a' parameter value
 * @param bValue Distribution 'b' parameter value
 * @param startValue The start value of x axis
 * @param endValue The end value of x axis
 * @param totalPoints The total points of chart
 * @constructor
 *
 * Created by Jose David Jurado Alonso <i22jualj@uco.es> on 07/15.
 */
function DistBeta(aValue, bValue, startValue, endValue, totalPoints) {

    var a = parseFloat(aValue);
    var b = parseFloat(bValue);
    var start = parseFloat(startValue);
    var end = parseFloat(endValue);
    var beta = new BetaDistribution(a, b);
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
            y = (x <= 0.0 || x >= 1.0) ? 0.0 : beta.density(x);
            z = (x <= 0.002 || x >= 1.002) ? 0.0 : beta.CDF(x);
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
        higher = higher >= 1 ? 1.2 : higher;
        var increment = UtilsChart.getIncrement(lower, higher, totalPoints);
        for (var i = lower; i <= higher; i = i + increment) {
            y = (i <= 0.0 || i >= 1.0) ? 0.0 : beta.density(i);
            point = [i, 0, y];
            area.push(point);
        }
        return area;
    };

    /**
     * Set the 'a' parameter value
     *
     * @param aValue
     */
    this.setA = function (aValue) {
        a = aValue;
        beta = new BetaDistribution(a, b);
    };

    /**
     * Set the 'b' parameter value
     *
     * @param bValue
     */
    this.setB = function (bValue) {
        b = bValue;
        beta = new BetaDistribution(a, b);
    };

    /**
     * Get the 'a' parameter value
     *
     * @returns {Number}
     */
    this.getA = function () {
        return a;
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
     * @returns {BetaDistribution}
     */
    this.getDistribution = function () {
        return beta;
    }
}
