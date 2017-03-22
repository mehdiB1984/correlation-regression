/*global ddProbability */

/**
 * Discretes distribution GUI handler class
 *
 * @constructor
 *
 * Created by Jose David Jurado Alonso <i22jualj@uco.es> on 07/15.
 */
function DistributionDiscreteGui() {

    var $distSelect = $("#dd_dist");
    var $funcSelect = $("#dd_func");

    var $chart = $("#dd_chart_container");
    var $grid = $("#dd_grid");
    var $limitsCheckbox = $("#dd_limits");

    var currentDist, currentChart;
    var hyperDist, hyperChart, $hyperError = $("#row_error_dd_dist_hyper");
    var binomialDist, binomialChart;
    var poissonDist, poissonChart;
    var geometricDist, geometricChart;
    var binomialNegativeDist, binomialNegativeChart;

    var $slidersAllRows = $("div[id^='row_extras_dd_']");
    var $resultAllRows = $("div[id^='row_result_dd_']");
    var $resultPText = $("#dd_result_dist_p_text");
    var $resultPValue = $("#dd_result_dist_p_value");
    var $resultFText = $("#dd_result_dist_f_text");
    var $resultFValue = $("#dd_result_dist_f_value");
    var $resultProbabilityText = $("#dd_result_dist_result_text");
    var $resultProbability = $("#dd_result_dist_result");

    /*************************** PROBABILITY ************************************************/

    /**
     * Update the probability values and charts of current distribution on 'distribution function' option
     */
    var updateProbabilityDistribution = function () {
        if (resultLower != undefined && resultUpper != undefined && currentDist != undefined && $funcSelect.val() === "dd_func_distribution") {
            var lowerValue = resultLower.getValue();
            var higherValue = resultUpper.getValue();
            var probabilityValues = currentDist.getProbabilityValues(lowerValue, higherValue);
            var lowerProbability = parseFloat(probabilityValues.lower);
            var higherProbability = parseFloat(probabilityValues.higher);
            var probability = higherProbability - lowerProbability;
            $resultProbabilityText.text("P(" + lowerValue.toFixed(2) + ' < X <= ' + higherValue.toFixed(2) + ") = ");
            $resultProbability.val(UtilsDCResult.round(probability));
            toogleLimitsPlot(lowerValue, higherValue, lowerProbability, higherProbability);
        }
    };

    /**
     * Update the probability values and charts of current distribution on 'probability function' option
     */
    var updateProbabilityProbability = function () {
        if (resultLower != undefined && resultUpper != undefined && currentDist != undefined && $funcSelect.val() === "dd_func_probability") {
            var x = resultX.getValue();
            var p = currentDist.getP(x);
            var f = currentDist.getF(x);
            $resultPText.text("P(X=" + x + ")");
            $resultPValue.val(UtilsDCResult.round(p));
            $resultFText.text("F(" + x + ")");
            $resultFValue.val(UtilsDCResult.round(f));
            UtilsDDChart.drawProbabilityPoint(currentChart.getHighchart(), x);
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
            ddProbability.drawProbability(currentChart.getHighchart(), xLower, xHigher, yLower, yHigher);
            UtilsDDChart.drawProbability(currentChart.getHighchart(), xLower, xHigher);
            var show = $limitsCheckbox.is(':checked');
            if (show) {
                ddProbability.updateLimits(currentChart.getHighchart(), xLower, xHigher, yLower, yHigher);
            } else {
                ddProbability.hideLimits(currentChart.getHighchart());
            }
        }
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

    /****************************** INIT DISTRIBUTIONS *************************************/

    /**
     * Initialize the hypergeometric distribution handler and chart
     */
    var initHyperDistribution = function () {
        if (hyperN !== undefined && hyperA !== undefined && hyperB !== undefined) {
            hyperDist = new DistHyper(hyperN.getValue(), hyperA.getValue(), hyperB.getValue(), hyperOX.getValue());
            currentDist = hyperDist;
            var dist = [], prob = [];
            if (validateHyperInput()) {
                var points = hyperDist.getPoints();
                dist = points.dist;
                prob = points.prob;
            }
            hyperChart = new DistHyperChart($chart, $grid.is(":checked"), hyperOX.getValue(), hyperOY.getValue(), dist, prob);
            currentChart = hyperChart;
            hyperChart.updateSubtitle(hyperDist.getN(), hyperDist.getA(), hyperDist.getB());
            updateLimitSliders(0, hyperOX.getValue(), 0.1);
            var max = hyperDist.getN() < hyperOX.getValue() ? hyperDist.getN() : hyperOX.getValue();
            updateProbabilitySlider(max);
        }
    };

    /**
     * Initialize the binomial distribution handler and chart
     */
    var initBinomialDistribution = function () {
        if (binomialP !== undefined && binomialN !== undefined) {
            binomialDist = new DistBinomial(binomialP.getValue(), binomialN.getValue(), binomialOX.getValue());
            currentDist = binomialDist;
            var points = binomialDist.getPoints();
            binomialChart = new DistBinomialChart($chart, $grid.is(":checked"), binomialOX.getValue(), binomialOY.getValue(), points.dist, points.prob);
            currentChart = binomialChart;
            binomialChart.updateSubtitle(binomialDist.getPValue(), binomialDist.getNValue());
            updateLimitSliders(0, binomialOX.getValue(), 0.1);
            var max = binomialDist.getNValue() < binomialOX.getValue() ? binomialDist.getNValue() : binomialOX.getValue();
            updateProbabilitySlider(max);
        }
    };

    /**
     * Initialize the poisson distribution handler and chart
     */
    var initPoissonDistribution = function () {
        if (poissonL !== undefined) {
            poissonDist = new DistPoisson(poissonL.getValue(), poissonOX.getValue());
            currentDist = poissonDist;
            var points = poissonDist.getPoints();
            poissonChart = new DistPoissonChart($chart, $grid.is(":checked"), poissonOX.getValue(), poissonOY.getValue(), points.dist, points.prob);
            currentChart = poissonChart;
            poissonChart.updateSubtitle(poissonDist.getLambda());
            updateLimitSliders(0, poissonOX.getValue(), 0.1);
            updateProbabilitySlider(poissonOX.getValue());
        }
    };

    /**
     *  Initialize the geometric distribution handler and chart
     */
    var initGeometricDistribution = function () {
        if (geoP !== undefined) {
            geometricDist = new DistGeometric(geoP.getValue(), geoOX.getValue());
            currentDist = geometricDist;
            var points = geometricDist.getPoints();
            geometricChart = new DistGeometricChart($chart, $grid.is(":checked"), geoOX.getValue(), geoOY.getValue(), points.dist, points.prob);
            currentChart = geometricChart;
            geometricChart.updateSubtitle(geometricDist.getPValue());
            updateLimitSliders(0, geoOX.getValue(), 0.1);
            updateProbabilitySlider(geoOX.getValue());
        }
    };

    /**
     *  Initialize the binomial negative distribution handler and chart
     */
    var initBinomialNegativeDistribution = function () {
        if (binomialNegativeP !== undefined && binomialNegativeK !== undefined) {
            binomialNegativeDist = new DistBinomialNegative(binomialNegativeP.getValue(), binomialNegativeK.getValue(), binomialNegativeOX.getValue());
            currentDist = binomialNegativeDist;
            var points = binomialNegativeDist.getPoints();
            binomialNegativeChart = new DistBinomialNegativeChart($chart, $grid.is(":checked"), binomialNegativeOX.getValue(), binomialNegativeOY.getValue(), points.dist, points.prob);
            currentChart = binomialNegativeChart;
            binomialNegativeChart.updateSubtitle(binomialNegativeDist.getPValue(), binomialNegativeDist.getKValue());
            updateLimitSliders(0, binomialNegativeOX.getValue(), 0.1);
            updateProbabilitySlider(binomialNegativeOX.getValue());
        }
    };

    /**
     * Validate the hypergeomtric parameters values combination
     *
     * @returns {*}
     */
    var validateHyperInput = function () {
        if (hyperDist !== undefined) {
            var valid = hyperDist.isValid();
            if (valid) {
                $hyperError.hide();
            } else {
                $hyperError.show();
            }
            return valid;
        }
        return false;
    };

    /******************************** SLIDERS ****************************************/

    /**
     * Update the probability slider range values
     *
     * @param max The max value
     */
    var updateProbabilitySlider = function (max) {
        if (resultX !== undefined) {
            resultX.updateValues(0, max, resultX.getValue(), 1);
            resultX.updateNumberStep(1);
        }
        updateProbabilityProbability();
    };

    /**
     * On hypergeometric distribution parameters change
     *
     * @param position
     * @param value
     */
    var onHyperSlide = function (position, value) {
        if (hyperDist !== undefined) {
            hyperDist.update(hyperN.getValue(), hyperA.getValue(), hyperB.getValue());
            if (validateHyperInput()) {
                var points = hyperDist.getPoints();
                UtilsDDChart.setData(hyperChart.getHighchart(), points.dist, points.prob);
                hyperChart.updateSubtitle(hyperDist.getN(), hyperDist.getA(), hyperDist.getB());
                var max = hyperDist.getN() < hyperOX.getValue() ? hyperDist.getN() : hyperOX.getValue();
                updateProbabilitySlider(max);
            }
        } else {
            initHyperDistribution();
        }
        updateProbabilityDistribution();
    };

    /**
     * On hypergeometric distribution axis range values change
     *
     * @param position
     * @param value
     */
    var onHyperAxisSlide = function (position, value) {
        if (hyperDist !== undefined) {
            initHyperDistribution();
            prepareChart();
        }
    };

    /**
     * On binomial distribution parameters change
     *
     * @param position
     * @param value
     */
    var onBinomialSlide = function (position, value) {
        if (binomialDist !== undefined) {
            binomialDist.update(binomialP.getValue(), binomialN.getValue());
            var points = binomialDist.getPoints();
            UtilsDDChart.setData(binomialChart.getHighchart(), points.dist, points.prob);
            binomialChart.updateSubtitle(binomialDist.getPValue(), binomialDist.getNValue());
            var max = binomialDist.getNValue() < binomialOX.getValue() ? binomialDist.getNValue() : binomialOX.getValue();
            updateProbabilitySlider(max);
        } else {
            initBinomialDistribution();
        }
        updateProbabilityDistribution();
    };

    /**
     * On binomial distribution axis range values change
     *
     * @param position
     * @param value
     */
    var onBinomialAxisSlide = function (position, value) {
        if (binomialDist !== undefined) {
            initBinomialDistribution();
            prepareChart();
        }
    };

    /**
     * On poisson distribution parameters change
     *
     * @param position
     * @param value
     */
    var onPoissonSlide = function (position, value) {
        if (poissonDist !== undefined) {
            poissonDist.update(poissonL.getValue());
            var points = poissonDist.getPoints();
            UtilsDDChart.setData(poissonChart.getHighchart(), points.dist, points.prob);
            poissonChart.updateSubtitle(poissonDist.getLambda());
            updateProbabilitySlider(poissonOX.getValue());
        } else {
            initPoissonDistribution();
        }
        updateProbabilityDistribution();
    };

    /**
     * On poisson distribution axis range values change
     *
     * @param position
     * @param value
     */
    var onPoissonAxisSlide = function (position, value) {
        if (poissonDist !== undefined) {
            initPoissonDistribution();
            prepareChart();
        }
    };

    /**
     * On geometric distribution parameters change
     *
     * @param position
     * @param value
     */
    var onGeoSlide = function (position, value) {
        if (geometricDist !== undefined) {
            geometricDist.update(geoP.getValue());
            var points = geometricDist.getPoints();
            UtilsDDChart.setData(geometricChart.getHighchart(), points.dist, points.prob);
            geometricChart.updateSubtitle(geometricDist.getPValue());
            updateProbabilitySlider(geoOX.getValue());
        } else {
            initGeometricDistribution();
        }
        updateProbabilityDistribution();
    };

    /**
     * On geometric distribution axis range values change
     *
     * @param position
     * @param value
     */
    var onGeoAxisSlide = function (position, value) {
        if (geometricDist !== undefined) {
            initGeometricDistribution();
            prepareChart();
        }
    };

    /**
     * On binomial negative distribution parameters change
     *
     * @param position
     * @param value
     */
    var onBinomialNegativeSlide = function (position, value) {
        if (binomialNegativeDist !== undefined) {
            binomialNegativeDist.update(binomialNegativeP.getValue(), binomialNegativeK.getValue());
            var points = binomialNegativeDist.getPoints();
            UtilsDDChart.setData(binomialNegativeChart.getHighchart(), points.dist, points.prob);
            binomialNegativeChart.updateSubtitle(binomialNegativeDist.getPValue(), binomialNegativeDist.getKValue());
            updateProbabilitySlider(binomialNegativeOX.getValue());
        } else {
            initBinomialNegativeDistribution();
        }
        updateProbabilityDistribution();
    };

    /**
     * On binomial negative distribution axis range values change
     *
     * @param position
     * @param value
     */
    var onBinomialNegativeAxisSlide = function (position, value) {
        if (binomialNegativeDist !== undefined) {
            initBinomialNegativeDistribution();
            prepareChart();
        }
    };

    /**
     * On probability lower slider value change
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
     * On probability upper slider value change
     *
     * @param position
     * @param value
     */
    var onResultUpperSlide = function (position, value) {
        if (resultLower !== undefined) {
            var lowerValue = parseFloat(resultLower.$slider.val());
            if (lowerValue > value) {
                lowerValue = value;
                resultLower.updateNoFire(lowerValue);
            }
            updateProbabilityDistribution();
        }
    };

    /**
     * On probability X slider value change
     *
     * @param position
     * @param value
     */
    var onResultXSlide = function (position, value) {
        updateProbabilityProbability();
    };

    /*************************** GUI *****************************************/

    var hyperN = new Slider("#dd_hyper_n", onHyperSlide);
    var hyperA = new Slider("#dd_hyper_a", onHyperSlide);
    var hyperB = new Slider("#dd_hyper_b", onHyperSlide);
    var hyperOX = new Slider("#dd_hyper_ox", onHyperAxisSlide);
    var hyperOY = new Slider("#dd_hyper_oy", onHyperAxisSlide);
    var binomialP = new Slider("#dd_binomial_p", onBinomialSlide);
    var binomialN = new Slider("#dd_binomial_n", onBinomialSlide);
    var binomialOX = new Slider("#dd_binomial_ox", onBinomialAxisSlide);
    var binomialOY = new Slider("#dd_binomial_oy", onBinomialAxisSlide);
    var poissonL = new Slider("#dd_poisson_l", onPoissonSlide);
    var poissonOX = new Slider("#dd_poisson_ox", onPoissonAxisSlide);
    var poissonOY = new Slider("#dd_poisson_oy", onPoissonAxisSlide);
    var geoP = new Slider("#dd_geo_p", onGeoSlide);
    var geoOX = new Slider("#dd_geo_ox", onGeoAxisSlide);
    var geoOY = new Slider("#dd_geo_oy", onGeoAxisSlide);
    var binomialNegativeP = new Slider("#dd_negative_p", onBinomialNegativeSlide);
    var binomialNegativeK = new Slider("#dd_negative_k", onBinomialNegativeSlide);
    var binomialNegativeOX = new Slider("#dd_negative_ox", onBinomialNegativeAxisSlide);
    var binomialNegativeOY = new Slider("#dd_negative_oy", onBinomialNegativeAxisSlide);
    var resultLower = new Slider("#dd_result_dist_lower", onResultLowerSlide);
    var resultUpper = new Slider("#dd_result_dist_upper", onResultUpperSlide);
    var resultX = new Slider("#dd_result_dist_x", onResultXSlide);

    /**
     * Toogle distribution parameters sliders depending of selected distribution
     */
    var toogleSliders = function () {
        var dist = $distSelect.val();
        $slidersAllRows.hide();
        $("#row_extras_" + dist).show();
    };

    /**
     * Toogle de result / operations row depending of selected function
     */
    var toogleResultRow = function () {
        var func = $funcSelect.val();
        $resultAllRows.hide();
        $("#row_result_" + func).show();
    };

    /**
     * Toogle simulation gui content depending of distribution selected
     */
    var toogleDistSelect = function () {
        $hyperError.hide();
        var dist = $distSelect.val();
        switch (dist) {
            case "dd_dist_hyper":
                initHyperDistribution();
                break;
            case "dd_dist_binomial":
                initBinomialDistribution();
                break;
            case "dd_dist_poisson":
                initPoissonDistribution();
                break;
            case "dd_dist_geo":
                initGeometricDistribution();
                break;
            case "dd_dist_negative":
                initBinomialNegativeDistribution();
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

    /**
     * Prepare simulation gui and chart depending of selected function (distribution or probability)
     */
    var prepareChart = function () {
        if (currentChart !== undefined && currentDist !== undefined) {
            var func = $funcSelect.val();
            if (func === "dd_func_distribution") {
                UtilsDDChart.setChartViewMode(currentChart.getHighchart(), false);
                $limitsCheckbox.parent().show();
                ddProbability.setSerieVisible(true);
                updateProbabilityDistribution();
            } else {
                UtilsDDChart.setChartViewMode(currentChart.getHighchart(), true);
                $limitsCheckbox.parent().hide();
                ddProbability.setSerieVisible(false);
                ddProbability.hideLimits(currentChart.getHighchart());
                currentDist.resetPoints();
                var points = currentDist.getPoints();
                UtilsDDChart.setData(currentChart.getHighchart(), points.dist, points.prob);
                updateProbabilityProbability();
            }
        }
    };

    /******************************** INIT ****************************************/

    /**
     * Initialize the discrete distributions gui on page load
     */
    var init = function () {
        toogleDistSelect();
        toogleSliders();
        prepareChart();
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
        prepareChart();
        toogleResultRow();
    });

    /**
     * Logic to execute on grid checkbox change
     */
    $grid.on('change', function () {
        toogleGridChart();
    });

    /**
     * Logic to execute on probability limits lines checkbox change
     */
    $limitsCheckbox.on('change', function () {
        updateProbabilityDistribution();
    });

}

