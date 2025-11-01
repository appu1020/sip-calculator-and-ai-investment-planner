// Portfolio Planner Functions

/**
 * Calculate portfolio value
 * @param {Object} portfolio - Portfolio object with assets
 * @returns {number} Total invested amount
 */
function calculatePortfolioValue(portfolio) {
    let totalInvested = 0;
    
    if (portfolio.assets) {
        // Calculate total invested from all asset classes
        Object.keys(portfolio.assets).forEach(assetType => {
            const asset = portfolio.assets[assetType];
            if (asset.amount) {
                totalInvested += asset.amount;
            }
        });
    }
    
    return round(totalInvested, 2);
}

/**
 * Calculate portfolio returns and current value
 * @param {Object} portfolio - Portfolio object
 * @returns {number} Current portfolio value
 */
function calculatePortfolioReturns(portfolio) {
    if (!portfolio.assets || !portfolio.timeHorizon) {
        return 0;
    }

    let currentValue = 0;
    const years = portfolio.timeHorizon;

    // Calculate returns for each asset class
    Object.keys(portfolio.assets).forEach(assetType => {
        const asset = portfolio.assets[assetType];
        if (asset.amount && asset.returns) {
            const annualRate = asset.returns / 100;
            
            // For SIP-type investments, use SIP formula
            if (assetType === 'sip' && asset.amount > 0) {
                const sipResult = calculateSIP(asset.amount, years, asset.returns * 100);
                currentValue += sipResult.maturityValue;
            } else {
                // For lump sum investments, use compound interest
                const futureValue = asset.amount * Math.pow(1 + annualRate, years);
                currentValue += futureValue;
            }
        }
    });

    return round(currentValue, 2);
}

/**
 * Calculate weighted average return for portfolio
 * @param {Object} portfolio - Portfolio object
 * @returns {number} Weighted average return percentage
 */
function calculateWeightedAverageReturn(portfolio) {
    if (!portfolio.assets) {
        return 0;
    }

    let totalAllocation = 0;
    let weightedReturn = 0;

    Object.keys(portfolio.assets).forEach(assetType => {
        const asset = portfolio.assets[assetType];
        if (asset.allocation && asset.returns) {
            totalAllocation += asset.allocation;
            weightedReturn += (asset.allocation / 100) * asset.returns;
        }
    });

    if (totalAllocation === 0) {
        return 0;
    }

    return round(weightedReturn, 2);
}

/**
 * Calculate portfolio risk score (1-10 scale)
 * @param {Object} portfolio - Portfolio object
 * @returns {number} Risk score (1 = low risk, 10 = high risk)
 */
function calculatePortfolioRisk(portfolio) {
    if (!portfolio.assets) {
        return 5; // Default moderate risk
    }

    // Risk scores for different asset classes
    const riskScores = {
        sip: 5,
        stocks: 8,
        bonds: 3,
        realestate: 4,
        gold: 4,
        emergency: 1
    };

    let weightedRisk = 0;
    let totalAllocation = 0;

    Object.keys(portfolio.assets).forEach(assetType => {
        const asset = portfolio.assets[assetType];
        if (asset.allocation) {
            const riskScore = riskScores[assetType] || 5;
            weightedRisk += (asset.allocation / 100) * riskScore;
            totalAllocation += asset.allocation;
        }
    });

    if (totalAllocation === 0) {
        return 5;
    }

    return round(weightedRisk, 1);
}

/**
 * Validate portfolio allocation (should sum to 100%)
 * @param {Object} portfolio - Portfolio object
 * @returns {Object} Validation result
 */
function validatePortfolioAllocation(portfolio) {
    if (!portfolio.assets) {
        return { valid: false, message: 'Portfolio has no assets' };
    }

    let totalAllocation = 0;
    Object.keys(portfolio.assets).forEach(assetType => {
        const asset = portfolio.assets[assetType];
        if (asset.allocation) {
            totalAllocation += asset.allocation;
        }
    });

    if (Math.abs(totalAllocation - 100) > 0.01) {
        return {
            valid: false,
            message: `Total allocation is ${totalAllocation.toFixed(2)}%. It should be 100%.`,
            totalAllocation: round(totalAllocation, 2)
        };
    }

    return { valid: true, totalAllocation: 100 };
}

/**
 * Calculate goal progress
 * @param {Object} portfolio - Portfolio object with target amount
 * @returns {Object} Progress information
 */
function calculateGoalProgress(portfolio) {
    if (!portfolio.targetAmount || portfolio.targetAmount <= 0) {
        return null;
    }

    const currentValue = calculatePortfolioReturns(portfolio);
    const progress = (currentValue / portfolio.targetAmount) * 100;
    const remaining = Math.max(0, portfolio.targetAmount - currentValue);
    const isAchieved = currentValue >= portfolio.targetAmount;

    return {
        currentValue: round(currentValue, 2),
        targetAmount: round(portfolio.targetAmount, 2),
        progress: round(progress, 2),
        remaining: round(remaining, 2),
        isAchieved: isAchieved
    };
}

/**
 * Get recommended allocation based on risk profile
 * @param {string} riskLevel - Risk level (Conservative, Moderate, Aggressive)
 * @returns {Object} Recommended allocation percentages
 */
function getRecommendedAllocation(riskLevel) {
    const allocations = {
        conservative: {
            sip: 40,
            stocks: 20,
            bonds: 30,
            realestate: 5,
            gold: 5
        },
        moderate: {
            sip: 40,
            stocks: 30,
            bonds: 20,
            realestate: 5,
            gold: 5
        },
        aggressive: {
            sip: 30,
            stocks: 50,
            bonds: 10,
            realestate: 5,
            gold: 5
        }
    };

    const level = riskLevel.toLowerCase();
    return allocations[level] || allocations.moderate;
}

/**
 * Calculate monthly investment needed to reach goal
 * @param {number} targetAmount - Target amount
 * @param {number} years - Time horizon
 * @param {number} expectedReturns - Expected annual returns percentage
 * @returns {number} Required monthly investment
 */
function calculateRequiredMonthlyInvestment(targetAmount, years, expectedReturns) {
    return calculateRequiredSIP(targetAmount, years, expectedReturns);
}

/**
 * Optimize portfolio allocation based on constraints
 * @param {Object} constraints - Investment constraints
 * @returns {Object} Optimized allocation
 */
function optimizePortfolioAllocation(constraints) {
    // Simple optimization: maximize returns while respecting risk tolerance
    const riskTolerance = constraints.riskTolerance || 'moderate';
    const allocation = getRecommendedAllocation(riskTolerance);
    
    // Adjust based on time horizon
    if (constraints.timeHorizon) {
        if (constraints.timeHorizon < 5) {
            // Short term: more conservative
            allocation.stocks = Math.max(10, allocation.stocks - 10);
            allocation.bonds = Math.min(40, allocation.bonds + 10);
        } else if (constraints.timeHorizon > 15) {
            // Long term: more aggressive
            allocation.stocks = Math.min(60, allocation.stocks + 10);
            allocation.bonds = Math.max(10, allocation.bonds - 10);
        }
    }

    // Normalize to ensure total is 100%
    const total = Object.values(allocation).reduce((sum, val) => sum + val, 0);
    if (total !== 100) {
        Object.keys(allocation).forEach(key => {
            allocation[key] = round((allocation[key] / total) * 100, 0);
        });
    }

    return allocation;
}

/**
 * Calculate portfolio performance metrics
 * @param {Object} portfolio - Portfolio object
 * @returns {Object} Performance metrics
 */
function calculatePortfolioMetrics(portfolio) {
    const totalInvested = calculatePortfolioValue(portfolio);
    const currentValue = calculatePortfolioReturns(portfolio);
    const returns = currentValue - totalInvested;
    const roi = totalInvested > 0 ? (returns / totalInvested) * 100 : 0;
    const weightedReturn = calculateWeightedAverageReturn(portfolio);
    const riskScore = calculatePortfolioRisk(portfolio);
    const goalProgress = calculateGoalProgress(portfolio);

    return {
        totalInvested: round(totalInvested, 2),
        currentValue: round(currentValue, 2),
        returns: round(returns, 2),
        roi: round(roi, 2),
        weightedAverageReturn: weightedReturn,
        riskScore: riskScore,
        goalProgress: goalProgress
    };
}

// Export functions
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        calculatePortfolioValue,
        calculatePortfolioReturns,
        calculateWeightedAverageReturn,
        calculatePortfolioRisk,
        validatePortfolioAllocation,
        calculateGoalProgress,
        getRecommendedAllocation,
        calculateRequiredMonthlyInvestment,
        optimizePortfolioAllocation,
        calculatePortfolioMetrics
    };
}




