/*global dcProbability */

/**
 * Continuous distribution GUI handler class
 *
 * @constructor
 *
 * Created by Jose David Jurado Alonso <i22jualj@uco.es> on 07/15.
 */
function DistributionContinuousGui() {

    var normalTypified = new DistNormal(0, 1, -20, 20, UtilsChart.POINTS);
    var normal, normalChart;
    var student, studentChart;
    var chi, chiChart;
    var snedecor, snedecorChart;
    var gamma, gammaChart;
    var expo, expoChart;
    var beta, betaChart;

    var $distSelect = $("#dc_dist");
    var $funcSelect = $("#dc_func");
    //var $funcTypification = $funcSelect.find("option[value = dc_func_typification]");
    var $normalCheckbox = $("#dc_normal");
    var $gridCheckbox = $("#dc_grid");
    var $limitsCheckbox = $("#dc_limits");
    var $chartContainer = $("#dc_chart_container");

    var $slidersAllRows = $("div[id^='row_extras_dc_']");
    var $resultAllRows = $("div[id^='row_result_dc_']");
    var $resultProbability = $("#dc_result_dist_probability");
    var $resultCuantil1 = $("#dc_result_one");
    var $resultCuantil2 = $("#dc_result_two");
    var $resultProb3 = $("#dc_result_three");

    var $inputQuantile = $("#dc_input_quantile");
    var $inputProbability = $("#dc_input_probability");
    var $inputRadio = $("input[type=radio][name=dc_input]");
    var $calculateRadio = $("input[type=radio][name=dc_calculate]");
    var $queueLeft = $("#dc_calculate_queue_left");
    var $queueRight = $("#dc_calculate_queue_right");
    var $queueBoth = $("#dc_calculate_queue_both");


    var currentChart, currentDist;

    /******************************************* VIEW FUNCTIONS ************************************************/

    /**
     * Prepare the simulation gui to show and density chart and its extras components
     */
    var prepareChartToDensity = function () {
        if (currentChart !== undefined) {
            UtilsDCChart.setChartViewMode(currentChart.getHighchart(), true);
            $limitsCheckbox.parent().hide();
            dcProbability.setSerieVisible(false);
            dcProbability.hideLimits(currentChart.getHighchart());
            UtilsDCChart.setAreaDataByRange(currentChart.getHighchart(), []);
            //updateProbability();
        }
    };

    /**
     * Prepare the simulation gui to show and distribution chart and its extras components
     */
    var prepareChartToDistribution = function () {
        if (currentChart !== undefined) {
            UtilsDCChart.setChartViewMode(currentChart.getHighchart(), false);
            $limitsCheckbox.parent().show();
            dcProbability.setSerieVisible(true);
            updateProbabilityDistribution();
        }
    };

    /**
     * Hide the "Normal" checkbox
     */
    var hideNormalCheck = function () {
        $normalCheckbox.attr("checked", false);
        $normalCheckbox.parent().hide();
    };

    /**
     * Show the "Normal" checkbox
     */
    var showNormalCheck = function () {
        $normalCheckbox.parent().show();
    };

    /**
     * Update the probability limits slider values
     *
     * @param min The min value
     * @param max The max value
     * @param increment The increment interval
     */
    var updateLimitSliders = function (min, max, increment /*points*/) {
        if (resultLower !== undefined) {
            resultLower.updateValues(min, max, min, increment);
        }

        if (resultUpper !== undefined) {
            resultUpper.updateValues(min, max, max, increment);
        }
        updateProbabilityDistribution();
    };

    /**
     * Calculate the quuantile and probability values
     */
    var calculateCuantilProbability = function () {
        if (currentChart !== undefined && currentDist !== undefined && $funcSelect.val() === "dc_func_density") {
            var value = valueInputNumber.getValue();
            var chart = currentChart.getHighchart();
            if ($inputQuantile.is(":checked")) { // Quantile input
                if ($queueLeft.is(":checked")) {
                    UtilsDCResult.calculateProbabilityLeft(chart, currentDist, value, $resultProb3);
                } else if ($queueRight.is(":checked")) {
                    UtilsDCResult.calculateProbabilityRight(chart, currentDist, value, $resultProb3);
                } else {
                    UtilsDCResult.calculateProbabilityBoth(chart, currentDist, value, $resultCuantil1, $resultCuantil2, $resultProb3);
                }
            } else { // Probability input
                if ($queueLeft.is(":checked")) {
                    UtilsDCResult.calculateQuantileLeft(chart, currentDist, value, $resultCuantil1);
                } else if ($queueRight.is(":checked")) {
                    UtilsDCResult.calculateQuantileRight(chart, currentDist, value, $resultCuantil1);
                } else {
                    UtilsDCResult.calculateQuantileBoth(chart, currentDist, value, $resultCuantil1, $resultCuantil2, $resultProb3);
                }
            }
        }
    };

    /**
     * Toogle simulation gui content depending of distribution selected
     */
    var toogleDistSelect = function () {
        var dist = $distSelect.val();
        switch (dist) {
            case "dc_dist_normal":
                initNormalDistribution();
                break;
            case "dc_dist_student":
                initStudentDistribution();
                break;
            case "dc_dist_chi":
                initChiDistribution();
                break;
            case "dc_dist_snedecor":
                initSnedecorDistribution();
                break;
            case "dc_dist_gamma":
                initGammaDistribution();
                break;
            case "dc_dist_exponential":
                initExponentialDistribution();
                break;
            case "dc_dist_beta":
                initBetaDistribution();
                break;
            default:
        }
    };

    /**
     * Toogle simulation gui content depending of selected function
     */
    var toogleFunctSelect = function () {
        var func = $funcSelect.val();
        if (func === "dc_func_distribution") {
            prepareChartToDistribution();
        } else {
            prepareChartToDensity();
        }
    };

    var toogleNormalCheck = function () {
        hideNormalCheck();
    };

    /**
     * Toogle distribution parameters sliders depending of selected distribution
     */
    var toogleSliders = function () {
        var dist = $distSelect.val();
        $slidersAllRows.hide();
        $("#row_extras_" + dist).show();
    };

    /**
     * Prepare the operations and results gui depending of selected options (quantile/probability)
     */
    var prepareDensityResultGui = function () {
        if ($queueBoth.is(":checked")) {
            $resultCuantil1.parent().show();
            $resultCuantil2.parent().show();
            $resultProb3.parent().show();
        } else {
            if ($inputQuantile.is(":checked")) {
                $resultCuantil1.parent().hide();
                $resultCuantil2.parent().hide();
                $resultProb3.parent().show();
            } else if ($inputProbability.is(":checked")) {
                $resultCuantil1.parent().show();
                $resultCuantil2.parent().hide();
                $resultProb3.parent().hide();
            }
        }
    };

    /**
     * Prepare the density operations input value depending of selected distribution
     */
    var prepareDensityValueInput = function () {
        var min = 0.01, max = 0.99; // Default to probability
        if ($inputQuantile.is(":checked")) {
            var dist = $distSelect.val();
            switch (dist) {
                case "dc_dist_normal":
                    min = -20;
                    max = 20;
                    break;
                case "dc_dist_student":
                    min = -10;
                    max = 10;
                    break;
                case "dc_dist_chi":
                    min = 0;
                    max = 80;
                    break;
                case "dc_dist_snedecor":
                    min = 0;
                    max = 10;
                    break;
                case "dc_dist_gamma":
                    min = 0;
                    max = 100;
                    break;
                case "dc_dist_exponential":
                    min = 0;
                    max = 40;
                    break;
                case "dc_dist_beta":
                    min = 0;
                    max = 1;
                    break;
            }
        }
        valueInputNumber.update(min, max, min);
    };

    /**
     * Prepare result / operations row on density function
     */
    var prepareDensityResult = function () {
        var func = $funcSelect.val();
        if (func === "dc_func_density") {
            prepareDensityResultGui();
            prepareDensityValueInput();
        }
    };

    /**
     * Toogle de result / operations row depending of selected function
     */
    var toogleResultRow = function () {
        var func = $funcSelect.val();
        $resultAllRows.hide();
        $("#row_result_" + func).show();
        prepareDensityResult();
        calculateCuantilProbability();
    };

    /**
     * Show or hide the grid chart
     */
    var toogleGridChart = function () {
        if (currentChart !== undefined) {
            UtilsChart.showGrid(currentChart.getHighchart(), $gridCheckbox.is(':checked'));
        }
    };

    /**
     * Show or hide the vertical lines which delimit the probability range
     *
     * @param xLower The x axis value of lower probability limit
     * @param xHigher The x axis value of higher probability limit
     * @param yLower The y axis value of lower probability limit
     * @param yHigher The y axis value of higher probability limit
     */
    var toogleLimitsPlot = function (xLower, xHigher, yLower, yHigher) {
        if (currentChart !== undefined) {
            var show = $limitsCheckbox.is(':checked');
            if (show) {
                dcProbability.updateLimits(currentChart.getHighchart(), xLower, xHigher, yLower, yHigher);
            } else {
                dcProbability.hideLimits(currentChart.getHighchart());
            }
            dcProbability.drawProbability(currentChart.getHighchart(), xLower, xHigher, yLower, yHigher);
        }
    };

    /******************************************* INIT DISTRIBUTIONS  ************************************************/

    /**
     * Initialize the normal distribution handler and chart
     */
    var initNormalDistribution = function () {
        if (normalAverage !== undefined && normalDeviation !== undefined) {
            var average = normalAverage.getValue(), deviation = normalDeviation.getValue();
            normal = new DistNormal(average, deviation, -20, 20, UtilsChart.POINTS);
            currentDist = normal;
            var points = normal.getPoints();
            normalChart = new DistNormalChart($chartContainer, $gridCheckbox.is(':checked'), points.dist, points.density, normalTypified.getPoints().density);
            normalChart.updateSubtitle(normal.getAverage(), normal.getSigma());
            currentChart = normalChart;
            updateLimitSliders(-20, 20, 0.1);
        }
    };

    /**
     * Initialize the T-Student distribution handler and chart
     */
    var initStudentDistribution = function () {
        if (studentGrades !== undefined) {
            student = new DistStudent(studentGrades.getValue(), -10, 10, UtilsChart.POINTS);
            currentDist = student;
            var points = student.getPoints();
            studentChart = new DistStudentChart($chartContainer, $gridCheckbox.is(':checked'), points.dist, points.density, normalTypified.getPoints().density);
            studentChart.updateSubtitle(student.getGrades());
            currentChart = studentChart;
            updateLimitSliders(-10, 10, 0.1);
        }
    };

    /**
     * Initialize the Chi-Square distribution handler and chart
     */
    var initChiDistribution = function () {
        if (chiGrades !== undefined) {
            chi = new DistChi(chiGrades.getValue(), 0, 80, UtilsChart.POINTS);
            currentDist = chi;
            var points = chi.getPoints();
            chiChart = new DistChiChart($chartContainer, $gridCheckbox.is(':checked'), points.dist, points.density);
            chiChart.updateSubtitle(chi.getGrades());
            currentChart = chiChart;
            updateLimitSliders(0, 80, 0.1);
        }
    };

    /**
     * Get the F-Snedecor size
     *
     * @returns {number}
     */
    function getSnedecorSize() {
        if (snedecorNormal1 !== undefined) {
            if (snedecorNormal1.getValue() < 2) {
                return SnedecorSize.HIGH;
            } else if (snedecorNormal1.getValue() > 11 && snedecorNormal2.getValue() > 16) {
                return SnedecorSize.MEDIUM;
            }
        }
        return SnedecorSize.NORMAL;
    }

    /**
     * Initialize the F-Snedecor distribution handler and chart
     */
    var initSnedecorDistribution = function () {
        if (snedecorNormal1 !== undefined && snedecorNormal2 !== undefined) {
            snedecor = new DistSnedecor(snedecorNormal1.getValue(), snedecorNormal2.getValue(), UtilsChart.POINTS);
            currentDist = snedecor;
            var points = snedecor.getPoints();
            var size = getSnedecorSize();
            snedecorChart = new DistSnedecorChart($chartContainer, $gridCheckbox.is(':checked'), points.dist, points.density, size);
            snedecorChart.updateSubtitle(snedecor.getN1(), snedecor.getN2());
            currentChart = snedecorChart;
            updateLimitSliders(0, 10, 0.1);
        }
    };

    /**
     * Initialize the gamma distribution handler and chart
     */
    var initGammaDistribution = function () {
        if (gammaK !== undefined && gammaB !== undefined) {
            gamma = new DistGamma(gammaK.getValue(), gammaB.getValue(), 0, 100, UtilsChart.POINTS);
            currentDist = gamma;
            var points = gamma.getPoints();
            gammaChart = new DistGammaChart($chartContainer, $gridCheckbox.is(':checked'), points.dist, points.density, false, false);
            gammaChart.updateSubtitle(gamma.getK(), gamma.getB());
            currentChart = gammaChart;
            updateLimitSliders(0, 100, 0.1);
        }
    };

    /**
     * Initialize the exponential distribution handler and chart
     */
    var initExponentialDistribution = function () {
        if (exponentialA !== undefined) {
            expo = new DistGamma(1.0, exponentialA.getValue(), 0, 40, UtilsChart.POINTS);
            currentDist = expo;
            var points = expo.getPoints();
            var isBig = exponentialA.getValue() < 1;
            expoChart = new DistGammaChart($chartContainer, $gridCheckbox.is(':checked'), points.dist, points.density, true, isBig);
            expoChart.updateSubtitleExpo(expo.getB());
            currentChart = expoChart;
            updateLimitSliders(0, 40, 0.1);
        }
    };

    /**
     * Initialize the beta distribution handler and chart
     */
    var initBetaDistribution = function () {
        if (betaA !== undefined && betaB !== undefined) {
            beta = new DistBeta(betaA.getValue(), betaB.getValue(), 0, 1.2, UtilsChart.POINTS);
            currentDist = beta;
            var points = beta.getPoints();
            betaChart = new DistBetaChart($chartContainer, $gridCheckbox.is(':checked'), points.dist, points.density);
            betaChart.updateSubtitle(beta.getA(), beta.getB());
            currentChart = betaChart;
            updateLimitSliders(0, 1, 0.1);
        }
    };

    /**
     * Update the probability value and graphical components
     */
    var updateProbabilityDistribution = function () {
        if (resultLower != undefined && resultUpper != undefined && currentDist != undefined && $funcSelect.val() === "dc_func_distribution") {
            var lowerValue = resultLower.getValue();
            var higherValue = resultUpper.getValue();
            var lowerProbability = parseFloat(currentDist.getDistribution().CDF(lowerValue).toFixed(5));
            var higherProbability = parseFloat(currentDist.getDistribution().CDF(higherValue).toFixed(5));
            var probability = higherProbability - lowerProbability;
            UtilsDCChart.setAreaDataByRange(currentChart.getHighchart(), currentDist.getAreaPoints(lowerValue, higherValue));
            $resultProbability.val(probability);
            toogleLimitsPlot(lowerValue, higherValue, lowerProbability, higherProbability);
        }
    };

    /******************************************* SLIDER  ************************************************/

    /**
     * On normal distribution average parameter change
     *
     * @param position
     * @param value
     */
    var onNormalAverageSlide = function (position, value) {
        if (normal !== undefined) {
            normal.setAverage(value);
            var points = normal.getPoints();
            UtilsDCChart.setData(normalChart.getHighchart(), points.dist, points.density);
            normalChart.updateSubtitle(normal.getAverage(), normal.getSigma());
        } else {
            initNormalDistribution();
        }
        updateProbabilityDistribution();
        calculateCuantilProbability();
    };

    /**
     * On normal distribution deviation / sigma parameter change
     *
     * @param position
     * @param value
     */
    var onNormalDeviationSlide = function (position, value) {
        if (normal !== undefined) {
            normal.setDeviation(value);
            var points = normal.getPoints();
            UtilsDCChart.setData(normalChart.getHighchart(), points.dist, points.density);
            normalChart.updateSubtitle(normal.getAverage(), normal.getSigma());
        } else {
            initNormalDistribution();
        }
        updateProbabilityDistribution();
        calculateCuantilProbability();
    };

    /**
     * On T-Student distribution grade parameter change
     *
     * @param position
     * @param value
     */
    var onStudentGradeSlide = function (position, value) {
        if (student !== undefined) {
            student.setGrades(value);
            var points = student.getPoints();
            UtilsDCChart.setData(studentChart.getHighchart(), points.dist, points.density);
            studentChart.updateSubtitle(student.getGrades());
        } else {
            initStudentDistribution();
        }
        updateProbabilityDistribution();
        calculateCuantilProbability();
    };

    /**
     * On Chi-Square distribution grade parameter change
     *
     * @param position
     * @param value
     */
    var onChiGradeSlide = function (position, value) {
        if (chi !== undefined) {
            chi.setGrades(value);
            var points = chi.getPoints();
            UtilsDCChart.setData(chiChart.getHighchart(), points.dist, points.density);
            chiChart.updateSubtitle(chi.getGrades());
        } else {
            initChiDistribution(); // NOTE Upgrade not work properly
        }
        updateProbabilityDistribution();
        calculateCuantilProbability();
    };

    /**
     * On F-Snedecor distribution n1 parameter change
     *
     * @param position
     * @param value
     */
    var onSnedecor1Slide = function (position, value) {
        if (snedecor !== undefined) {
            var size = getSnedecorSize();
            if (size !== snedecorChart.getSize()) {
                initSnedecorDistribution();
                toogleFunctSelect();
            } else {
                snedecor.setN1(value);
                var points = snedecor.getPoints();
                UtilsDCChart.setData(snedecorChart.getHighchart(), points.dist, points.density);
                snedecorChart.updateSubtitle(snedecor.getN1(), snedecor.getN2());
            }
        } else {
            initSnedecorDistribution();
        }
        updateProbabilityDistribution();
        calculateCuantilProbability();
    };

    /**
     * On F-Snedecor distribution n2 parameter change
     *
     * @param position
     * @param value
     */
    var onSnedecor2Slide = function (position, value) {
        if (snedecor !== undefined) {
            var size = getSnedecorSize();
            if (size !== snedecorChart.getSize()) {
                initSnedecorDistribution();
                toogleFunctSelect();
            } else {
                snedecor.setN2(value);
                var points = snedecor.getPoints();
                UtilsDCChart.setData(snedecorChart.getHighchart(), points.dist, points.density);
                snedecorChart.updateSubtitle(snedecor.getN1(), snedecor.getN2());
            }
        } else {
            initSnedecorDistribution();
        }
        updateProbabilityDistribution();
        calculateCuantilProbability();
    };

    /**
     * On Gamma distribution k parameter change
     *
     * @param position
     * @param value
     */
    var onGammaKSlide = function (position, value) {
        if (gamma !== undefined) {
            gamma.setK(value);
            var points = gamma.getPoints();
            UtilsDCChart.setData(gammaChart.getHighchart(), points.dist, points.density);
            gammaChart.updateSubtitle(gamma.getK(), gamma.getB());
        } else {
            initGammaDistribution();
        }
        updateProbabilityDistribution();
        calculateCuantilProbability();
    };

    /**
     * On Gamma distribution b parameter change
     *
     * @param position
     * @param value
     */
    var onGammaBSlide = function (position, value) {
        if (gamma !== undefined) {
            gamma.setB(value);
            var points = gamma.getPoints();
            UtilsDCChart.setData(gammaChart.getHighchart(), points.dist, points.density);
            gammaChart.updateSubtitle(gamma.getK(), gamma.getB());
        } else {
            initGammaDistribution();
        }
        updateProbabilityDistribution();
        calculateCuantilProbability();
    };

    /**
     * On exponential distribution a parameter change
     *
     * @param position
     * @param value
     */
    var onExponentialASlide = function (position, value) {
        if (expo !== undefined) {
            expo.setB(value);
            var points = expo.getPoints();
            UtilsDCChart.setData(expoChart.getHighchart(), points.dist, points.density);
            expoChart.updateSubtitle(expo.getK(), expo.getB());
        } else {
            initExponentialDistribution();
        }
        updateProbabilityDistribution();
        calculateCuantilProbability();
    };

    /**
     * On Beta distribution a parameter change
     *
     * @param position
     * @param value
     */
    var onBetaASlide = function (position, value) {
        if (beta !== undefined) {
            beta.setA(value);
            var points = beta.getPoints();
            UtilsDCChart.setData(betaChart.getHighchart(), points.dist, points.density);
            betaChart.updateSubtitle(beta.getA(), beta.getB());
        } else {
            initBetaDistribution();
        }
        updateProbabilityDistribution();
        calculateCuantilProbability();
    };

    /**
     * On Beta distribution b parameter change
     *
     * @param position
     * @param value
     */
    var onBetaBSlide = function (position, value) {
        if (beta !== undefined) {
            beta.setB(value);
            var points = beta.getPoints();
            UtilsDCChart.setData(betaChart.getHighchart(), points.dist, points.density);
            betaChart.updateSubtitle(beta.getA(), beta.getB());
        } else {
            initBetaDistribution();
        }
        updateProbabilityDistribution();
        calculateCuantilProbability();
    };

    /**
     * On probability lower limit value change
     *
     * @param position
     * @param value
     */
    var onResultLowerSlide = function (position, value) {
        if (resultUpper !== undefined) {
            var upperValue = parseFloat(resultUpper.$slider.val());
            if (upperValue < value) {
                upperValue = value;
                resultUpper.updateNoFire(upperValue);
            }
            updateProbabilityDistribution();
        }
    };

    /**
     * On probability upper limit value change
     *
     * @param position
     * @param value
     */
    var onResultUpperSlide = function (position, value) {
        if (resultLower !== undefined) {
            var lowerValue = parseFloat(resultLower.$slider.val());
            if (lowerValue > value) {
                lowerValue = value
                resultLower.updateNoFire(lowerValue);
            }
            updateProbabilityDistribution();
        }
    };

    var normalAverage = new Slider("#dc_normal_average", onNormalAverageSlide);
    var normalDeviation = new Slider("#dc_normal_deviation", onNormalDeviationSlide);
    var studentGrades = new Slider("#dc_student_grades", onStudentGradeSlide);
    var chiGrades = new Slider("#dc_chi_grades", onChiGradeSlide);
    var snedecorNormal1 = new Slider("#dc_snedecor_n1", onSnedecor1Slide);
    var snedecorNormal2 = new Slider("#dc_snedecor_n2", onSnedecor2Slide);
    var gammaK = new Slider("#dc_gamma_k", onGammaKSlide);
    var gammaB = new Slider("#dc_gamma_b", onGammaBSlide);
    var exponentialA = new Slider("#dc_exponential_a", onExponentialASlide);
    var betaA = new Slider("#dc_beta_a", onBetaASlide);
    var betaB = new Slider("#dc_beta_b", onBetaBSlide);
    var resultLower = new Slider("#dc_result_dist_lower", onResultLowerSlide);
    var resultUpper = new Slider("#dc_result_dist_upper", onResultUpperSlide);
    var valueInputNumber = new InputNumber("#dc_input_value", calculateCuantilProbability);

    /******************************** INIT ****************************************/

    /**
     * Initialize the continuous distributions gui on page load
     */
    var init = function () {
        toogleNormalCheck();
        toogleSliders();
        toogleDistSelect();
        toogleFunctSelect();
        toogleResultRow();

    };

    init(); // Auto init data

    /******************************** EVENTS ****************************************/

    /**
     * Logic to execute on distribution select change
     */
    $distSelect.on('change', function () {
        init();
    });

    /**
     * Logic to execute on function select change
     */
    $funcSelect.on('change', function () {
        toogleFunctSelect();
        toogleNormalCheck();
        toogleResultRow();
    });

    /**
     * Logic to execute on normal checkbox change
     */
    $normalCheckbox.on('change', function () {
        var $this = $(this);
        var checked = $this.is(":checked");
    });

    /**
     * Logic to execute on grid checkbox change
     */
    $gridCheckbox.on('change', function () {
        toogleGridChart();
    });

    /**
     * Logic to execute on probability limits lines checkbox change
     */
    $limitsCheckbox.on('change', function () {
        updateProbabilityDistribution();
    });

    /**
     * Logic to execute on input radio (quantile/probability) (from result) change
     */
    $inputRadio.on('change', function () {
        prepareDensityResult();
        calculateCuantilProbability();
    });

    /**
     * Logic to execute on calculate radio (from result) change
     */
    $calculateRadio.on('change', function () {
        prepareDensityResultGui();
        calculateCuantilProbability();
    });
}

