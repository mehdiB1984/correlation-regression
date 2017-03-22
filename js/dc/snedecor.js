/*global dcProbability */

/**
 * Snedecor sizes depending of min and max yAxis values
 *
 * @type {{NORMAL: number, MEDIUM: number, HIGH: number}}
 */
var SnedecorSize = {
    NORMAL: 1,
    MEDIUM: 2,
    HIGH: 3
};

/**
 * F-Snedecor continuous distribution chart class
 *
 * @param $container The chart container DOM as jquery object
 * @param grid  If the chart must be show the grid or not
 * @param dataDistribution Data to show into distribution chart
 * @param dataDensity Data to show into density chart
 * @param size The yAxis size values
 * @returns {DistSnedecorChart}
 * @constructor
 *
 * Created by Jose David Jurado Alonso <i22jualj@uco.es> on 07/15.
 */
function DistSnedecorChart($container, grid, dataDistribution, dataDensity, size) {

    var yMax = 1;
    var yInterval = 0.1;

    switch (size) {
        case SnedecorSize.MEDIUM:
            yMax = 1.6;
            yInterval = 0.2;
            break;
        case SnedecorSize.HIGH:
            yMax = 2.2;
            yInterval = 0.2;
            break;
        default :
            yMax = 1;
            yInterval = 0.1;
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
            text: Texts.decodeURIComponent("dc.charts.snedecor")
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
            max: 10,
            tickInterval: 0.5,
            gridLineWidth: grid ? 1 : 0
        },
        yAxis: [{
            min: 0,
            max: yMax,
            tickInterval: yInterval,
            title: {
                text: Texts.decodeURIComponent("dc.charts.func.dist")
            },
            gridLineWidth: grid ? 1 : 0
        }, { // Secondary yAxis
            min: 0,
            max: yMax,
            tickInterval: yInterval,
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
     * @param n1 'n1' parameter value
     * @param n2 'n2' parameter value
     */
    this.updateSubtitle = function (n1, n2) {
        chart.setTitle(null, {text: "F( " + n1 + " , " + n2 + " )"});
    };

    /**
     * Return the highchart object
     *
     * @returns {*}
     */
    this.getHighchart = function () {
        return chart;
    };

    /**
     * Return the size of chart axies values
     *
     * @returns {*}
     */
    this.getSize = function () {
        return size;
    };

    return this;
}

/**
 * F-Snedecor continuous distribution handler class
 *
 * @param n1Value Distribution 'n1' parameter value
 * @param n2Value Distribution 'n2' parameter value
 * @param totalPoints The total points of chart
 * @constructor
 *
 * Created by Jose David Jurado Alonso <i22jualj@uco.es> on 07/15.
 */
function DistSnedecor(n1Value, n2Value, totalPoints) {

    var n1 = parseFloat(n1Value);
    var n2 = parseFloat(n2Value);
    var start = 0;
    var end = 10;
    var snedecor = new FDistribution(n1, n2);
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
            y = (x <= 0.0) ? 0.0 : snedecor.density(x);
            z = (x <= 0.0) ? 0.0 : snedecor.CDF(x);
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
            y = (i <= 0.0) ? 0.0 : snedecor.density(i);
            point = [i, 0, y];
            area.push(point);
        }
        return area;
    };

    /**
     * Set the 'n1' parameter value
     *
     * @param n1Value
     */
    this.setN1 = function (n1Value) {
        n1 = n1Value;
        snedecor = new FDistribution(n1, n2);
    };

    /**
     * Set the 'n2' parameter value
     *
     * @param n2Value
     */
    this.setN2 = function (n2Value) {
        n2 = n2Value;
        snedecor = new FDistribution(n1, n2);
    };

    /**
     * Get the 'n1' parameter value
     *
     * @returns {Number}
     */
    this.getN1 = function () {
        return n1;
    };

    /**
     * Get the 'n2' parameter value
     *
     * @returns {Number}
     */
    this.getN2 = function () {
        return n2;
    };

    /**
     * Get the distribution object
     *
     * @returns {FDistribution}
     */
    this.getDistribution = function () {
        return snedecor;
    }
}
