/**
 * Theorems limit approximation GUI handler class
 *
 * @constructor
 *
 * Created by Jose David Jurado Alonso <i22jualj@uco.es> on 07/15.
 */
function TheoremsLimit() {

    var $distSelect = $("#tl_aprox");
    var $grid = $("#tl_grid");
    var $container = $("#tl_chart_container");

    var currentDist, currentChart;
    var hyperBinomialDist, hyperBinomialChart;
    var binomialPoissonDist, binomialPoissonChart;
    var binomialNormalDist, binomialNormalChart;
    var poissonNormalDist, poissonNormalChart;
    var studentNormalDist, studentNormalChart;
    var chiNormalDist, chiNormalChart;

    /****************************** INIT DISTRIBUTIONS *************************************/

    /**
     * Initialize the 'Hypergeometric - Binomial' approximation handler and chart
     */
    var initHyperBinomial = function () {
        if (hyperBinomialA !== undefined && hyperBinomialB !== undefined && hyperBinomialN !== undefined) {
            hyperBinomialDist = new DistHyperBinomial(80);
            var n = hyperBinomialN.getValue(), a = hyperBinomialA.getValue(), b = hyperBinomialB.getValue();
            hyperBinomialDist.init(n, a, b);
            currentDist = hyperBinomialDist;
            hyperBinomialChart = new DistHyperBinomialChart($container, $grid.is(":checked"), hyperBinomialDist.getPrimaryData(), hyperBinomialDist.getSecondaryData());
            hyperBinomialChart.setAxisTitles(n, a, b);
            currentChart = hyperBinomialChart;
        }
    };

    /**
     * Initialize the 'Binomial - Poisson' approximation handler and chart
     */
    var initBinomialPoisson = function () {
        if (binomialPoissonN !== undefined && binomialPoissonP !== undefined) {
            binomialPoissonDist = new DistBinomialPoisson(80);
            var n = binomialPoissonN.getValue(), p = binomialPoissonP.getValue();
            binomialPoissonDist.init(n, p);
            currentDist = binomialPoissonDist;
            binomialPoissonChart = new DistBinomialPoissonChart($container, $grid.is(":checked"), binomialPoissonDist.getPrimaryData(), binomialPoissonDist.getSecondaryData());
            binomialPoissonChart.setAxisTitles(n, p);
            currentChart = binomialPoissonChart;
        }
    };

    /**
     * Initialize the 'Binomial - Normal' approximation handler and chart
     */
    var initBinomialNormal = function () {
        if (binomialNormalN !== undefined && binomialNormalP !== undefined) {
            binomialNormalDist = new DistBinomialNormal(80);
            var n = binomialNormalN.getValue(), p = binomialNormalP.getValue();
            binomialNormalDist.init(n, p);
            currentDist = binomialNormalDist;
            binomialNormalChart = new DistBinomialNormalChart($container, $grid.is(":checked"), binomialNormalDist.getPrimaryData(), binomialNormalDist.getSecondaryData());
            binomialNormalChart.setAxisTitles(n, p);
            currentChart = binomialNormalChart;
        }
    };

    /**
     * Initialize the 'Poisson - Normal' approximation handler and chart
     */
    var initPoissonNormal = function () {
        if (poissonNormalL !== undefined) {
            poissonNormalDist = new DistPoissonNormal(100);
            poissonNormalDist.init(poissonNormalL.getValue());
            currentDist = poissonNormalDist;
            poissonNormalChart = new DistPoissonNormalChart($container, $grid.is(":checked"), poissonNormalDist.getPrimaryData(), poissonNormalDist.getSecondaryData());
            poissonNormalChart.setAxisTitles(poissonNormalL.getValue());
            currentChart = poissonNormalChart;
        }
    };

    /**
     * Initialize the 'T-Student - Normal' approximation handler and chart
     */
    var initStudentNormal = function () {
        if (studentNormalN !== undefined) {
            studentNormalDist = new DistStudentNormal();
            studentNormalDist.init(studentNormalN.getValue());
            currentDist = studentNormalDist;
            studentNormalChart = new DistStudentNormalChart($container, $grid.is(":checked"), studentNormalDist.getPrimaryData(), studentNormalDist.getSecondaryData());
            studentNormalChart.setAxisTitles(studentNormalN.getValue());
            currentChart = studentNormalChart;
        }
    };

    /**
     * Initialize the 'Chi-Square - Normal' approximation handler and chart
     */
    var initChiNormal = function () {
        if (chiNormalN !== undefined) {
            chiNormalDist = new DistChiNormal(100);
            chiNormalDist.init(chiNormalN.getValue());
            currentDist = chiNormalDist;
            chiNormalChart = new DistChiNormalChart($container, $grid.is(":checked"), chiNormalDist.getPrimaryData(), chiNormalDist.getSecondaryData());
            chiNormalChart.setAxisTitles(chiNormalN.getValue());
            currentChart = chiNormalChart;
        }
    };

    /******************************** SLIDERS ****************************************/

    /**
     * On 'Hypergeometric - Binomial' approximation parameters change
     *
     * @param position
     * @param value
     */
    var onHyperBinomialSlide = function (position, value) {
        if (hyperBinomialDist !== undefined) {
            var n = hyperBinomialN.getValue(), a = hyperBinomialA.getValue(), b = hyperBinomialB.getValue();
            hyperBinomialDist.update(n, a, b);
            hyperBinomialChart.setAxisTitles(n, a, b);
            UtilsTLChart.setData(hyperBinomialChart.getHighchart(), hyperBinomialDist.getPrimaryData(), hyperBinomialDist.getSecondaryData());
        }
    };

    /**
     * On 'Binomial - Poisson' approximation parameters change
     *
     * @param position
     * @param value
     */
    var onBinomialPoissonSlide = function (position, value) {
        if (binomialPoissonDist !== undefined) {
            var n = binomialPoissonN.getValue(), p = binomialPoissonP.getValue();
            binomialPoissonDist.update(n, p);
            binomialPoissonChart.setAxisTitles(n, p);
            UtilsTLChart.setData(binomialPoissonChart.getHighchart(), binomialPoissonDist.getPrimaryData(), binomialPoissonDist.getSecondaryData());
        }
    };

    /**
     * On 'Binomial - Normal' approximation parameters change
     *
     * @param position
     * @param value
     */
    var onBinomialNormalSlide = function (position, value) {
        if (binomialNormalDist !== undefined) {
            var n = binomialNormalN.getValue(), p = binomialNormalP.getValue();
            binomialNormalDist.update(n, p);
            binomialNormalChart.setAxisTitles(n, p);
            UtilsTLChart.setData(binomialNormalChart.getHighchart(), binomialNormalDist.getPrimaryData(), binomialNormalDist.getSecondaryData());
        }
    };

    /**
     * On 'Poisson - Normal' approximation parameters change
     *
     * @param position
     * @param value
     */
    var onPoissonNormalSlide = function (position, value) {
        if (poissonNormalDist !== undefined) {
            value = parseFloat(value);
            poissonNormalDist.update(value);
            poissonNormalChart.setAxisTitles(value);
            UtilsTLChart.setData(poissonNormalChart.getHighchart(), poissonNormalDist.getPrimaryData(), poissonNormalDist.getSecondaryData());
        }
    };

    /**
     * On 'T-Student - Normal' approximation parameters change
     *
     * @param position
     * @param value
     */
    var onStudentNormalSlide = function (position, value) {
        if (studentNormalDist !== undefined) {
            value = parseFloat(value);
            studentNormalDist.update(value);
            studentNormalChart.setAxisTitles(value);
            UtilsTLChart.setData(studentNormalChart.getHighchart(), studentNormalDist.getPrimaryData());
        }
    };

    /**
     * On 'Chi-Square - Normal' approximation parameters change
     *
     * @param position
     * @param value
     */
    var onChiNormalSlide = function (position, value) {
        if (chiNormalDist !== undefined) {
            value = parseFloat(value);
            chiNormalDist.update(value);
            chiNormalChart.setAxisTitles(value);
            UtilsTLChart.setData(chiNormalChart.getHighchart(), chiNormalDist.getPrimaryData(), chiNormalDist.getSecondaryData());
        }
    };

    /*************************** GUI *****************************************/

    var hyperBinomialA = new Slider("#tl_hb_a", onHyperBinomialSlide);
    var hyperBinomialB = new Slider("#tl_hb_b", onHyperBinomialSlide);
    var hyperBinomialN = new Slider("#tl_hb_n", onHyperBinomialSlide);
    var binomialPoissonN = new Slider("#tl_bp_n", onBinomialPoissonSlide);
    var binomialPoissonP = new Slider("#tl_bp_p", onBinomialPoissonSlide);
    var binomialNormalN = new Slider("#tl_bn_n", onBinomialNormalSlide);
    var binomialNormalP = new Slider("#tl_bn_p", onBinomialNormalSlide);
    var poissonNormalL = new Slider("#tl_pn_l", onPoissonNormalSlide);
    var studentNormalN = new Slider("#tl_sn_n", onStudentNormalSlide);
    var chiNormalN = new Slider("#tl_cn_n", onChiNormalSlide);

    var $slidersAllRows = $("div[id^='row_extras_tl_']");

    /**
     * Toogle distribution parameters sliders depending of selected approximation
     */
    var toogleSliders = function () {
        var dist = $distSelect.val();
        $slidersAllRows.hide();
        $("#row_extras_" + dist).show();
    };

    /**
     * Toogle simulation gui content depending of approximation selected
     */
    var toogleApproximationSelect = function () {
        var dist = $distSelect.val();
        switch (dist) {
            case "tl_aprox_hb":
                initHyperBinomial();
                break;
            case "tl_aprox_bp":
                initBinomialPoisson();
                break;
            case "tl_aprox_bn":
                initBinomialNormal();
                break;
            case "tl_aprox_pn":
                initPoissonNormal();
                break;
            case "tl_aprox_sn":
                initStudentNormal();
                break;
            case "tl_aprox_cn":
                initChiNormal();
                break;
        }
    };

    /**
     * Show or hide the grid chart
     */
    var toogleGridChart = function () {
        if (currentChart !== undefined) {
            UtilsChart.showGrid(currentChart.getHighchart(), $grid.is(':checked'));
        }
    };

    /******************************** INIT ****************************************/

    /**
     * Initialize the theorems limits gui on page load
     */
    var init = function () {
        toogleApproximationSelect();
        toogleSliders();
    };

    init(); // Auto init data

    /******************************** EVENTS ****************************************/

    /**
     * Logic to execute on approximation select change
     */
    $distSelect.on('change', function () {
        init();
    });

    /**
     * Logic to execute on grid checkbox change
     */
    $grid.on('change', function () {
        toogleGridChart();
    });
}

