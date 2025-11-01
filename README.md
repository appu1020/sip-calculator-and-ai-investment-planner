# AI-Enhanced SIP Calculator and Investment Planner

A comprehensive web application for SIP (Systematic Investment Plan) calculations and investment planning with AI-powered recommendations and interactive analytics.

## Features

### 🧮 SIP Calculator
- Real-time SIP calculations with accurate formulas
- Growth projections over time
- Year-wise breakdown analysis
- Multiple scenario comparison
- Save and load investment scenarios

### 📊 Investment Planner
- Multi-asset portfolio planning
- Support for:
  - SIP/Mutual Funds
  - Stocks/Equities
  - Bonds/Fixed Income
  - Real Estate
  - Gold/Commodities
- Goal-based planning (Retirement, Education, House, etc.)
- Portfolio allocation recommendations
- Risk assessment questionnaire

### 🤖 AI-Powered Recommendations
- Risk profile assessment (Conservative, Moderate, Aggressive)
- Personalized investment recommendations
- Goal-specific suggestions
- Time horizon analysis
- Market insights and tips

### 📈 Analytics & Charts
- Growth projection charts (Line charts)
- Returns breakdown (Doughnut charts)
- Portfolio allocation visualization (Pie charts)
- Year-wise growth analysis (Bar charts)
- SIP comparison charts
- Risk-return scatter plots
- Interactive data tables

### 💾 Data Management
- Local storage for saving portfolios and scenarios
- Export data to CSV
- Import/export functionality
- Data persistence across sessions

### 🎨 Modern UI/UX
- Responsive design (Mobile, Tablet, Desktop)
- Dark/Light theme toggle
- Modern, clean interface
- Interactive charts and visualizations
- Print-friendly reports

## File Structure

```
investment-planner/
├── index.html              # Main dashboard
├── calculator.html         # SIP calculator page
├── planner.html           # Portfolio planner page
├── analytics.html         # Analytics dashboard
├── css/
│   ├── style.css          # Main stylesheet
│   └── themes.css         # Theme support (dark/light)
├── js/
│   ├── utils.js           # Utility functions
│   ├── storage.js         # LocalStorage management
│   ├── calculator.js      # SIP calculation logic
│   ├── planner.js         # Portfolio planning functions
│   ├── ai-engine.js       # AI recommendation engine
│   ├── charts.js          # Chart.js integration
│   └── analytics.js       # Analytics data processing
└── README.md              # This file
```

## How to Use

### Getting Started
1. Open `index.html` in a modern web browser
2. Navigate through the different sections using the navigation menu
3. Start by taking the risk assessment to get personalized recommendations

### SIP Calculator
1. Go to the Calculator page
2. Enter your monthly investment amount
3. Set the investment period in years
4. Enter expected annual returns
5. Click "Calculate" to see results
6. Save scenarios for future reference

### Portfolio Planner
1. Navigate to the Portfolio Planner
2. Complete the risk assessment if prompted
3. Create a new portfolio with your investment goals
4. Set allocations for different asset classes
5. Get AI recommendations based on your risk profile
6. View portfolio charts and analytics

### Analytics
1. Go to the Analytics page
2. View comprehensive charts and visualizations
3. Compare multiple SIP scenarios
4. Export data for external analysis
5. Review portfolio performance metrics

## Technologies Used

- **HTML5** - Structure and semantic markup
- **CSS3** - Styling with modern features (Grid, Flexbox, Variables)
- **JavaScript (ES6+)** - Core functionality and logic
- **Chart.js** - Interactive chart library
- **LocalStorage API** - Client-side data persistence

## SIP Calculation Formula

The application uses the standard SIP formula:

```
FV = P × [((1 + r)^n - 1) / r] × (1 + r)
```

Where:
- P = Monthly investment amount
- r = Monthly interest rate (annual rate / 12)
- n = Number of months

## Browser Compatibility

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Data Storage

All data is stored locally in your browser using the LocalStorage API. This means:
- Your data stays private and secure
- No server or internet connection required after initial load
- Data persists across browser sessions
- Clearing browser data will reset the application

## Features in Detail

### Risk Assessment
Complete a 7-question questionnaire to determine your risk profile:
- Investment time horizon
- Risk tolerance
- Investment goals
- Loss tolerance
- Knowledge level
- Experience
- Income stability

### AI Recommendations
Based on your risk profile, the AI engine provides:
- Personalized asset allocation
- Investment strategy suggestions
- Goal-specific recommendations
- Time horizon adjustments
- Market insights

### Charts and Visualizations
- **Growth Projection**: See how your investment grows over time
- **Returns Breakdown**: Visualize principal vs returns
- **Portfolio Allocation**: Pie chart of asset distribution
- **Year-wise Growth**: Bar chart showing annual progress
- **Comparison Charts**: Compare multiple SIP scenarios
- **Risk-Return Analysis**: Scatter plot of risk vs returns

## Future Enhancements

Potential features for future versions:
- Real-time market data integration
- Advanced portfolio optimization algorithms
- Email reports and notifications
- Mobile app version
- Multi-currency support
- Tax calculation and optimization
- Goal tracking and reminders

## License

This project is open source and available for personal and educational use.

## Disclaimer

This application is for educational and planning purposes only. Investment decisions should be made after consulting with qualified financial advisors. Past performance does not guarantee future returns.

## Support

For issues, questions, or suggestions, please refer to the project documentation or create an issue in the repository.

---

**Note**: This is a client-side application. No data is sent to external servers. All calculations and data storage happen locally in your browser.




