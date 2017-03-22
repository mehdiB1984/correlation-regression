/**
 * 'Binomial - Poisson' approximation chart class
 *
 * @param $container The chart container DOM as jquery object
 * @param grid  If the chart must be show the grid or not
 * @param primaryData Data to show into primary chart (binomial data)
 * @param secondaryData Data to show into secondary chart (poisson data)
 * @returns {DistBinomialPoissonChart}
 * @constructor
 */
function DistBinomialPoissonChart($container, grid, primaryData, secondaryData) {

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
            text: Texts.decodeURIComponent("tl.aprox.label") + Texts.decodeURIComponent("tl.aprox.bp")
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

    var primaryPrefix = Texts.decodeURIComponent("tl.charts.binomial") + " ";
    var secondaryPrefix = Texts.decodeURIComponent("tl.charts.poisson") + " ";

    /**
     * Set y axis titles
     *
     * @param n The n value
     * @param p The p value
     */
    this.setAxisTitles = function (n, p) {
        if (chart !== undefined) {
            var lambda = n * p;
            chart.yAxis[0].update({
                title: {
                    text: primaryPrefix + "(" + p.toFixed(2) + " , " + n + ")"
                }
            });
            chart.yAxis[1].update({
                title: {
                    text: secondaryPrefix + "(" + lambda.toFixed(2) + ")"
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
 * 'Binomial - Poisson' approximation handler class
 *
 * @param totalPoints The total points to calculate
 * @constructor
 *
 * Created by Jose David Jurado Alonso <i22jualj@uco.es> on 07/15
 */
function DistBinomialPoisson(totalPoints) {

    var binomial, poisson;

    /**
     * Initializes both distributions
     *
     * @param nValue The 'n' parameter value
     * @param pValue The 'p' parameter value
     */
    this.init = function (nValue, pValue) {
        binomial = new DistBinomial(pValue, nValue, totalPoints);
        var lambdaValue = nValue * pValue;
        poisson = new DistPoisson(lambdaValue, totalPoints);

    };

    /**
     * Updates both distributions
     *
     * @param nValue The 'n' parameter value
     * @param pValue The 'p' parameter value
     */
    this.update = function (nValue, pValue) {
        if (binomial !== undefined) {
            binomial.update(pValue, nValue);
            var lambdaValue = nValue * pValue;
            poisson.update(lambdaValue);
        }
    };

    /**
     * Get the primary distribution (binomial) data points
     *
     * @returns {{dist: Array, density: Array}|{dist: Array, prob: Array}}
     */
    this.getPrimaryData = function () {
        if (binomial !== undefined) {
            return binomial.getPoints();
        }
    };

    /**
     * Get the secondary distribution (poisson) data points
     *
     * @returns {{dist: Array, density: Array}|{dist: Array, prob: Array}}
     */
    this.getSecondaryData = function () {
        if (poisson !== undefined) {
            return poisson.getPoints();
        }
    };
}
