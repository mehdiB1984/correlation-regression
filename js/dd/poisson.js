/*global ddProbability */

/**
 * Poisson discrete distribution chart class
 *
 * @param $container The chart container DOM as jquery object
 * @param grid  If the chart must be show the grid or not
 * @param xMax  The x axis max value
 * @param yMax  The y axis max value
 * @param dataDistribution  Data to show into distribution chart
 * @param dataProbability   Data to show into probability chart
 * @returns {DistPoissonChart}
 * @constructor
 *
 * Created by Jose David Jurado Alonso <i22jualj@uco.es> on 07/15
 */
function DistPoissonChart($container, grid, xMax, yMax, dataDistribution, dataProbability) {

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
            text: Texts.decodeURIComponent("dd.charts.poisson")
        },
        subtitle: UtilsChart.subtitleConfig,
        plotOptions: {
            columnrange: ddProbability.getPlotOptions(true)
        },
        xAxis: {
            //categories: UtilsDDChart.getCategories(xMax),
            min: 0,
            max: xMax,
            tickInterval: 1,
            gridLineWidth: grid ? 1 : 0
        },
        yAxis: {
            min: 0,
            max: yMax,
            tickInterval: 0.10,
            title: {
                text: Texts.decodeURIComponent("dd.charts.func.prob")
            },
            gridLineWidth: grid ? 1 : 0
        }, series: [
            UtilsDDChart.getDistributionSerie(dataDistribution),
            UtilsDDChart.getProbabilitySerie(dataProbability),
            ddProbability.getProbabilitySerie()
        ]
    };

    $container.highcharts(options);
    var chart = $container.highcharts();
    ddProbability.setCurrentChart(chart);
    UtilsDDChart.currentChart = chart;

    /**
     * Update the chart subtitle
     *
     * @param lambda The lambda value
     */
    this.updateSubtitle = function (lambda) {
        chart.setTitle(null, {text: "P( " + lambda + " )"});
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
 * Poisson discrete distribution handler class
 *
 * @param lambdaValue  Distribution 'lambda' parameter value
 * @param endValue The end or max value to calculate all data
 * @returns {DistPoisson}
 * @constructor
 *
 * Created by Jose David Jurado Alonso <i22jualj@uco.es> on 07/15
 */
function DistPoisson(lambdaValue, endValue) {

    var _this = this;
    var lambda = parseFloat(lambdaValue);
    var freqAux = [], frequencies = [];

    /**
     * Get the frequency corresponding to the distribution to a value 'x' past as a parameter.
     *
     * @param x The x axis value
     * @returns {number}
     */
    function f(x) {
        return (Math.pow(Math.E, -lambda) * Math.pow(lambda, x)) / Combinatory.getFactorial(x);
    }

    /**
     * Get the accumulated frequency to the distribution to a value 'x' past as a parameter.
     *
     * @param x The x axis value
     * @returns {*}
     * @constructor
     */
    function F(x) {
        if (x < 0) return 0;
        if (x > endValue - 1)
            return 1;
        return frequencies[x];
    }

    /****************** INIT *************************/

    /**
     * Calculate and set the accumulated frequencies into an array
     */
    function setFrequency() {
        frequencies = [];
        freqAux = [];
        for (var i = 0, sum = 0; i <= endValue; i++) {
            freqAux[i] = f(i);
            sum += freqAux[i];
            frequencies[i] = sum;
        }
    }

    var distributionPoints = [], probabilityPoints = [];

    /**
     * Get the data points of distribution and probability charts
     *
     * @returns {{dist: Array, prob: Array}}
     */
    this.getPoints = function () {
        if (distributionPoints.length == 0 || probabilityPoints.length == 0) {
            setFrequency();
            var x, y, z;
            for (var i = 0; i <= endValue; i++) {
                x = i;
                y = freqAux[i];//f(x);
                z = F(x);
                probabilityPoints[i] = [x, y > 1 ? 1 : y];
                distributionPoints[i] = [x, z > 1 ? 1 : z];
            }
        }
        return {dist: distributionPoints, prob: probabilityPoints}
    };

    /**
     * Reset data points arrays
     */
    this.resetPoints = function () {
        distributionPoints = [];
        probabilityPoints = [];
        _this.getPoints();
    };

    /**
     * Calculate and return the probability values of the lower and higher values provided.
     *
     * @param lower The lower value
     * @param higher    The higher value
     * @returns {{lower: *, higher: *}}
     */
    this.getProbabilityValues = function (lower, higher) {
        return {lower: UtilsDCResult.round(F(parseInt(lower))), higher: UtilsDCResult.round(F(parseInt(higher)))};
    };

    /**
     * Get the probability value to the distribution to a value 'x' past as a parameter.
     *
     * @param x The x axis value
     * @returns {*}
     */
    this.getP = function (x) {
        if (probabilityPoints.length > x) {
            var point = probabilityPoints[x];
            return point instanceof Array ? point[1] : point.y;
        }
    };

    /**
     * Get the frequency value to the distribution to a value 'x' past as a parameter.
     *
     * @param x The x axis value
     * @returns {*}
     */
    this.getF = function (x) {
        if (frequencies.length > x) {
            return F(x);
        }
    };

    /**
     * Update distribution parameters and set to empty the data points arrays to force to recalculate.
     *
     * @param lambdaValue The 'lambda' distribution value
     */
    this.update = function (lambdaValue) {
        lambda = lambdaValue;
        distributionPoints = [];
        probabilityPoints = [];
    };

    /**
     * Get the 'lambda' parameter value
     *
     * @returns {Number}
     */
    this.getLambda = function () {
        return lambda;
    };

    return this;
}
