/**
 * 'T-Student - Normal' approximation chart class
 *
 * @param $container The chart container DOM as jquery object
 * @param grid  If the chart must be show the grid or not
 * @param primaryData Data to show into primary chart (T-Student data)
 * @param secondaryData Data to show into secondary chart (Normal data)
 * @returns {DistStudentNormalChart}
 * @constructor
 *
 * Created by Jose David Jurado Alonso <i22jualj@uco.es> on 07/15
 */
function DistStudentNormalChart($container, grid, primaryData, secondaryData) {

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
            text: Texts.decodeURIComponent("tl.aprox.label") + Texts.decodeURIComponent("tl.aprox.sn")
        },
        plotOptions: {
            column: {
                grouping: false
            }
        },
        xAxis: {
            min: -10,
            max: 10,
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

    var primaryPrefix = Texts.decodeURIComponent("tl.charts.student") + " ";
    var secondaryPrefix = Texts.decodeURIComponent("tl.charts.normal") + " ";

    /**
     * Set y axis titles
     *
     * @param n The n value
     */
    this.setAxisTitles = function (n) {
        if (chart !== undefined) {
            chart.yAxis[0].update({
                title: {
                    text: primaryPrefix + "(" + n + ")"
                }
            });
            chart.yAxis[1].update({
                title: {
                    text: secondaryPrefix + "(0 , 1)"
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
 * 'T-Student - Normal' approximation handler class
 *
 * @constructor
 *
 * Created by Jose David Jurado Alonso <i22jualj@uco.es> on 07/15
 */
function DistStudentNormal() {

    var student, normal;

    /**
     * Initializes both distributions
     *
     * @param gradesValue The 'grades' parameter value
     */
    this.init = function (gradesValue) {
        student = new DistStudent(gradesValue, -10, 10, UtilsChart.POINTS);
        normal = new DistNormal(0, 1, -10, 10, UtilsChart.POINTS);
    };

    /**
     * Updates both distributions
     *
     * @param gradesValue The 'grades' parameter value
     */
    this.update = function (gradesValue) {
        if (student !== undefined) {
            student.setGrades(gradesValue);
        }
    };

    /**
     * Get the primary distribution (T-Student) data points
     *
     * @returns {{dist: Array, density: Array}|{dist: Array, prob: Array}}
     */
    this.getPrimaryData = function () {
        if (student !== undefined) {
            return student.getPoints();
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
