/**
 * 'Chi-Square - Normal' approximation chart class
 *
 * @param $container The chart container DOM as jquery object
 * @param grid  If the chart must be show the grid or not
 * @param primaryData Data to show into primary chart (chi-square data)
 * @param secondaryData Data to show into secondary chart (normal data)
 * @returns {DistChiNormalChart}
 * @constructor
 *
 * Created by Jose David Jurado Alonso <i22jualj@uco.es> on 07/15
 */
function DistChiNormalChart($container, grid, primaryData, secondaryData) {

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
            text: Texts.decodeURIComponent("tl.aprox.label") + Texts.decodeURIComponent("tl.aprox.cn")
        },
        plotOptions: {
            column: {
                grouping: false
            }
        },
        xAxis: {
            //categories: categories,
            min: 0,
            max: 100,
            tickInterval: 1,
            gridLineWidth: grid ? 1 : 0
        },
        yAxis: [
            UtilsTLChart.getYAxisPrimary(grid),
            UtilsTLChart.getYAxisSecondary(grid)
        ],
        series: [
            UtilsTLChart.getPrimaryLineDist(primaryData.dist),
            UtilsTLChart.getPrimaryLineProb(primaryData.density),
            UtilsTLChart.getSecondaryLineDist(secondaryData.dist),
            UtilsTLChart.getSecondaryLineProb(secondaryData.density)
        ]
    };

    $container.highcharts(options);
    var chart = $container.highcharts();

    var primaryPrefix = Texts.decodeURIComponent("tl.charts.chi") + " ";
    var secondaryPrefix = Texts.decodeURIComponent("tl.charts.normal") + " ";

    /**
     * Set y axis titles
     *
     * @param grades The grades value
     */
    this.setAxisTitles = function (grades) {
        if (chart !== undefined) {
            var average = grades;
            var sigma = Math.sqrt(2 * grades);
            chart.yAxis[0].update({
                title: {
                    text: primaryPrefix + "(" + grades + ")"
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
 * 'Chi-Square - Normal' approximation handler class
 *
 * @param totalPoints The total points to calculate
 * @constructor
 *
 * Created by Jose David Jurado Alonso <i22jualj@uco.es> on 07/15
 */
function DistChiNormal(totalPoints) {

    var chi, normal;

    /**
     * Initializes both distributions
     *
     * @param gradesValue  The 'grades' parameter value
     */
    this.init = function (gradesValue) {
        chi = new DistChi(gradesValue, 0, totalPoints, totalPoints);
        var average = gradesValue;
        var sigma = Math.sqrt(2 * gradesValue);
        normal = new DistNormal(average, sigma, 0, totalPoints, totalPoints);
    };

    /**
     * Updates both distributions
     *
     * @param gradesValue The 'grades' parameter value
     */
    this.update = function (gradesValue) {
        if (chi !== undefined) {
            chi.setGrades(gradesValue);
            var average = gradesValue;
            var sigma = Math.sqrt(2 * gradesValue);
            normal.update(average, sigma);
        }
    };

    /**
     * Get the primary distribution (Chi-Square) data points
     *
     * @returns {{dist: Array, density: Array}|{dist: Array, prob: Array}}
     */
    this.getPrimaryData = function () {
        if (chi !== undefined) {
            return chi.getPoints();
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
