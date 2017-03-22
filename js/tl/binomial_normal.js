/**
 * 'Binomial - Normal' approximation chart class
 *
 * @param $container The chart container DOM as jquery object
 * @param grid  If the chart must be show the grid or not
 * @param primaryData Data to show into primary chart (binomial data)
 * @param secondaryData Data to show into secondary chart (normal data)
 * @returns {DistBinomialNormalChart}
 * @constructor
 *
 * Created by Jose David Jurado Alonso <i22jualj@uco.es> on 07/15
 */
function DistBinomialNormalChart($container, grid, primaryData, secondaryData) {

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
            text: Texts.decodeURIComponent("tl.aprox.label") + Texts.decodeURIComponent("tl.aprox.bn")
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
            UtilsTLChart.getSecondaryLineDist(secondaryData.dist),
            UtilsTLChart.getSecondaryLineProb(secondaryData.density)
        ]
    };

    $container.highcharts(options);
    var chart = $container.highcharts();

    var primaryPrefix = Texts.decodeURIComponent("tl.charts.binomial") + " ";
    var secondaryPrefix = Texts.decodeURIComponent("tl.charts.normal") + " ";

    /**
     * Set y axis titles
     *
     * @param n The n value
     * @param p The p value
     */
    this.setAxisTitles = function (n, p) {
        if (chart !== undefined) {
            var average = n * p;
            var sigma = Math.sqrt((n * p * (1 - p)));
            chart.yAxis[0].update({
                title: {
                    text: primaryPrefix + "(" + p.toFixed(2) + " , " + n + ")"
                }
            });
            chart.yAxis[1].update({
                title: {
                    text: secondaryPrefix + "(" + average.toFixed(2) + ", " + sigma.toFixed(2) + ")"
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
 * 'Binomial - Normal' approximation handler class
 *
 * @param totalPoints The total points to calculate
 * @constructor
 *
 * Created by Jose David Jurado Alonso <i22jualj@uco.es> on 07/15
 */
function DistBinomialNormal(totalPoints) {

    var binomial, normal;

    /**
     * Initializes both distributions
     *
     * @param nValue The 'n' parameter value
     * @param pValue The 'p' parameter value
     */
    this.init = function (nValue, pValue) {
        binomial = new DistBinomial(pValue, nValue, totalPoints);
        var average = nValue * pValue;
        var sigma = Math.sqrt((nValue * pValue * (1 - pValue)));
        normal = new DistNormal(average, sigma, 0, totalPoints, totalPoints);
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
            var average = nValue * pValue;
            var sigma = Math.sqrt((nValue * pValue * (1 - pValue)));
            normal.update(average, sigma);
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
     * Get the secondary distribution (normal) data points
     *
     * @returns {{dist: Array, density: Array}|{dist: Array, prob: Array}}
     */
    this.getSecondaryData = function () {
        if (normal !== undefined) {
            return normal.getPoints();
        }
    };
}
