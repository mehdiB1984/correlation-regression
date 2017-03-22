/**
 * 'Poisson - Normal' approximation chart class
 *
 * @param $container The chart container DOM as jquery object
 * @param grid  If the chart must be show the grid or not
 * @param primaryData Data to show into primary chart (Poisson data)
 * @param secondaryData Data to show into secondary chart (Normal data)
 * @returns {DistPoissonNormalChart}
 * @constructor
 *
 * Created by Jose David Jurado Alonso <i22jualj@uco.es> on 07/15
 */
function DistPoissonNormalChart($container, grid, primaryData, secondaryData) {

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
            text: Texts.decodeURIComponent("tl.aprox.label") + Texts.decodeURIComponent("tl.aprox.pn")
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

    var primaryPrefix = Texts.decodeURIComponent("tl.charts.poisson") + " ";
    var secondaryPrefix = Texts.decodeURIComponent("tl.charts.normal") + " ";

    /**
     * Set y axis titles
     *
     * @param lambda The lambda value
     */
    this.setAxisTitles = function (lambda) {
        if (chart !== undefined) {
            var average = lambda;
            var sigma = Math.sqrt(lambda);
            chart.yAxis[0].update({
                title: {
                    text: primaryPrefix + "(" + lambda + ")"
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
 * 'Poisson - Normal' approximation handler class
 *
 * @param totalPoints The total points to calculate
 * @constructor
 *
 * Created by Jose David Jurado Alonso <i22jualj@uco.es> on 07/15
 */
function DistPoissonNormal(totalPoints) {

    var poisson, normal;

    /**
     * Initializes both distributions
     *
     * @param lambdaValue The 'lambda' parameter value
     */
    this.init = function (lambdaValue) {
        poisson = new DistPoisson(lambdaValue, totalPoints);
        var average = lambdaValue;
        var sigma = Math.sqrt(lambdaValue);
        normal = new DistNormal(average, sigma, 0, totalPoints, totalPoints);
    };

    /**
     * Updates both distributions
     *
     * @param lambdaValue The 'lambda' parameter value
     */
    this.update = function (lambdaValue) {
        if (poisson !== undefined) {
            poisson.update(lambdaValue);
            var average = lambdaValue;
            var sigma = Math.sqrt(lambdaValue);
            normal.update(average, sigma);
        }
    };

    /**
     * Get the primary distribution (poisson) data points
     *
     * @returns {{dist: Array, density: Array}|{dist: Array, prob: Array}}
     */
    this.getPrimaryData = function () {
        if (poisson !== undefined) {
            return poisson.getPoints();
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
