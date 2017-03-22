/*global ddProbability */

/**
 * Hypergeometric discrete distribution chart class
 *
 * @param $container The chart container DOM as jquery object
 * @param grid  If the chart must be show the grid or not
 * @param xMax  The x axis max value
 * @param yMax  The y axis max value
 * @param dataDistribution  Data to show into distribution chart
 * @param dataProbability   Data to show into probability chart
 * @returns {DistHyperChart}
 * @constructor
 *
 * Created by Jose David Jurado Alonso <i22jualj@uco.es> on 07/15
 */
function DistHyperChart($container, grid, xMax, yMax, dataDistribution, dataProbability) {

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
            text: Texts.decodeURIComponent("dd.charts.hyper")
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
     * @param n The n value
     * @param a The a value
     * @param b The b value
     */
    this.updateSubtitle = function (n, a, b) {
        chart.setTitle(null, {text: "h( " + n + " , " + a + " , " + b + " )"});
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
 * Hypergeometric discrete distribution handler class
 *
 * @param nValue Distribution 'n' parameter value
 * @param aValue Distribution 'a' parameter value
 * @param bValue Distribution 'b' parameter value
 * @param endValue The end or max value to calculate all data
 * @returns {DistHyper}
 * @constructor
 *
 * Created by Jose David Jurado Alonso <i22jualj@uco.es> on 07/15
 */
function DistHyper(nValue, aValue, bValue, endValue) {

    var _this = this;

    var n = parseInt(nValue);
    var a = parseInt(aValue);
    var b = parseInt(bValue);
    var freqAux = [], frequencies = [];


    /**
     * Get the frequency corresponding to the distribution to a value 'x' past as a parameter.
     *
     * @param x The x axis value
     * @returns {number}
     */
    function f(x) {
        var comb1 = Combinatory.getCombinatory(a, x);
        var comb2 = Combinatory.getCombinatory(b, (n - x));
        var comb3 = Combinatory.getCombinatory((a + b), n);

        if (comb1 < 0 || comb2 < 0 || comb3 < 0) {
            return 0;
        }
        else {
            return (comb1 * comb2) / comb3;
        }
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
                y = freqAux[i]; //f(x);
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
     * @param nValue The 'n' distribution value
     * @param aValue The 'a' distribution value
     * @param bValue The 'b' distribution value
     */
    this.update = function (nValue, aValue, bValue) {
        n = nValue;
        a = aValue;
        b = bValue;
        distributionPoints = [];
        probabilityPoints = [];
    };

    /**
     * Check if the combination of parameters values are valid or not (n <= a + b)
     *
     * @returns {boolean}
     */
    this.isValid = function () {
        return n <= a + b;
    };

    /**
     * Get the 'n' parameter value
     *
     * @returns {Number}
     */
    this.getN = function () {
        return n;
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

    return this;
}
