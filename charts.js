// Chart.js Integration and Chart Creation Functions

// Chart.js default configuration
Chart.defaults.font.family = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
Chart.defaults.font.size = 12;
Chart.defaults.plugins.legend.display = true;
Chart.defaults.plugins.legend.position = 'bottom';
Chart.defaults.plugins.tooltip.enabled = true;
Chart.defaults.responsive = true;
Chart.defaults.maintainAspectRatio = false;

// Get theme colors based on current theme
function getThemeColors() {
    const isDark = document.body.classList.contains('dark-theme');
    return {
        primary: '#2563eb',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        text: isDark ? '#f9fafb' : '#1f2937',
        grid: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        background: isDark ? '#1f2937' : '#ffffff'
    };
}

/**
 * Create Growth Projection Chart
 * @param {Object} sipResult - SIP calculation result
 * @returns {Chart} Chart.js chart instance
 */
function createGrowthChart(sipResult) {
    const ctx = document.getElementById('growth-chart');
    if (!ctx) return null;

    const projections = calculateSIPProjections(
        sipResult.monthlyAmount,
        sipResult.years,
        sipResult.annualReturns,
        6
    );

    const colors = getThemeColors();

    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: projections.labels,
            datasets: [
                {
                    label: 'Invested Amount',
                    data: projections.invested,
                    borderColor: colors.primary,
                    backgroundColor: colors.primary + '20',
                    borderWidth: 2,
                    fill: false,
                    tension: 0.4
                },
                {
                    label: 'Maturity Value',
                    data: projections.maturity,
                    borderColor: colors.success,
                    backgroundColor: colors.success + '20',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 2,
            plugins: {
                title: {
                    display: true,
                    text: 'SIP Growth Projection Over Time',
                    font: { size: 16 }
                },
                legend: {
                    display: true,
                    position: 'bottom'
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + formatCurrency(context.parsed.y);
                        }
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Time Period'
                    },
                    grid: {
                        color: colors.grid
                    },
                    ticks: {
                        color: colors.text
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Amount (₹)'
                    },
                    grid: {
                        color: colors.grid
                    },
                    ticks: {
                        color: colors.text,
                        callback: function(value) {
                            return formatCurrency(value);
                        }
                    }
                }
            }
        }
    });
}

/**
 * Create Returns Breakdown Chart (Doughnut)
 * @param {Object} sipResult - SIP calculation result
 * @returns {Chart} Chart.js chart instance
 */
function createReturnsChart(sipResult) {
    const ctx = document.getElementById('returns-chart');
    if (!ctx) return null;

    const colors = getThemeColors();

    return new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Principal Invested', 'Returns'],
            datasets: [{
                data: [sipResult.totalInvested, sipResult.returns],
                backgroundColor: [
                    colors.primary,
                    colors.success
                ],
                borderWidth: 2,
                borderColor: colors.background
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 1.5,
            plugins: {
                title: {
                    display: true,
                    text: 'Returns Breakdown',
                    font: { size: 16 }
                },
                legend: {
                    display: true,
                    position: 'bottom'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = formatCurrency(context.parsed);
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((context.parsed / total) * 100).toFixed(1);
                            return `${label}: ${value} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

/**
 * Create Year-wise Growth Chart
 * @param {Object} sipResult - SIP calculation result
 * @returns {Chart} Chart.js chart instance
 */
function createYearlyGrowthChart(sipResult) {
    const ctx = document.getElementById('yearly-chart');
    if (!ctx) return null;

    const yearlyData = calculateYearlyGrowth(
        sipResult.monthlyAmount,
        sipResult.years,
        sipResult.annualReturns
    );

    const colors = getThemeColors();

    return new Chart(ctx, {
        type: 'bar',
        data: {
            labels: yearlyData.map(d => `Year ${d.year}`),
            datasets: [
                {
                    label: 'Invested',
                    data: yearlyData.map(d => d.totalInvested),
                    backgroundColor: colors.primary + '80',
                    borderColor: colors.primary,
                    borderWidth: 1
                },
                {
                    label: 'Returns',
                    data: yearlyData.map(d => d.returns),
                    backgroundColor: colors.success + '80',
                    borderColor: colors.success,
                    borderWidth: 1
                },
                {
                    label: 'Total Value',
                    data: yearlyData.map(d => d.currentValue),
                    backgroundColor: colors.warning + '80',
                    borderColor: colors.warning,
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 2,
            plugins: {
                title: {
                    display: true,
                    text: 'Year-wise Growth Analysis',
                    font: { size: 16 }
                },
                legend: {
                    display: true,
                    position: 'bottom'
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + formatCurrency(context.parsed.y);
                        }
                    }
                }
            },
            scales: {
                x: {
                    stacked: false,
                    grid: {
                        color: colors.grid
                    },
                    ticks: {
                        color: colors.text
                    }
                },
                y: {
                    stacked: false,
                    grid: {
                        color: colors.grid
                    },
                    ticks: {
                        color: colors.text,
                        callback: function(value) {
                            return formatCurrency(value);
                        }
                    }
                }
            }
        }
    });
}

/**
 * Create Comparison Chart (Multiple SIPs)
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {Array} sipScenarios - Array of SIP scenarios
 * @returns {Chart} Chart.js chart instance
 */
function createComparisonChart(ctx, sipScenarios) {
    if (!ctx || !sipScenarios || sipScenarios.length === 0) return null;

    const colors = getThemeColors();
    const chartColors = [colors.primary, colors.success, colors.warning, colors.error, '#8b5cf6', '#ec4899'];

    const datasets = sipScenarios.map((scenario, index) => {
        const result = calculateSIP(
            scenario.amount || scenario.monthlyAmount,
            scenario.period || scenario.years,
            scenario.returns || scenario.expectedReturns
        );
        const projections = calculateSIPProjections(
            scenario.amount || scenario.monthlyAmount,
            scenario.period || scenario.years,
            scenario.returns || scenario.expectedReturns,
            12
        );

        return {
            label: scenario.name || `SIP ${index + 1}`,
            data: projections.maturity,
            borderColor: chartColors[index % chartColors.length],
            backgroundColor: chartColors[index % chartColors.length] + '20',
            borderWidth: 2,
            fill: false,
            tension: 0.4
        };
    });

    const firstProjections = calculateSIPProjections(
        sipScenarios[0].amount || sipScenarios[0].monthlyAmount,
        sipScenarios[0].period || sipScenarios[0].years,
        sipScenarios[0].returns || sipScenarios[0].expectedReturns,
        12
    );

    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: firstProjections.labels,
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 2,
            plugins: {
                title: {
                    display: true,
                    text: 'SIP Comparison',
                    font: { size: 16 }
                },
                legend: {
                    display: true,
                    position: 'bottom'
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + formatCurrency(context.parsed.y);
                        }
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Time Period'
                    },
                    grid: {
                        color: colors.grid
                    },
                    ticks: {
                        color: colors.text
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Maturity Value (₹)'
                    },
                    grid: {
                        color: colors.grid
                    },
                    ticks: {
                        color: colors.text,
                        callback: function(value) {
                            return formatCurrency(value);
                        }
                    }
                }
            }
        }
    });
}

/**
 * Create Portfolio Allocation Chart (Pie)
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {Array} labels - Asset labels
 * @param {Array} values - Allocation values
 * @returns {Chart} Chart.js chart instance
 */
function createPortfolioAllocationChart(ctx, labels, values) {
    if (!ctx || !labels || !values) return null;

    const colors = getThemeColors();
    const chartColors = [
        colors.primary,
        colors.success,
        colors.warning,
        '#8b5cf6',
        colors.error
    ];

    return new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: values,
                backgroundColor: chartColors.slice(0, labels.length),
                borderWidth: 2,
                borderColor: colors.background
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 1.5,
            plugins: {
                title: {
                    display: true,
                    text: 'Portfolio Allocation',
                    font: { size: 16 }
                },
                legend: {
                    display: true,
                    position: 'bottom'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                            return `${label}: ${value}% (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

/**
 * Create Risk-Return Analysis Chart (Scatter)
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {Array} data - Risk-return data points
 * @returns {Chart} Chart.js chart instance
 */
function createRiskReturnChart(ctx, data) {
    if (!ctx || !data || data.length === 0) return null;

    const colors = getThemeColors();

    return new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Investments',
                data: data.map(d => ({ x: d.x, y: d.y })),
                backgroundColor: colors.primary + '80',
                borderColor: colors.primary,
                borderWidth: 2,
                pointRadius: 8,
                pointHoverRadius: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 1.5,
            plugins: {
                title: {
                    display: true,
                    text: 'Risk-Return Analysis',
                    font: { size: 16 }
                },
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        title: function(context) {
                            const point = data[context[0].dataIndex];
                            return point.label || 'Investment';
                        },
                        label: function(context) {
                            return [
                                'Risk Score: ' + context.parsed.x.toFixed(1),
                                'Returns: ' + formatPercentage(context.parsed.y)
                            ];
                        }
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Risk Level (1-10)'
                    },
                    min: 0,
                    max: 10,
                    grid: {
                        color: colors.grid
                    },
                    ticks: {
                        color: colors.text
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Expected Returns (%)'
                    },
                    grid: {
                        color: colors.grid
                    },
                    ticks: {
                        color: colors.text,
                        callback: function(value) {
                            return value.toFixed(1) + '%';
                        }
                    }
                }
            }
        }
    });
}

// Update chart colors when theme changes
function updateChartTheme(chart) {
    if (!chart) return;
    
    const colors = getThemeColors();
    
    // Update chart options
    if (chart.options.scales) {
        Object.keys(chart.options.scales).forEach(scaleKey => {
            const scale = chart.options.scales[scaleKey];
            if (scale.grid) scale.grid.color = colors.grid;
            if (scale.ticks) scale.ticks.color = colors.text;
        });
    }
    
    chart.update();
}

// Export chart as image
function exportChartAsImage(chartId, filename = 'chart.png') {
    const canvas = document.getElementById(chartId);
    if (!canvas) return;
    
    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/png');
    link.click();
}

// Export all charts on a page
function exportAllCharts() {
    const charts = Chart.getChart(document.getElementById('growth-chart')) || 
                   Chart.getChart(document.getElementById('comparison-chart')) ||
                   Chart.getChart(document.getElementById('returns-chart'));
    
    if (charts && charts.length > 0) {
        charts.forEach((chart, index) => {
            setTimeout(() => {
                exportChartAsImage(chart.canvas.id, `chart-${index + 1}.png`);
            }, index * 500);
        });
    }
}




