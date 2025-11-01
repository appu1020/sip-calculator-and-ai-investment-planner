// Utility functions for the Investment Planner

// Generate unique ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Format currency (Indian Rupees)
function formatCurrency(amount) {
    if (amount === null || amount === undefined || isNaN(amount)) {
        return '₹0';
    }
    return '₹' + amount.toLocaleString('en-IN', { maximumFractionDigits: 0, minimumFractionDigits: 0 });
}

// Format currency with decimals
function formatCurrencyDecimal(amount) {
    if (amount === null || amount === undefined || isNaN(amount)) {
        return '₹0.00';
    }
    return '₹' + amount.toLocaleString('en-IN', { maximumFractionDigits: 2, minimumFractionDigits: 2 });
}

// Format percentage
function formatPercentage(value, decimals = 2) {
    if (value === null || value === undefined || isNaN(value)) {
        return '0%';
    }
    return value.toFixed(decimals) + '%';
}

// Format date
function formatDate(date) {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Validate number input
function validateNumber(value, min = 0, max = Infinity) {
    const num = parseFloat(value);
    if (isNaN(num) || num < min || num > max) {
        return false;
    }
    return num;
}

// Calculate months from years
function yearsToMonths(years) {
    return years * 12;
}

// Calculate annual rate to monthly rate
function annualToMonthlyRate(annualRate) {
    return annualRate / 100 / 12;
}

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Round to 2 decimal places
function round(value, decimals = 2) {
    return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

// Export data to CSV
function exportToCSV(data, filename = 'export.csv') {
    let csv = '';
    
    if (Array.isArray(data) && data.length > 0) {
        // If data is array of objects, use keys as headers
        const headers = Object.keys(data[0]);
        csv += headers.join(',') + '\n';
        
        data.forEach(row => {
            const values = headers.map(header => {
                const value = row[header];
                // Handle commas and quotes in values
                if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
                    return '"' + value.replace(/"/g, '""') + '"';
                }
                return value;
            });
            csv += values.join(',') + '\n';
        });
    } else if (typeof data === 'string') {
        csv = data;
    }
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Download data as JSON
function exportToJSON(data, filename = 'export.json') {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Get current year
function getCurrentYear() {
    return new Date().getFullYear();
}

// Calculate age from date
function calculateAge(birthDate) {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    return age;
}

// Validate email
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Show notification (simple alert for now, can be enhanced)
function showNotification(message, type = 'info') {
    // This can be enhanced with a toast notification library
    console.log(`[${type.toUpperCase()}] ${message}`);
}

// Calculate compound interest
function calculateCompoundInterest(principal, rate, time, n = 12) {
    // A = P(1 + r/n)^(nt)
    return principal * Math.pow(1 + (rate / 100) / n, n * time);
}

// Calculate simple interest
function calculateSimpleInterest(principal, rate, time) {
    // I = P * r * t
    return principal * (rate / 100) * time;
}

// Parse number from input
function parseNumber(value, defaultValue = 0) {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? defaultValue : parsed;
}

// Clamp value between min and max
function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

// Get color based on value (green for positive, red for negative)
function getValueColor(value) {
    return value >= 0 ? 'success' : 'error';
}

// Format large numbers with K, M, B suffixes
function formatLargeNumber(value) {
    if (value >= 1000000000) {
        return (value / 1000000000).toFixed(2) + 'B';
    } else if (value >= 1000000) {
        return (value / 1000000).toFixed(2) + 'M';
    } else if (value >= 1000) {
        return (value / 1000).toFixed(2) + 'K';
    }
    return value.toFixed(2);
}




