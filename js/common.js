/**
 * Common utilities class
 *
 * Created by Jose David Jurado Alonso <i22jualj@uco.es> on 07/15
 */

// Define a custom symbol path to step charts
Highcharts.SVGRenderer.prototype.symbols.step_line = function (x, y, w, h) {
    return ['M', x - w, y + h / 2, 'L', x + w * 2, y + h / 2, 'z'];
};

Highcharts.SVGRenderer.prototype.symbols.step_line_collapsed = function (x, y, w, h) {
    return ['M', x + 2, y + h / 2, 'L', x + 2 + w * 2, y + h / 2, 'z'];
};

if (Highcharts.VMLRenderer) {
    Highcharts.VMLRenderer.prototype.symbols.cross = Highcharts.SVGRenderer.prototype.symbols.cross;
}

/**
 * Basic chart utilities
 *
 * @type {{POINTS: number, subtitleConfig: {floating: boolean, align: string, verticalAlign: string, y: number, x: number, style: {fontWeight: string}}, getIncrement: Function, getXAxisPoints: Function, showGrid: Function}}
 */
var UtilsChart = {
    POINTS: 300,

    subtitleConfig: {
        floating: true,
        align: "left",
        verticalAlign: 'top',
        y: 16,
        x: 60,
        style: {
            fontWeight: 'bold'
        }
    },

    /**
     * Get the increment of range depending of size (total points)
     *
     * @param start The start of range
     * @param end The end of range
     * @param size  The size or total points
     * @returns {number}
     */
    getIncrement: function (start, end, size) {
        var increment = parseFloat(((end - start) / (size - 1)).toFixed(3));
        return increment < 0.003 ? 0.003 : increment; // Fix short intervals when increment is similar to 0
    },

    /**
     * Calculate and return the X axis points of range
     *
     * @param startValue The start of range
     * @param endValue The end of range
     * @param totalPoints The total points
     * @returns {Array}
     */
    getXAxisPoints: function (startValue, endValue, totalPoints) {
        var start = parseFloat(startValue), end = parseFloat(endValue), size = parseInt(totalPoints);
        var position = start;
        var increment = this.getIncrement(start, end, size);
        var points = [];
        for (var i = 0; i < size; i++) {
            if (position > end) {
                position = end;
            }
            points[i] = parseFloat(position.toFixed(3));
            position += increment;
        }
        return points;
    },

    /**
     * Show or hide the grid into the chart
     *
     * @param chart The highchart
     * @param show If the grid must be show or not
     */
    showGrid: function (chart, show) {
        var value = show ? 1 : 0;
        chart.xAxis[0].update({
            gridLineWidth: value
        });

        for (var i = 0, size = chart.yAxis.length; i < size; i++) {
            chart.yAxis[i].update({
                gridLineWidth: value
            });
        }
    }
};

/**
 * Theorems limits chart utilities
 * @type {{ID_SERIE_PRIMARY_1: string, ID_SERIE_PRIMARY_2: string, ID_SERIE_SECONDARY_1: string, ID_SERIE_SECONDARY_2: string, COLOR_PRIMARY: string, COLOR_SECONDARY: string, COLOR_PRIMARY_BLACK: string, COLOR_SECONDARY_BLACK: string, getYAxisPrimary: Function, getYAxisSecondary: Function, getPrimaryScatterDist: Function, getPrimaryColumnProb: Function, getSecondaryScatterDist: Function, getSecondaryColumnProb: Function, getPrimaryLineDist: Function, getPrimaryLineProb: Function, getSecondaryLineDist: Function, getSecondaryLineProb: Function, setData: Function}}
 */
var UtilsTLChart = {
    ID_SERIE_PRIMARY_1: "tl-serie-primary-1",
    ID_SERIE_PRIMARY_2: "tl-serie-primary-2",
    ID_SERIE_SECONDARY_1: "tl-serie-secondary-1",
    ID_SERIE_SECONDARY_2: "tl-serie-secondary-2",

    COLOR_PRIMARY: "#B80000",
    COLOR_SECONDARY: "#6593BF",
    COLOR_PRIMARY_BLACK: "#670000",
    COLOR_SECONDARY_BLACK: "#415E7A",

    /**
     * Get Y Axis of primary chart configuration
     *
     * @param grid If the grid must be show or not
     * @returns {{min: number, max: number, tickInterval: number, title: {text: string, style: {color: string}}, gridLineWidth: number}}
     */
    getYAxisPrimary: function (grid) {
        return {
            min: 0,
            max: 1,
            tickInterval: 0.1,
            title: {
                text: '',
                style: {
                    color: this.COLOR_PRIMARY
                }
            },
            gridLineWidth: grid ? 1 : 0
        };
    },

    /**
     * Get Y Axis of secondary chart configuration
     *
     * @param grid If the grid must be show or not
     * @returns {{min: number, max: number, tickInterval: number, title: {text: string, style: {color: string}}, gridLineWidth: number, opposite: boolean}}
     */
    getYAxisSecondary: function (grid) {
        return {
            min: 0,
            max: 1,
            tickInterval: 0.1,
            title: {
                text: '',
                style: {
                    color: this.COLOR_SECONDARY
                }
            },
            gridLineWidth: grid ? 1 : 0,
            opposite: true
        };
    },

    /**
     * Get the primary distribution scatter type chart serie
     *
     * @param data The chart data
     * @returns {{type: string, data: *, zIndex: number, name: *, marker: {enabled: boolean, symbol: string, lineColor: string, lineWidth: number}}}
     */
    getPrimaryScatterDist: function (data) {
        return {
            type: 'scatter',
            data: data,
            zIndex: 1,
            name: Texts.decodeURIComponent("tl.charts.func.dist"),
            marker: {
                enabled: true,
                symbol: 'step_line_collapsed',
                lineColor: this.COLOR_PRIMARY,
                lineWidth: 2
            }
        };
    },

    /**
     * Get the primary probability column type chart serie
     *
     * @param data The chart data
     * @returns {{type: string, name: *, data: *, color: string, pointPadding: number}}
     */
    getPrimaryColumnProb: function (data) {
        return {
            type: 'column',
            name: Texts.decodeURIComponent("tl.charts.func.prob_dens"),
            data: data,
            color: this.COLOR_PRIMARY,
            pointPadding: 0
        };
    },

    /**
     * Get the secondary distribution scatter type chart serie
     *
     * @param data The chart data
     * @returns {{type: string, data: *, zIndex: number, name: *, marker: {enabled: boolean, symbol: string, lineColor: string, lineWidth: number}}}
     */
    getSecondaryScatterDist: function (data) {
        return {
            type: 'scatter',
            data: data,
            zIndex: 1,
            name: Texts.decodeURIComponent("tl.charts.func.dist"),
            marker: {
                enabled: true,
                symbol: 'step_line_collapsed',
                lineColor: this.COLOR_SECONDARY,
                lineWidth: 2
            }
        };
    },

    /**
     * Get the secondary probability column type chart serie
     *
     * @param data The chart data
     * @returns {{type: string, name: *, data: *, color: string, pointPadding: number}}
     */
    getSecondaryColumnProb: function (data) {
        return {
            type: 'column',
            name: Texts.decodeURIComponent("tl.charts.func.prob_dens"),
            data: data,
            color: this.COLOR_SECONDARY,
            pointPadding: 0.3
        };
    },

    /**
     * Get the primary distribution line type chart serie
     *
     * @param data The chart data
     * @returns {{type: string, data: *, zIndex: number, name: *, color: string, marker: {enabled: boolean}}}
     */
    getPrimaryLineDist: function (data) {
        return {
            type: 'spline',
            data: data,
            zIndex: 1,
            name: Texts.decodeURIComponent("tl.charts.func.dist"),
            color: this.COLOR_PRIMARY,
            marker: {
                enabled: false
            }
        };
    },

    /**
     * Get the primary probability line type chart serie
     *
     * @param data The chart data
     * @returns {{type: string, data: *, name: *, color: string, marker: {enabled: boolean}}}
     */
    getPrimaryLineProb: function (data) {
        return {
            type: 'spline',
            data: data,
            name: Texts.decodeURIComponent("tl.charts.func.prob_dens"),
            color: this.COLOR_PRIMARY_BLACK,
            marker: {
                enabled: false
            }
        };
    },

    /**
     * Get the secondary distribution line type chart serie
     * @param data The chart data
     * @returns {{type: string, data: *, name: *, color: string, marker: {enabled: boolean}}}
     */
    getSecondaryLineDist: function (data) {
        return {
            type: 'spline',
            data: data,
            name: Texts.decodeURIComponent("tl.charts.func.dist"),
            color: this.COLOR_SECONDARY,
            marker: {
                enabled: false
            }
        };
    },

    /**
     * Get the secondary probability line type chart serie
     *
     * @param data The chart data
     * @returns {{type: string, data: *, name: *, color: string, marker: {enabled: boolean}}}
     */
    getSecondaryLineProb: function (data) {
        return {
            type: 'spline',
            data: data,
            name: Texts.decodeURIComponent("tl.charts.func.prob_dens"),
            color: this.COLOR_SECONDARY_BLACK,
            marker: {
                enabled: false
            }
        };
    },

    /**
     * Set data into the chart
     *
     * @param chart The highchart object
     * @param primaryData The primary serie data
     * @param secondaryData The secondary serie data
     */
    setData: function (chart, primaryData, secondaryData) {
        if (chart !== undefined) {
            chart.series[0].update({
                data: primaryData.dist
            }, false);
            chart.series[1].update({
                data: primaryData.prob !== undefined ? primaryData.prob : primaryData.density
            }, false);
            if (secondaryData !== undefined) {
                chart.series[2].update({
                    data: secondaryData.dist
                }, false);
                chart.series[3].update({
                    data: secondaryData.prob !== undefined ? secondaryData.prob : secondaryData.density
                }, false);
            }
            chart.redraw();
        }
    }

};

/**
 * Discrete distributions utilities class
 *
 * @type {{ID_SERIE_DISTRIBUTION: string, ID_SERIE_PROBABILITY: string, currentChart: undefined, setData: Function, getDistributionSerie: Function, getProbabilitySerie: Function, drawProbability: Function, drawProbabilityPointLabel: Function, drawProbabilityPoint: Function, setChartViewMode: Function}}
 */
var UtilsDDChart = {
    ID_SERIE_DISTRIBUTION: "dd-serie-dist",
    ID_SERIE_PROBABILITY: "dd-serie-prob",

    currentChart: undefined,

    /**
     * Set data into the chart
     *
     * @param chart The highchart object
     * @param dataDistribution The distribution data
     * @param dataProbability The probability data
     */
    setData: function (chart, dataDistribution, dataProbability) {
        var distributionSerie = chart.get(this.ID_SERIE_DISTRIBUTION);
        distributionSerie.update({
            data: dataDistribution
        }, false);
        var probabilitySerie = chart.get(this.ID_SERIE_PROBABILITY);
        probabilitySerie.update({
            data: dataProbability
        }, false);
        chart.redraw();
    },

    /**
     * Get the distribution serie configuration
     *
     * @param dataDistribution The distribution data
     * @returns {{id: string, type: string, data: *, zIndex: number, name: *, marker: {enabled: boolean, symbol: string, lineColor: null, lineWidth: number}}}
     */
    getDistributionSerie: function (dataDistribution) {
        return {
            id: this.ID_SERIE_DISTRIBUTION,
            type: 'scatter',
            data: dataDistribution,
            //step: 'left',
            zIndex: 1,
            name: Texts.decodeURIComponent("dd.charts.func.dist"),
            marker: {
                enabled: true,
                symbol: 'step_line',
                lineColor: null,
                lineWidth: 2
            }
        }
    },

    /**
     * Get the probability serie configuration
     *
     * @param dataProbability The probability data
     * @returns {{id: string, data: *, type: string, color: string, name: *, marker: {enabled: boolean}}}
     */
    getProbabilitySerie: function (dataProbability) {
        return {
            id: this.ID_SERIE_PROBABILITY,
            data: dataProbability,
            type: 'column',
            color: '#5F5F5F',
            name: Texts.decodeURIComponent("dd.charts.func.prob"),
            marker: {
                enabled: false
            }
        }
    },

    /**
     * Draw the probability chart serie
     *
     * @param chart The highchart object
     * @param xLower The probability lower value
     * @param xHigher The probability higher value
     */
    drawProbability: function (chart, xLower, xHigher) {
        if (chart != undefined) {
            var probabilitySerie = chart.get(this.ID_SERIE_PROBABILITY);
            if (probabilitySerie !== undefined) {
                var data = probabilitySerie.data;
                if (data !== undefined) {
                    for (var i = 0, size = data.length; i < size; i++) {
                        var point = data[i];
                        var color = (point.x > xLower && point.x <= xHigher) ? "#F9BA85" : '#5F5F5F';
                        point.update({
                            color: color, dataLabels: {
                                enabled: false
                            }
                        }, false);
                    }
                }
                chart.redraw();
            }
        }
    },

    /**
     * Draw the probability chart serie points label
     *
     * @returns {string}
     */
    drawProbabilityPointLabel: function () {
        return "P(X = " + this.point.x + ") = " + UtilsDCResult.round(this.point.y);
    },

    /**
     * Draw the probability point of x value
     *
     * @param chart The highchart object
     * @param x The x value
     */
    drawProbabilityPoint: function (chart, x) {
        if (chart != undefined) {
            var probabilitySerie = chart.get(this.ID_SERIE_PROBABILITY);
            if (probabilitySerie !== undefined) {
                var data = probabilitySerie.data;
                if (data !== undefined) {
                    for (var i = 0, size = data.length; i < size; i++) {
                        var point = data[i];
                        var label = point.x == x;
                        var color = label ? "#F9BA85" : '#5F5F5F';
                        var formatter = label ? this.drawProbabilityPointLabel : undefined;
                        point.update({
                            color: color, dataLabels: {
                                enabled: label,
                                formatter: formatter
                            }
                        }, false);
                    }
                }
                chart.redraw();
            }
        }
    },

    /**
     * Set the chart view mode (distribution or probability)
     *
     * @param chart The highchart object
     * @param isProbability if it's probability mode or not
     */
    setChartViewMode: function (chart, isProbability) {
        var distSerie = chart.get(this.ID_SERIE_DISTRIBUTION);
        distSerie.setVisible(!isProbability);
    }
};

/**
 * Continuous distribution utilities class
 *
 * @type {{ID_DIST_SERIE: string, ID_DENS_SERIE: string, ID_NORMAL_SERIE: string, ID_AREA_SERIE: string, getDistributionSerie: Function, getDensitySerie: Function, getNormalSerie: Function, getAreaSerie: Function, setData: Function, setAreaDataByRange: Function, setChartViewMode: Function}}
 */
var UtilsDCChart = {
    ID_DIST_SERIE: "dc-serie-dist",
    ID_DENS_SERIE: "dc-serie-density",
    ID_NORMAL_SERIE: "dc-serie-normal",
    ID_AREA_SERIE: "dc-serie-area",

    /**
     * Get the distribution chart serie configuration
     *
     * @param dataDistribution The distribution data
     * @returns {{id: string, name: *, type: string, marker: {enabled: boolean}, data: *}}
     */
    getDistributionSerie: function (dataDistribution) {
        return {
            id: this.ID_DIST_SERIE,
            name: Texts.decodeURIComponent("dc.charts.func.dist"),
            type: "spline",
            marker: {
                enabled: false
            },
            data: dataDistribution
        }
    },

    /**
     * Get the density chart serie configuration
     *
     * @param dataDensity The density data
     * @param yAxis The associated y axis
     * @returns {{id: string, name: *, type: string, marker: {enabled: boolean}, data: *}}
     */
    getDensitySerie: function (dataDensity, yAxis) {
        var config = {
            id: this.ID_DENS_SERIE,
            name: Texts.decodeURIComponent("dc.charts.func.density"),
            type: "spline",
            marker: {
                enabled: false
            },
            data: dataDensity
        };

        if (yAxis !== undefined) {
            config.yAxis = yAxis;
        }
        return config;
    },

    /**
     * Get Normal distribution density chart serie configuration
     *
     * @param normalDensity The Normal density data
     * @returns {{id: string, name: string, type: string, marker: {enabled: boolean}, data: *, visible: boolean}}
     */
    getNormalSerie: function (normalDensity) {
        return {
            id: this.ID_NORMAL_SERIE,
            name: "N(0,1)",
            type: "spline",
            marker: {
                enabled: false
            },
            data: normalDensity,
            visible: false
        }
    },

    /**
     * Get probability area chart serie configuration
     *
     * @param dataArea The area data
     * @returns {{id: string, name: string, zIndex: number, type: string, color: string, marker: {enabled: boolean}, data: *}}
     */
    getAreaSerie: function (dataArea) {
        return {
            id: this.ID_AREA_SERIE,
            name: Texts.decodeURIComponent("dc.result.probability"),
            zIndex: -1,
            type: "arearange",
            color: "#F9BA85",
            marker: {
                enabled: false
            },
            data: dataArea
        }
    },

    /**
     * Set data into the chart
     *
     * @param chart The highchart object
     * @param dataDistribution The distribution data
     * @param dataDensity The density data
     */
    setData: function (chart, dataDistribution, dataDensity) {
        var distSerie = chart.get(UtilsDCChart.ID_DIST_SERIE);
        distSerie.update({
            data: dataDistribution
        }, false);
        var densSerie = chart.get(UtilsDCChart.ID_DENS_SERIE);
        densSerie.update({
            data: dataDensity
        }, false);
        chart.redraw();
    },

    /**
     * Set the probability area range data into the chart
     *
     * @param chart The highchart object
     * @param data The probability area data
     */
    setAreaDataByRange: function (chart, data) {
        var serie = chart.get(this.ID_AREA_SERIE);
        serie.update({
            data: data
        }, true);
    },

    /**
     * Set the chart view mode (distribution or density)
     *
     * @param chart The highchart object
     * @param isDensity if it's density mode or not
     */
    setChartViewMode: function (chart, isDensity) {
        var distSerie = chart.get(this.ID_DIST_SERIE);
        distSerie.setVisible(!isDensity);
    }
};

/**
 * Probability chart serie utilities class
 *
 * @param isDiscrete If it's to discrete distributions or continuous distributions
 * @constructor
 */
function UtilsProbability(isDiscrete) {

    var _this = this;
    var prefix = (isDiscrete ? "dd" : "dc");

    var ID_X_PLOT_LINE_LOWER = prefix + "-pl-x-lower",
        ID_X_PLOT_LINE_HIGHER = prefix + "-pl-x-higher",
        ID_Y_PLOT_LINE_LOWER = prefix + "-pl-y-lower",
        ID_Y_PLOT_LINE_HIGHER = prefix + "-pl-y-higher",
        ID_PROB_SERIE = prefix + "-serie-prob-column",
        PLOT_Z_INDEX = 100,
        PROB_WIDTH = 4,
        PROB_COLOR = 'red',
        defaultPoint = {
            x: 0,
            low: 0,
            high: 1
        },
        temporalPoint = {
            x: 0,
            low: 0,
            high: 1
        },
        currentChart = undefined,
        xRange;

    var compareLeft = (isDiscrete !== undefined && isDiscrete) ? "<" : "<=";

    /**
     * Set the current chart
     *
     * @param chart The highchart object
     */
    this.setCurrentChart = function (chart) {
        currentChart = chart;
    };

    /**
     * Get the probability limits plot lines configuration
     *
     * @returns {{animation: boolean, grouping: boolean, dataLabels: {enabled: boolean, formatter: Function}, events: {hide: Function, show: Function}}}
     */
    this.getPlotOptions = function () {
        return {
            animation: false,
            grouping: false,
            dataLabels: {
                enabled: true,
                formatter: function () {
                    if (xRange !== undefined && this.point.low !== undefined && this.y === this.point.high) {
                        var value = UtilsDCResult.round(this.point.high - this.point.low);
                        return "P(" + xRange.lower.toFixed(2) + ' ' + compareLeft + ' X <= ' + xRange.higher.toFixed(2) + ") = " + value;
                    }
                    return "";
                }
            },
            events: {
                hide: function () {
                    var point = this.data[0];
                    if (point !== undefined) {
                        temporalPoint = {
                            x: point.x,
                            low: point.low,
                            high: point.high
                        };
                        removeSerie();
                    }
                },
                show: function () {
                    addSerie();
                }
            }
        };
    };

    /**
     * Get a new probability plot line configuration
     *
     * @param id The plot line identificator
     * @param value The plot line value
     * @returns {{color: string, width: number, value: *, zIndex: number, dashStyle: string, id: *}}
     */
    var newPlotLineConfig = function (id, value) {
        return {
            color: '#6600CC',
            width: 1,
            value: value,
            zIndex: PLOT_Z_INDEX,
            dashStyle: 'ShortDash',
            id: id
        };
    };

    /**
     * Hide the probability limits plot lines
     *
     * @param chart The highchart object
     */
    this.hideLimits = function (chart) {
        if (chart !== undefined) {
            var xAxis = chart.xAxis[0];
            var yAxis = chart.yAxis[0];
            xAxis.removePlotBand(ID_X_PLOT_LINE_LOWER);
            xAxis.removePlotBand(ID_X_PLOT_LINE_HIGHER);
            yAxis.removePlotBand(ID_Y_PLOT_LINE_LOWER);
            yAxis.removePlotBand(ID_Y_PLOT_LINE_HIGHER);
        }
    };

    /**
     * Update the probability limits plot lines
     *
     * @param chart The highchart object
     * @param xLower The x axis lower value
     * @param xHigher The x axis higher value
     * @param yLower The y axis lower value
     * @param yHigher The y axis higher value
     */
    this.updateLimits = function (chart, xLower, xHigher, yLower, yHigher) {
        if (chart !== undefined) {
            this.hideLimits(chart);
            var xAxis = chart.xAxis[0];
            var yAxis = chart.yAxis[0];
            xAxis.addPlotBand(newPlotLineConfig(ID_X_PLOT_LINE_LOWER, xLower));
            xAxis.addPlotBand(newPlotLineConfig(ID_X_PLOT_LINE_HIGHER, xHigher));
            yAxis.addPlotBand(newPlotLineConfig(ID_Y_PLOT_LINE_LOWER, yLower));
            yAxis.addPlotBand(newPlotLineConfig(ID_Y_PLOT_LINE_HIGHER, yHigher));
        }
    };

    /**
     * Draw the probability chart column serie
     *
     * @param chart The highchart object
     * @param xLower The x axis lower value
     * @param xHigher The x axis higher value
     * @param lowerProbability The probability lower value
     * @param higherProbability The probability higher value
     */
    this.drawProbability = function (chart, xLower, xHigher, lowerProbability, higherProbability) {
        if (chart != undefined) {
            xRange = {lower: xLower, higher: xHigher};
            var probabilitySerie = chart.get(ID_PROB_SERIE);
            if (probabilitySerie !== undefined) {
                var data = probabilitySerie.data[0];
                if (data !== undefined) {
                    data.update({
                        x: xHigher,
                        low: lowerProbability,
                        high: higherProbability
                    });
                }
            }
        }
    };

    /**
     * Get the probability chart serie configuration
     *
     * @returns {{id: string, name: *, type: string, stack: string, pointWidth: number, color: string, data: *[]}}
     */
    this.getProbabilitySerie = function () {
        return {
            id: ID_PROB_SERIE,
            name: Texts.decodeURIComponent("dc.result.probability"),
            type: "columnrange",
            stack: 'Tasks',
            //zIndex: this.PROB_Z_INDEX,
            pointWidth: PROB_WIDTH,
            color: PROB_COLOR,
            //showInLegend: false,
            data: [defaultPoint]
        };
    };

    /**
     * Add the probability serie to the current chart (and show it)
     */
    var addSerie = function () {
        if (currentChart !== undefined) {
            var serie = currentChart.get(ID_PROB_SERIE);
            serie.update({
                data: [temporalPoint]
            }, true);
        }
    };

    /**
     * Remove the probability serie from the current chart (and hide it)
     */
    var removeSerie = function () {
        if (currentChart !== undefined) {
            var serie = currentChart.get(ID_PROB_SERIE);
            serie.update({
                data: []
            }, true);
        }
    };

    /**
     * Set probability chart serie visible or not
     *
     * @param visible if the probability serie must be visible or not
     */
    this.setSerieVisible = function (visible) {
        if (currentChart !== undefined) {
            var serie = currentChart.get(ID_PROB_SERIE);
            serie.setVisible(visible);
        }
    };
}

/**
 * Continuous distributions result (operations) utilities class
 *
 * @type {{round: Function, calculateProbabilityLeft: Function, calculateProbabilityRight: Function, calculateProbabilityBoth: Function, calculateQuantileLeft: Function, calculateQuantileRight: Function, calculateQuantileBoth: Function}}
 */
var UtilsDCResult = {

    /**
     * Round the value to 4 decimals
     *
     * @param value The value to rounded
     * @returns {number}
     */
    round: function (value) {
        return Math.round(value * 10000) / 10000;
    },

    /**
     * Calculate the left probability value
     *
     * @param chart The highchart object
     * @param distParent The distribution handler
     * @param value The value
     * @param $output The jquery object to set the result output
     */
    calculateProbabilityLeft: function (chart, distParent, value, $output) {
        var dist = distParent.getDistribution();
        var probability = this.round(dist.CDF(value));
        $output.val(probability);
        UtilsDCChart.setAreaDataByRange(chart, distParent.getAreaPoints(chart.xAxis[0].min, value))
    },

    /**
     * Calculate the right probability value
     *
     * @param chart The highchart object
     * @param distParent The distribution handler
     * @param value The value
     * @param $output The jquery object to set the result output
     */
    calculateProbabilityRight: function (chart, distParent, value, $output) {
        var dist = distParent.getDistribution();
        var probability = this.round(1 - dist.CDF(value));
        $output.val(probability);
        UtilsDCChart.setAreaDataByRange(chart, distParent.getAreaPoints(value, chart.xAxis[0].max))
    },

    /**
     * Calculate both (left and right) probability values
     *
     * @param chart The highchart object
     * @param distParent The distribution handler
     * @param quantileRight The value
     * @param $outputLeft The jquery object to set the left probability result output
     * @param $outputRight The jquery object to set the right probability result output
     * @param $outputProb The jquery object to set the probability value result output
     */
    calculateProbabilityBoth: function (chart, distParent, quantileRight, $outputLeft, $outputRight, $outputProb) {
        var dist = distParent.getDistribution();
        var probRight = 1 - dist.CDF(quantileRight);
        var probLeft = probRight;
        var quantileLeft = this.round(dist.quantile(probLeft));
        var quantileLimit = this.round(dist.quantile(0.5)); // La probabilidad de una cola no puede ser mayor de 0.5. Se intercambia la cola derecha por la izquierda
        if (quantileRight < quantileLimit) {
            quantileLeft = quantileRight;
            probLeft = this.round(dist.CDF(quantileLeft));
            probRight = probLeft;
            quantileRight = this.round(dist.quantile(1 - probRight));
        }
        var probability = this.round(probLeft + probRight);
        $outputLeft.val(quantileLeft);
        $outputRight.val(quantileRight);
        $outputProb.val(probability);

        var dataLeft = distParent.getAreaPoints(chart.xAxis[0].min, quantileLeft);
        var dataRight = distParent.getAreaPoints(quantileRight, chart.xAxis[0].max);
        dataLeft.push(null);
        var data = dataLeft.concat(dataRight);
        UtilsDCChart.setAreaDataByRange(chart, data);

    },

    /**
     * Calculate the left quantile value
     *
     * @param chart The highchart object
     * @param distParent The distribution handler
     * @param value The value
     * @param $output The jquery object to set the result output
     */
    calculateQuantileLeft: function (chart, distParent, value, $output) {
        var dist = distParent.getDistribution();
        var probability = this.round(dist.quantile(value));
        $output.val(probability);
        UtilsDCChart.setAreaDataByRange(chart, distParent.getAreaPoints(chart.xAxis[0].min, probability))
    },

    /**
     * Calculate the right quantile value
     *
     * @param chart The highchart object
     * @param distParent The distribution handler
     * @param value The value
     * @param $output The jquery object to set the result output
     */
    calculateQuantileRight: function (chart, distParent, value, $output) {
        var dist = distParent.getDistribution();
        var probability = this.round(dist.quantile(1 - value));
        $output.val(probability);
        UtilsDCChart.setAreaDataByRange(chart, distParent.getAreaPoints(probability, chart.xAxis[0].max))
    },

    /**
     * Calculate both (left and right) quantile values
     *
     * @param chart The highchart object
     * @param distParent The distribution handler
     * @param value The value
     * @param $outputLeft The jquery object to set the left quantile result output
     * @param $outputRight The jquery object to set the right quantile result output
     * @param $outputProb The jquery object to set the probability value result output
     */
    calculateQuantileBoth: function (chart, distParent, value, $outputLeft, $outputRight, $outputProb) {
        var dist = distParent.getDistribution();
        var quantileLeft = this.round(dist.quantile(value / 2));
        var quantileRight = this.round(dist.quantile(1 - value / 2));

        $outputLeft.val(quantileLeft);
        $outputRight.val(quantileRight);
        $outputProb.val(value);

        var dataLeft = distParent.getAreaPoints(chart.xAxis[0].min, quantileLeft);
        var dataRight = distParent.getAreaPoints(quantileRight, chart.xAxis[0].max);
        dataLeft.push(null);
        var data = dataLeft.concat(dataRight);
        UtilsDCChart.setAreaDataByRange(chart, data);
    }
};

/**
 * Combinatory class
 *
 * @type {{getFactorial: Function, getCombinatory: Function}}
 */
var Combinatory = {

    /**
     * Get the factorial of a number
     * @param n The number
     * @returns {number}
     */
    getFactorial: function (n) {
        if (n < 0)
            return -1;
        else if (n == 1 || n == 0)
            return 1;
        else
            return n * this.getFactorial(n - 1);
    },

    /**
     * Get the combinatorial of two values
     *
     * @param a The a value
     * @param b The b value
     * @returns {number}
     */
    getCombinatory: function (a, b) {
        if (a >= b && a >= 0 && b >= 0)
            return this.getFactorial(a) / (this.getFactorial(b) * this.getFactorial(a - b));
        else
            return -1;
    }

};

/**
 * Slider class to handler the slider and its associated input number
 *
 * @param selectorSlider The selector id of the slider
 * @param onSlide The on slider (value change) callback function
 * @returns {Slider}
 * @constructor
 */
function Slider(selectorSlider, onSlide) {
    var _this = this;
    var oldValue = 999999;
    var fire = true;
    var data = {};

    this.$slider = $(selectorSlider);
    this.$value = $(selectorSlider + "_value");

    /**
     * Get the min value allowed
     *
     * @returns {Number}
     */
    this.getMin = function () {
        return (data.min !== undefined) ? data.min : parseFloat(_this.$slider.attr("min"));
    };

    /**
     * Get the max value allowed
     *
     * @returns {Number}
     */
    this.getMax = function () {
        return (data.max !== undefined) ? data.max : parseFloat(_this.$slider.attr("max"));
    };

    /**
     * Get the current value
     *
     * @returns {Number}
     */
    this.getValue = function () {
        return parseFloat(_this.$value.val());
    };

    /**
     * Update the slider value and execute the callback function
     *
     * @param value The new value
     */
    this.updateFire = function (value) {
        fire = true;
        _this.$slider.val(value).change();
        _this.$value.val(value);
    };

    /**
     * Update the slider value without execute the callback function
     *
     * @param value The new value
     */
    this.updateNoFire = function (value) {
        fire = false;
        _this.$slider.val(value).change();
        _this.$value.val(value);
    };

    /**
     * Update the slider values
     *
     * @param min The min value
     * @param max The max value
     * @param value The current value
     * @param step The step or interval value
     */
    this.updateValues = function (min, max, value, step) {

        if (value > max) {
            value = max;
        }

        data = {
            min: min,
            max: max,
            step: step,
            value: value
        };
        _this.$slider.attr(data).rangeslider('update', true);
        _this.$slider.val(value).change();
        _this.$value.attr("min", min);
        _this.$value.attr("max", max);
        _this.$value.attr("step", 0.01);
        _this.$value.val(value);
    };

    /**
     * Update the step or interval value
     *
     * @param step The step or interval value
     */
    this.updateNumberStep = function (step) {
        _this.$value.attr("step", step);
    };

    /**
     * Get the normalized current value. Before returning the value check if it is greater or lower than the max and min values a fix it.
     *
     * @param value The value to normalize
     * @returns {*}
     */
    function getNormalValue(value) {
        if (value > _this.getMax()) {
            value = _this.getMax();
        } else if (value < _this.getMin()) {
            value = _this.getMin();
        }
        return value;
    }

    /******************************** INIT **********************************************/

    /**
     * Initialize the slider
     */
    this.init = function () {
        var attributes = {
            polyfill: false
        };

        if (typeof onSlide === 'function') {
            attributes["onSlide"] = function (position, value) {
                if (value !== undefined) {
                    value = getNormalValue(value);
                    if (oldValue !== value) { // Fix no stop on min/max overflow
                        oldValue = value;
                        _this.$value.val(value.toFixed(2));
                        if (fire) {
                            onSlide(position, value);
                        }
                    }
                    fire = true; // default
                }
            };
        }
        _this.$slider.rangeslider(attributes);
        _this.$value.change(function () {
            var value = _this.$value.val();
            if (value > _this.getMax()) {
                value = _this.getMax();
                _this.$value.val(value);
            } else if (value < _this.getMin()) {
                value = _this.getMin();
                _this.$value.val(value);
            }
            _this.updateNoFire(value);
            if (typeof onSlide === 'function') {
                onSlide(0, value);
            }
        });
    };

    _this.init();
    return this;
}

/**
 * InputNumber class to handler this components
 *
 * @param selector The selector id of input number
 * @param onChange The on change (value change) callback function
 * @constructor
 */
function InputNumber(selector, onChange) {

    var $value = $(selector);
    var callback = onChange;

    /**
     * Get the current value
     *
     * @returns {Number}
     */
    this.getValue = function () {
        return parseFloat($value.val());
    };

    /**
     * Update the input number range
     *
     * @param min The min value
     * @param max The max value
     * @param value The current value
     */
    this.update = function (min, max, value) {
        $value.attr("min", min);
        $value.attr("max", max);
        $value.attr("step", 0.01);
        $value.val(value);

        $value.change(function () {
            var value = $value.val();
            if (value > max) {
                value = max;
                $value.val(value);
            } else if (value < min) {
                value = min;
                $value.val(value);
            }

            if (typeof callback === 'function') {
                callback(value);
            }
        });
    };
}

/**
 * Texts class to handle the text translations depending of the language.
 * The default language is spanish (es).
 *
 * @constructor
 */
function Texts() {

    var lang;
    var $items;

    this.init = function (callback) {
        lang = $("#lang").text();
        var options = {lng: lang, fallbackLng: "es", debug: true};
        $.i18n.init(options).done(function () {
            if (typeof callback === 'function') {
                callback();
            }
            $items = $('[data-i18n]');
            $items.each(function () {
                $(this).i18n();
            });

        });
    };
}

Texts.decodeURIComponent = function (key) {
    try {
        return decodeURIComponent(escape($.t(key)));
    } catch (e) {
        return $.t(key);
    }
};
