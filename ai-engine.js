// AI Recommendation Engine

/**
 * Assess risk profile from questionnaire answers
 * @param {Object} answers - Risk assessment answers
 * @returns {Object} Risk profile object
 */
function assessRiskProfile(answers) {
    let riskScore = 0;
    const weights = {
        timeHorizon: 2,
        riskTolerance: 3,
        investmentGoal: 2,
        lossTolerance: 3,
        knowledgeLevel: 1,
        experience: 1,
        incomeStability: 1
    };

    // Time Horizon scoring
    const timeHorizonScores = {
        'short': 1,
        'medium': 3,
        'long': 5,
        'very-long': 7
    };
    riskScore += (timeHorizonScores[answers.timeHorizon] || 3) * weights.timeHorizon;

    // Risk Tolerance scoring
    const riskToleranceScores = {
        'panic': 1,
        'concern': 3,
        'hold': 5,
        'buy': 7
    };
    riskScore += (riskToleranceScores[answers.riskTolerance] || 3) * weights.riskTolerance;

    // Investment Goal scoring
    const goalScores = {
        'capital-preservation': 1,
        'balanced-growth': 4,
        'aggressive-growth': 6,
        'max-returns': 8
    };
    riskScore += (goalScores[answers.investmentGoal] || 4) * weights.investmentGoal;

    // Loss Tolerance scoring
    const lossScores = {
        'low': 1,
        'moderate': 4,
        'high': 6,
        'very-high': 8
    };
    riskScore += (lossScores[answers.lossTolerance] || 4) * weights.lossTolerance;

    // Knowledge Level scoring
    const knowledgeScores = {
        'beginner': 2,
        'intermediate': 4,
        'advanced': 6,
        'expert': 7
    };
    riskScore += (knowledgeScores[answers.knowledgeLevel] || 4) * weights.knowledgeLevel;

    // Experience scoring
    const experienceScores = {
        'none': 2,
        'limited': 4,
        'moderate': 5,
        'extensive': 6
    };
    riskScore += (experienceScores[answers.experience] || 4) * weights.experience;

    // Income Stability scoring
    const stabilityScores = {
        'unstable': 3,
        'stable': 5,
        'very-stable': 6
    };
    riskScore += (stabilityScores[answers.incomeStability] || 5) * weights.incomeStability;

    // Normalize score (0-100 scale)
    const maxPossibleScore = Object.values(weights).reduce((sum, w) => sum + w * 8, 0);
    const normalizedScore = (riskScore / maxPossibleScore) * 100;

    // Determine risk level
    let riskLevel = 'Moderate';
    if (normalizedScore < 35) {
        riskLevel = 'Conservative';
    } else if (normalizedScore > 65) {
        riskLevel = 'Aggressive';
    }

    return {
        riskScore: round(normalizedScore, 1),
        riskLevel: riskLevel,
        answers: answers,
        assessedAt: new Date().toISOString()
    };
}

/**
 * Get AI recommendations based on risk profile and goals
 * @param {Object} riskProfile - Risk profile object
 * @param {Object} goals - Investment goals (optional)
 * @returns {Object} AI recommendations
 */
function getAIRecommendations(riskProfile, goals = {}) {
    if (!riskProfile || !riskProfile.riskLevel) {
        return getDefaultRecommendations();
    }

    const riskLevel = riskProfile.riskLevel.toLowerCase();
    const recommendations = {
        conservative: getConservativeRecommendations(goals),
        moderate: getModerateRecommendations(goals),
        aggressive: getAggressiveRecommendations(goals)
    };

    const baseRecommendations = recommendations[riskLevel] || recommendations.moderate;

    // Customize based on goals
    if (goals.goal) {
        baseRecommendations.goalSpecific = getGoalSpecificRecommendations(goals.goal, riskLevel);
    }

    if (goals.timeHorizon) {
        baseRecommendations.timeHorizonAdjustments = getTimeHorizonAdjustments(
            goals.timeHorizon,
            riskLevel
        );
    }

    baseRecommendations.riskProfile = riskProfile;
    baseRecommendations.summary = generateSummary(riskProfile, goals);

    return baseRecommendations;
}

/**
 * Get conservative investment recommendations
 */
function getConservativeRecommendations(goals) {
    return {
        summary: 'Based on your conservative risk profile, we recommend a balanced approach focusing on capital preservation with steady growth.',
        allocation: [
            'Allocate 40-50% to SIP/Mutual Funds (Large Cap & Balanced Funds)',
            'Invest 20-30% in Bonds and Fixed Income instruments',
            'Keep 15-20% in Stocks (Blue-chip only)',
            'Allocate 5-10% to Gold and Real Estate for diversification',
            'Maintain 5-10% as emergency fund'
        ],
        recommendations: [
            'Start with large-cap mutual funds for stability',
            'Consider Systematic Transfer Plans (STP) for gradual equity exposure',
            'Diversify across 3-5 different fund houses',
            'Review portfolio quarterly and rebalance if needed',
            'Consider tax-saving ELSS funds for additional benefits',
            'Avoid high-risk instruments like derivatives or penny stocks'
        ],
        expectedReturns: '8-12% annually',
        riskLevel: 'Low to Moderate'
    };
}

/**
 * Get moderate investment recommendations
 */
function getModerateRecommendations(goals) {
    return {
        summary: 'Your moderate risk profile suggests a balanced growth strategy with a mix of equity and debt instruments.',
        allocation: [
            'Allocate 40-50% to SIP/Mutual Funds (Mix of Large, Mid, and Small Cap)',
            'Invest 25-35% in Stocks and Equities',
            'Allocate 15-20% to Bonds and Fixed Income',
            'Keep 5-10% in Gold and Commodities',
            'Consider 5-10% in Real Estate or REITs'
        ],
        recommendations: [
            'Build a diversified portfolio across market caps',
            'Use SIPs for disciplined investing in equity funds',
            'Consider balanced/hybrid funds for automatic rebalancing',
            'Invest in index funds for lower costs',
            'Rebalance portfolio annually or when allocation drifts by 5%',
            'Consider sector-specific funds for tactical allocation',
            'Maintain 3-6 months expenses as emergency fund'
        ],
        expectedReturns: '12-15% annually',
        riskLevel: 'Moderate'
    };
}

/**
 * Get aggressive investment recommendations
 */
function getAggressiveRecommendations(goals) {
    return {
        summary: 'Your aggressive risk profile indicates you can handle market volatility. We recommend a growth-oriented portfolio with higher equity exposure.',
        allocation: [
            'Allocate 30-40% to SIP/Mutual Funds (Focus on Mid and Small Cap)',
            'Invest 45-55% in Stocks and Equities',
            'Keep 10-15% in Bonds for stability',
            'Allocate 5-10% in Gold for hedging',
            'Consider 5% in alternative investments (Real Estate, etc.)'
        ],
        recommendations: [
            'Focus on growth-oriented equity funds and direct stocks',
            'Consider small-cap and mid-cap funds for higher returns',
            'Use sector rotation strategy for tactical gains',
            'Consider international funds for global diversification',
            'Monitor portfolio more frequently (monthly)',
            'Be prepared for higher volatility and short-term losses',
            'Maintain 3-6 months expenses as emergency fund',
            'Consider systematic profit booking at regular intervals'
        ],
        expectedReturns: '15-18%+ annually',
        riskLevel: 'High'
    };
}

/**
 * Get goal-specific recommendations
 */
function getGoalSpecificRecommendations(goal, riskLevel) {
    const goalRecommendations = {
        retirement: {
            recommendations: [
                'Start early with long-term SIPs in equity funds',
                'Increase allocation to debt instruments as retirement approaches',
                'Consider retirement-focused mutual funds',
                'Plan for 25-30x annual expenses as retirement corpus',
                'Review and adjust strategy every 5 years'
            ],
            timeline: '15-30 years',
            corpus: 'Large corpus needed'
        },
        education: {
            recommendations: [
                'Use child education plans or SIPs in equity funds',
                'Consider education-focused savings schemes',
                'Start early to benefit from compounding',
                'Plan for inflation in education costs (6-8% annually)',
                'Consider international education funds if planning abroad'
            ],
            timeline: '10-18 years',
            corpus: 'Moderate to large corpus'
        },
        house: {
            recommendations: [
                'Use balanced funds for medium-term growth',
                'Consider debt funds as down payment approaches',
                'Plan for 20-30% down payment plus additional costs',
                'Account for real estate price appreciation',
                'Consider home loan prepayment strategy'
            ],
            timeline: '5-10 years',
            corpus: 'Moderate corpus'
        },
        vacation: {
            recommendations: [
                'Use short to medium-term debt or balanced funds',
                'Consider liquid funds for short-term goals',
                'Avoid high-risk investments for near-term goals',
                'Plan for currency fluctuations if traveling abroad'
            ],
            timeline: '1-3 years',
            corpus: 'Small to moderate corpus'
        },
        emergency: {
            recommendations: [
                'Use liquid funds or high-yield savings accounts',
                'Maintain 6-12 months of expenses',
                'Keep funds easily accessible',
                'Avoid locking in for long periods',
                'Consider arbitrage funds for slightly higher returns'
            ],
            timeline: 'Immediate access needed',
            corpus: 'Small corpus'
        },
        'wealth-building': {
            recommendations: [
                'Focus on equity funds and direct stocks',
                'Use SIPs for disciplined wealth creation',
                'Consider international diversification',
                'Reinvest dividends and returns for compounding',
                'Review and rebalance quarterly'
            ],
            timeline: '10+ years',
            corpus: 'Large corpus target'
        }
    };

    return goalRecommendations[goal] || goalRecommendations['wealth-building'];
}

/**
 * Get time horizon adjustments
 */
function getTimeHorizonAdjustments(timeHorizon, riskLevel) {
    const adjustments = [];

    if (timeHorizon < 5) {
        adjustments.push('Short-term: Reduce equity allocation by 10-15%');
        adjustments.push('Focus on debt funds and liquid instruments');
        adjustments.push('Avoid high-volatility investments');
    } else if (timeHorizon >= 15) {
        adjustments.push('Long-term: Can increase equity allocation by 10-15%');
        adjustments.push('Benefit from market cycles and compounding');
        adjustments.push('Consider aggressive growth funds');
    } else {
        adjustments.push('Medium-term: Maintain balanced allocation');
        adjustments.push('Regular monitoring and rebalancing recommended');
    }

    return adjustments;
}

/**
 * Get recommended allocation percentages
 */
function getRecommendedAllocation(riskProfile) {
    if (!riskProfile || !riskProfile.riskLevel) {
        return getRecommendedAllocation({ riskLevel: 'Moderate' });
    }

    return getRecommendedAllocation(riskProfile.riskLevel);
}

/**
 * Generate AI summary
 */
function generateSummary(riskProfile, goals) {
    const riskLevel = riskProfile.riskLevel || 'Moderate';
    let summary = `Based on your ${riskLevel} risk profile`;

    if (goals.goal) {
        summary += ` and ${goals.goal} goal`;
    }

    if (goals.timeHorizon) {
        summary += ` with a ${goals.timeHorizon}-year time horizon`;
    }

    summary += ', we recommend a diversified investment strategy that balances growth potential with risk management.';

    return summary;
}

/**
 * Get default recommendations
 */
function getDefaultRecommendations() {
    return {
        summary: 'Please complete the risk assessment to get personalized recommendations.',
        allocation: [],
        recommendations: [
            'Complete the risk assessment questionnaire',
            'Define your investment goals',
            'Determine your time horizon',
            'Start with SIPs for disciplined investing'
        ],
        expectedReturns: 'Varies based on risk profile',
        riskLevel: 'Not Assessed'
    };
}

/**
 * Get investment insights based on market conditions (simulated)
 */
function getMarketInsights() {
    // This would typically fetch real market data
    // For now, providing general insights
    return {
        equityMarket: {
            status: 'Moderate',
            recommendation: 'Good time to continue SIP investments',
            note: 'Market volatility presents opportunities for long-term investors'
        },
        debtMarket: {
            status: 'Stable',
            recommendation: 'Consider debt funds for stability',
            note: 'Interest rates are relatively stable'
        },
        gold: {
            status: 'Stable',
            recommendation: 'Maintain 5-10% allocation',
            note: 'Gold serves as a hedge against inflation'
        }
    };
}

/**
 * Get personalized tips based on profile
 */
function getPersonalizedTips(riskProfile, goals) {
    const tips = [];

    if (riskProfile.riskLevel === 'Conservative') {
        tips.push('Focus on capital preservation while aiming for steady growth');
        tips.push('Consider increasing SIP amounts gradually as you get comfortable');
        tips.push('Avoid making emotional decisions during market volatility');
    } else if (riskProfile.riskLevel === 'Aggressive') {
        tips.push('Monitor your portfolio more frequently');
        tips.push('Be prepared for short-term volatility');
        tips.push('Consider systematic profit booking at regular intervals');
    }

    if (goals.timeHorizon && goals.timeHorizon < 5) {
        tips.push('For short-term goals, prioritize capital preservation');
    }

    if (goals.timeHorizon && goals.timeHorizon > 15) {
        tips.push('Long-term horizon allows you to take advantage of market cycles');
        tips.push('Focus on wealth creation through equity investments');
    }

    return tips.length > 0 ? tips : ['Stay disciplined with your SIPs', 'Review your portfolio periodically'];
}

// Export functions
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        assessRiskProfile,
        getAIRecommendations,
        getRecommendedAllocation,
        getMarketInsights,
        getPersonalizedTips
    };
}




