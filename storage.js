// Storage utility functions using localStorage

// Get data from localStorage
function getStorageData(key) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error(`Error reading from localStorage for key "${key}":`, error);
        return null;
    }
}

// Set data to localStorage
function setStorageData(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        console.error(`Error writing to localStorage for key "${key}":`, error);
        return false;
    }
}

// Remove data from localStorage
function removeStorageData(key) {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (error) {
        console.error(`Error removing from localStorage for key "${key}":`, error);
        return false;
    }
}

// Save SIP scenario
function saveSIPScenario(scenario) {
    const scenarios = getStorageData('sipScenarios') || [];
    scenarios.push(scenario);
    setStorageData('sipScenarios', scenarios);
    return true;
}

// Get all SIP scenarios
function getSIPScenarios() {
    return getStorageData('sipScenarios') || [];
}

// Delete SIP scenario
function deleteSIPScenario(index) {
    const scenarios = getSIPScenarios();
    if (index >= 0 && index < scenarios.length) {
        scenarios.splice(index, 1);
        setStorageData('sipScenarios', scenarios);
        return true;
    }
    return false;
}

// Save portfolio
function savePortfolio(portfolio) {
    const portfolios = getStorageData('portfolios') || [];
    
    // Check if portfolio with same ID exists
    const existingIndex = portfolios.findIndex(p => p.id === portfolio.id);
    
    if (existingIndex >= 0) {
        portfolios[existingIndex] = portfolio;
    } else {
        portfolios.push(portfolio);
    }
    
    setStorageData('portfolios', portfolios);
    return true;
}

// Get all portfolios
function getPortfolios() {
    return getStorageData('portfolios') || [];
}

// Get portfolio by ID
function getPortfolioById(id) {
    const portfolios = getPortfolios();
    return portfolios.find(p => p.id === id) || null;
}

// Delete portfolio
function deletePortfolio(id) {
    const portfolios = getPortfolios();
    const filtered = portfolios.filter(p => p.id !== id);
    setStorageData('portfolios', filtered);
    return true;
}

// Save risk profile
function saveRiskProfile(profile) {
    setStorageData('riskProfile', profile);
    return true;
}

// Get risk profile
function getRiskProfile() {
    return getStorageData('riskProfile') || null;
}

// Clear all data (use with caution)
function clearAllData() {
    localStorage.clear();
    return true;
}

// Export all data
function exportAllData() {
    const data = {
        sipScenarios: getSIPScenarios(),
        portfolios: getPortfolios(),
        riskProfile: getRiskProfile(),
        comparisonSIPs: getStorageData('comparisonSIPs') || [],
        exportDate: new Date().toISOString()
    };
    return data;
}

// Import data
function importData(data) {
    try {
        if (data.sipScenarios) {
            setStorageData('sipScenarios', data.sipScenarios);
        }
        if (data.portfolios) {
            setStorageData('portfolios', data.portfolios);
        }
        if (data.riskProfile) {
            setStorageData('riskProfile', data.riskProfile);
        }
        if (data.comparisonSIPs) {
            setStorageData('comparisonSIPs', data.comparisonSIPs);
        }
        return true;
    } catch (error) {
        console.error('Error importing data:', error);
        return false;
    }
}

// Get storage size (approximate)
function getStorageSize() {
    let total = 0;
    for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
            total += localStorage[key].length + key.length;
        }
    }
    return total;
}

// Check if storage is available
function isStorageAvailable() {
    try {
        const test = '__storage_test__';
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
    } catch (e) {
        return false;
    }
}

// Get data size in KB
function getStorageSizeKB() {
    return (getStorageSize() / 1024).toFixed(2);
}




