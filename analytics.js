// Analytics Data Processing Functions

/**
 * Process analytics data for all investments
 * @param {Array} portfolios - Array of portfolio objects
 * @param {Array} sipScenarios - Array of SIP scenarios
 * @returns {Object} Processed analytics data
 */
function processAnalyticsData(portfolios, sipScenarios) {
    const analytics = {
        totalInvested: 0,
        totalValue: 0,
        totalReturns: 0,
        portfolios: [],
        sips: [],
        summary: {}
    };

    // Process portfolios
    portfolios.forEach(portfolio => {
        const metrics = calculatePortfolioMetrics(portfolio);
        analytics.totalInvested += metrics.totalInvested;
        analytics.totalValue += metrics.currentValue;
        analytics.totalReturns += metrics.returns;
        analytics.portfolios.push({
            ...portfolio,
            metrics: metrics
        });
    });

    // Process SIP scenarios
    sipScenarios.forEach(scenario => {
        const result = calculateSIP(
            scenario.monthlyAmount,
            scenario.period,
            scenario.expectedReturns
        );
        analytics.totalInvested += result.totalInvested;
        analytics.totalValue += result.maturityValue;
        analytics.totalReturns += result.returns;
        analytics.sips.push({
            ...scenario,
            result: result
        });
    });

    // Calculate summary metrics
    analytics.summary = {
        totalInvested: round(analytics.totalInvested, 2),
        totalValue: round(analytics.totalValue, 2),
        totalReturns: round(analytics.totalReturns, 2),
        averageROI: analytics.totalInvested > 0 
            ? round((analytics.totalReturns / analytics.totalInvested) * 100, 2) 
            : 0,
        portfolioCount: portfolios.length,
        sipCount: sipScenarios.length
    };

    return analytics;
}

/**
 * Generate comparison data for multiple SIPs
 * @param {Array} sipScenarios - Array of SIP scenarios
 * @returns {Array} Comparison data
 */
function generateSIPComparison(sipScenarios) {
    return sipScenarios.map(scenario => {
        const result = calculateSIP(
            scenario.monthlyAmount,
            scenario.period,
            scenario.expectedReturns
        );
        
        return {
            name: scenario.name || 'Unnamed SIP',
            monthlyAmount: scenario.monthlyAmount,
            period: scenario.period,
            returns: scenario.expectedReturns,
            totalInvested: result.totalInvested,
            maturityValue: result.maturityValue,
            returns: result.returns,
            roi: result.returnPercentage
        };
    });
}

/**
 * Generate risk-return data for visualization
 * @param {Array} portfolios - Array of portfolios
 * @param {Array} sipScenarios - Array of SIP scenarios
 * @returns {Array} Risk-return data points
 */
function generateRiskReturnData(portfolios, sipScenarios) {
    const data = [];

    portfolios.forEach(portfolio => {
        const risk = calculatePortfolioRisk(portfolio);
        const metrics = calculatePortfolioMetrics(portfolio);
        data.push({
            x: risk,
            y: metrics.roi,
            label: portfolio.name || 'Portfolio',
            type: 'portfolio',
            id: portfolio.id
        });
    });

    sipScenarios.forEach(scenario => {
        const result = calculateSIP(
            scenario.monthlyAmount,
            scenario.period,
            scenario.expectedReturns
        );
        // SIP risk is typically moderate (5 on 1-10 scale)
        data.push({
            x: 5,
            y: result.returnPercentage,
            label: scenario.name || 'SIP',
            type: 'sip'
        });
    });

    return data;
}

/**
 * Calculate aggregate statistics
 * @param {Object} analytics - Analytics data object
 * @returns {Object} Aggregate statistics
 */
function calculateAggregateStats(analytics) {
    const stats = {
        totalInvestments: analytics.portfolios.length + analytics.sips.length,
        bestPerformer: null,
        worstPerformer: null,
        averageReturns: 0,
        riskDistribution: {
            low: 0,
            medium: 0,
            high: 0
        }
    };

    const allInvestments = [
        ...analytics.portfolios.map(p => ({ ...p.metrics, name: p.name, type: 'portfolio' })),
        ...analytics.sips.map(s => ({ roi: s.result.returnPercentage, name: s.name, type: 'sip' }))
    ];

    if (allInvestments.length > 0) {
        // Find best and worst performers
        stats.bestPerformer = allInvestments.reduce((best, current) => 
            current.roi > best.roi ? current : best
        );
        stats.worstPerformer = allInvestments.reduce((worst, current) => 
            current.roi < worst.roi ? current : worst
        );

        // Calculate average returns
        stats.averageReturns = allInvestments.reduce((sum, inv) => sum + inv.roi, 0) / allInvestments.length;

        // Risk distribution (based on ROI range)
        allInvestments.forEach(inv => {
            if (inv.roi < 8) stats.riskDistribution.low++;
            else if (inv.roi < 15) stats.riskDistribution.medium++;
            else stats.riskDistribution.high++;
        });
    }

    return stats;
}

/**
 * Generate time series data for growth visualization
 * @param {Array} investments - Array of investment objects
 * @param {number} years - Time period in years
 * @returns {Object} Time series data
 */
function generateTimeSeriesData(investments, years = 10) {
    const labels = [];
    for (let i = 1; i <= years; i++) {
        labels.push(`Year ${i}`);
    }

    const datasets = investments.map((investment, index) => {
        const values = [];
        for (let year = 1; year <= years; year++) {
            if (investment.type === 'sip') {
                const result = calculateSIP(
                    investment.monthlyAmount,
                    year,
                    investment.expectedReturns
                );
                values.push(result.maturityValue);
            } else {
                // Portfolio calculation
                const portfolioValue = calculatePortfolioReturns({
                    ...investment,
                    timeHorizon: year
                });
                values.push(portfolioValue);
            }
        }
        return {
            label: investment.name,
            data: values
        };
    });

    return {
        labels: labels,
        datasets: datasets
    };
}

/**
 * Export analytics report
 * @param {Object} analytics - Analytics data
 * @returns {string} CSV formatted report
 */
function exportAnalyticsReport(analytics) {
    let csv = 'Investment Analytics Report\n';
    csv += `Generated: ${new Date().toLocaleString()}\n\n`;
    
    csv += 'Summary,\n';
    csv += `Total Invested,${formatCurrency(analytics.summary.totalInvested)}\n`;
    csv += `Total Value,${formatCurrency(analytics.summary.totalValue)}\n`;
    csv += `Total Returns,${formatCurrency(analytics.summary.totalReturns)}\n`;
    csv += `Average ROI,${analytics.summary.averageROI}%\n\n`;
    
    csv += 'Portfolios,\n';
    csv += 'Name,Invested,Value,Returns,ROI%\n';
    analytics.portfolios.forEach(p => {
        csv += `${p.name},${p.metrics.totalInvested},${p.metrics.currentValue},${p.metrics.returns},${p.metrics.roi}%\n`;
    });
    
    csv += '\nSIP Investments,\n';
    csv += 'Name,Monthly Amount,Period,Returns%,Total Invested,Maturity Value\n';
    analytics.sips.forEach(s => {
        csv += `${s.name},${s.monthlyAmount},${s.period} years,${s.expectedReturns}%,${s.result.totalInvested},${s.result.maturityValue}\n`;
    });
    
    return csv;
}

// Export functions
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        processAnalyticsData,
        generateSIPComparison,
        generateRiskReturnData,
        calculateAggregateStats,
        generateTimeSeriesData,
        exportAnalyticsReport
    };
}




