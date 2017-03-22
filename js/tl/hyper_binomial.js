/**
 * 'Hypergeometric - Binomial' approximation chart class
 *
 * @param $container The chart container DOM as jquery object
 * @param grid  If the chart must be show the grid or not
 * @param primaryData Data to show into primary chart (Hypergeometric data)
 * @param secondaryData Data to show into secondary chart (Binomial data)
 * @returns {DistHyperBinomialChart}
 * @constructor
 *
 * Created by Jose David Jurado Alonso <i22jualj@uco.es> on 07/15
 */
function DistHyperBinomialChart($container, grid, primaryData, secondaryData) {

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
            text: Texts.decodeURIComponent("tl.aprox.label") + Texts.decodeURIComponent("tl.aprox.hb")
        },
        plotOptions: {
            column: {
                grouping: false
            }
        },
        xAxis: {
            min: 0,
            max: 80,
            tickInterval: 1,
            gridLineWidth: grid ? 1 : 0
        },
        yAxis: [
            UtilsTLChart.getYAxisPrimary(grid),
            UtilsTLChart.getYAxisSecondary(grid)
        ],
        series: [
            UtilsTLChart.getPrimaryScatterDist(primaryData.dist),
            UtilsTLChart.getPrimaryColumnProb(primaryData.prob),
            UtilsTLChart.getSecondaryScatterDist(secondaryData.dist),
            UtilsTLChart.getSecondaryColumnProb(secondaryData.prob)
        ]
    };

    $container.highcharts(options);
    var chart = $container.highcharts();

    var primaryPrefix = Texts.decodeURIComponent("tl.charts.hyper") + " ";
    var secondaryPrefix = Texts.decodeURIComponent("tl.charts.binomial") + " ";

    /**
     * Set y axis titles
     *
     * @param n The n value
     * @param a The a value
     * @param b The b value
     */
    this.setAxisTitles = function (n, a, b) {
        if (chart !== undefined) {
            var p = a / (a + b);
            chart.yAxis[0].update({
                title: {
                    text: primaryPrefix + "(" + n + " , " + a + " , " + b + ")"
                }
            });
            chart.yAxis[1].update({
                title: {
                    text: secondaryPrefix + "(" + p.toFixed(2) + " , " + n + ")"
                }
            });
        }
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
 * 'Hypergeometric - Binomial' approximation handler class
 *
 * @param totalPoints The total points to calculate
 * @constructor
 *
 * Created by Jose David Jurado Alonso <i22jualj@uco.es> on 07/15
 */
function DistHyperBinomial(totalPoints) {

    var hyper, binomial;

    /**
     * Initializes both distributions
     *
     * @param nValue The 'n' parameter value
     * @param aValue The 'a' parameter value
     * @param bValue The 'b' parameter value
     */
    this.init = function (nValue, aValue, bValue) {
        hyper = new DistHyper(nValue, aValue, bValue, totalPoints);
        var p = aValue / (aValue + bValue);
        binomial = new DistBinomial(p, nValue, totalPoints);
    };

    /**
     * Updates both distributions
     *
     * @param nValue The 'n' parameter value
     * @param aValue The 'a' parameter value
     * @param bValue The 'b' parameter value
     */
    this.update = function (nValue, aValue, bValue) {
        if (hyper !== undefined) {
            hyper.update(nValue, aValue, bValue);
            var p = aValue / (aValue + bValue);
            binomial.update(p, nValue);
        }
    };

    /**
     * Get the primary distribution (hypergeometric) data points
     *
     * @returns {{dist: Array, density: Array}|{dist: Array, prob: Array}}
     */
    this.getPrimaryData = function () {
        if (hyper !== undefined) {
            return hyper.getPoints();
        }
    };

    /**
     * Get the secondary distribution (binomial) data points
     *
     * @returns {{dist: Array, density: Array}|{dist: Array, prob: Array}}
     */
    this.getSecondaryData = function () {
        if (binomial !== undefined) {
            return binomial.getPoints();
        }
    };
}
