// SIP Calculator Functions

/**
 * Calculate SIP (Systematic Investment Plan)
 * Formula: FV = P × [((1 + r)^n - 1) / r] × (1 + r)
 * Where:
 * P = Monthly investment amount
 * r = Monthly interest rate (annual rate / 12)
 * n = Number of months
 * 
 * @param {number} monthlyAmount - Monthly investment amount
 * @param {number} years - Investment period in years
 * @param {number} annualReturns - Expected annual returns percentage
 * @returns {Object} Calculation results
 */
function calculateSIP(monthlyAmount, years, annualReturns) {
    // Validate inputs
    if (!monthlyAmount || monthlyAmount < 0) {
        throw new Error('Monthly amount must be a positive number');
    }
    if (!years || years < 0) {
        throw new Error('Years must be a positive number');
    }
    if (!annualReturns || annualReturns < 0) {
        throw new Error('Annual returns must be a positive number');
    }

    const months = yearsToMonths(years);
    const monthlyRate = annualToMonthlyRate(annualReturns);
    const totalInvested = monthlyAmount * months;

    // Calculate future value using SIP formula
    // FV = P × [((1 + r)^n - 1) / r] × (1 + r)
    let futureValue = 0;
    
    if (monthlyRate > 0) {
        const numerator = Math.pow(1 + monthlyRate, months) - 1;
        futureValue = monthlyAmount * (numerator / monthlyRate) * (1 + monthlyRate);
    } else {
        // If rate is 0, it's just the sum of all investments
        futureValue = totalInvested;
    }

    const returns = futureValue - totalInvested;
    const returnPercentage = (returns / totalInvested) * 100;

    return {
        monthlyAmount: round(monthlyAmount, 2),
        years: years,
        months: months,
        annualReturns: round(annualReturns, 2),
        monthlyRate: round(monthlyRate, 6),
        totalInvested: round(totalInvested, 2),
        maturityValue: round(futureValue, 2),
        returns: round(returns, 2),
        returnPercentage: round(returnPercentage, 2)
    };
}

/**
 * Calculate SIP value at a specific point in time
 * @param {number} monthlyAmount - Monthly investment amount
 * @param {number} months - Number of months invested
 * @param {number} monthlyRate - Monthly interest rate
 * @returns {number} Current value
 */
function calculateSIPValue(monthlyAmount, months, monthlyRate) {
    if (monthlyRate > 0) {
        const numerator = Math.pow(1 + monthlyRate, months) - 1;
        return monthlyAmount * (numerator / monthlyRate) * (1 + monthlyRate);
    }
    return monthlyAmount * months;
}

/**
 * Calculate year-wise SIP growth
 * @param {number} monthlyAmount - Monthly investment amount
 * @param {number} years - Total years
 * @param {number} annualReturns - Annual returns percentage
 * @returns {Array} Year-wise data
 */
function calculateYearlyGrowth(monthlyAmount, years, annualReturns) {
    const monthlyRate = annualToMonthlyRate(annualReturns);
    const yearlyData = [];

    for (let year = 1; year <= years; year++) {
        const months = year * 12;
        const invested = monthlyAmount * 12;
        const totalInvested = monthlyAmount * months;
        const currentValue = calculateSIPValue(monthlyAmount, months, monthlyRate);
        const returns = currentValue - totalInvested;
        const returnPercentage = totalInvested > 0 ? (returns / totalInvested) * 100 : 0;

        yearlyData.push({
            year: year,
            invested: round(invested, 2),
            totalInvested: round(totalInvested, 2),
            currentValue: round(currentValue, 2),
            returns: round(returns, 2),
            returnPercentage: round(returnPercentage, 2)
        });
    }

    return yearlyData;
}

/**
 * Calculate SIP for multiple scenarios (comparison)
 * @param {Array} scenarios - Array of SIP scenarios
 * @returns {Array} Array of calculation results
 */
function calculateMultipleSIPs(scenarios) {
    return scenarios.map(scenario => {
        const result = calculateSIP(
            scenario.amount || scenario.monthlyAmount,
            scenario.period || scenario.years,
            scenario.returns || scenario.expectedReturns
        );
        return {
            name: scenario.name || 'SIP ' + scenarios.indexOf(scenario) + 1,
            ...result
        };
    });
}

/**
 * Calculate SIP projections over time (for charts)
 * @param {number} monthlyAmount - Monthly investment amount
 * @param {number} years - Total years
 * @param {number} annualReturns - Annual returns percentage
 * @param {number} interval - Data point interval in months (default: 6)
 * @returns {Object} Chart data with labels and values
 */
function calculateSIPProjections(monthlyAmount, years, annualReturns, interval = 6) {
    const monthlyRate = annualToMonthlyRate(annualReturns);
    const totalMonths = yearsToMonths(years);
    const labels = [];
    const investedValues = [];
    const maturityValues = [];
    const returnValues = [];

    for (let month = interval; month <= totalMonths; month += interval) {
        const year = (month / 12).toFixed(1);
        labels.push(`Year ${year}`);
        
        const totalInvested = monthlyAmount * month;
        const currentValue = calculateSIPValue(monthlyAmount, month, monthlyRate);
        const returns = currentValue - totalInvested;

        investedValues.push(round(totalInvested, 2));
        maturityValues.push(round(currentValue, 2));
        returnValues.push(round(returns, 2));
    }

    // Add final point if not already included
    if (totalMonths % interval !== 0) {
        labels.push(`Year ${years}`);
        const totalInvested = monthlyAmount * totalMonths;
        const currentValue = calculateSIPValue(monthlyAmount, totalMonths, monthlyRate);
        const returns = currentValue - totalInvested;
        investedValues.push(round(totalInvested, 2));
        maturityValues.push(round(currentValue, 2));
        returnValues.push(round(returns, 2));
    }

    return {
        labels: labels,
        invested: investedValues,
        maturity: maturityValues,
        returns: returnValues
    };
}

/**
 * Calculate required monthly SIP to reach target amount
 * @param {number} targetAmount - Target maturity amount
 * @param {number} years - Investment period in years
 * @param {number} annualReturns - Expected annual returns percentage
 * @returns {number} Required monthly SIP amount
 */
function calculateRequiredSIP(targetAmount, years, annualReturns) {
    const months = yearsToMonths(years);
    const monthlyRate = annualToMonthlyRate(annualReturns);

    if (monthlyRate > 0) {
        const numerator = Math.pow(1 + monthlyRate, months) - 1;
        const denominator = (numerator / monthlyRate) * (1 + monthlyRate);
        return round(targetAmount / denominator, 2);
    }
    
    // If rate is 0, just divide target by months
    return round(targetAmount / months, 2);
}

/**
 * Calculate time required to reach target with given SIP
 * @param {number} monthlyAmount - Monthly investment amount
 * @param {number} targetAmount - Target maturity amount
 * @param {number} annualReturns - Expected annual returns percentage
 * @returns {number} Required years
 */
function calculateRequiredTime(monthlyAmount, targetAmount, annualReturns) {
    const monthlyRate = annualToMonthlyRate(annualReturns);
    
    if (monthlyRate > 0) {
        // Rearranging the SIP formula to solve for n
        // FV = P × [((1 + r)^n - 1) / r] × (1 + r)
        // Solving for n requires iterative approach or logarithms
        
        // Using approximation: n ≈ log((FV × r / P) + 1) / log(1 + r)
        const ratio = (targetAmount * monthlyRate) / (monthlyAmount * (1 + monthlyRate)) + 1;
        const months = Math.log(ratio) / Math.log(1 + monthlyRate);
        return round(months / 12, 2);
    }
    
    // If rate is 0, just divide target by monthly amount
    return round(targetAmount / (monthlyAmount * 12), 2);
}

/**
 * Calculate lump sum investment returns
 * @param {number} principal - Initial investment amount
 * @param {number} years - Investment period in years
 * @param {number} annualReturns - Expected annual returns percentage
 * @returns {Object} Calculation results
 */
function calculateLumpSum(principal, years, annualReturns) {
    const annualRate = annualReturns / 100;
    const futureValue = principal * Math.pow(1 + annualRate, years);
    const returns = futureValue - principal;
    const returnPercentage = (returns / principal) * 100;

    return {
        principal: round(principal, 2),
        years: years,
        annualReturns: round(annualReturns, 2),
        maturityValue: round(futureValue, 2),
        returns: round(returns, 2),
        returnPercentage: round(returnPercentage, 2)
    };
}

/**
 * Compare SIP vs Lump Sum investment
 * @param {number} monthlySIP - Monthly SIP amount
 * @param {number} lumpSumAmount - Lump sum amount
 * @param {number} years - Investment period
 * @param {number} annualReturns - Expected annual returns
 * @returns {Object} Comparison results
 */
function compareSIPvsLumpSum(monthlySIP, lumpSumAmount, years, annualReturns) {
    const sipResult = calculateSIP(monthlySIP, years, annualReturns);
    const lumpSumResult = calculateLumpSum(lumpSumAmount, years, annualReturns);
    const totalSIPInvested = monthlySIP * yearsToMonths(years);

    return {
        sip: sipResult,
        lumpSum: lumpSumResult,
        sipTotalInvested: totalSIPInvested,
        comparison: {
            sipMaturity: sipResult.maturityValue,
            lumpSumMaturity: lumpSumResult.maturityValue,
            difference: round(sipResult.maturityValue - lumpSumResult.maturityValue, 2),
            winner: sipResult.maturityValue > lumpSumResult.maturityValue ? 'SIP' : 'Lump Sum'
        }
    };
}

// Export functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        calculateSIP,
        calculateSIPValue,
        calculateYearlyGrowth,
        calculateMultipleSIPs,
        calculateSIPProjections,
        calculateRequiredSIP,
        calculateRequiredTime,
        calculateLumpSum,
        compareSIPvsLumpSum
    };
}




