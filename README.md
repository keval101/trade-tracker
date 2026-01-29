# 📈 Trade Tracker - Paper Trading Platform

A comprehensive Angular-based paper trading platform for tracking and analyzing your trading performance. Built with a modern dark theme UI, real-time market data integration, and powerful analytics tools.

![Angular](https://img.shields.io/badge/Angular-16.2-red.svg)
![Firebase](https://img.shields.io/badge/Firebase-10.8-orange.svg)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.1-blue.svg)

## 🌟 Features

### 📊 Dashboard
- **Live Market Data**: See real-time NSE index values (NIFTY 50, BANK NIFTY, FIN NIFTY, MIDCAP NIFTY)
- **Market Status**: Know when the market is open or closed (9:15 AM - 3:30 PM IST)
- **Market Ticker**: Watch live market prices scroll at the top of every page
- **Weekly Performance**: Beautiful charts showing how you're doing each week
- **Profit Analysis**: See which markets are making you money with colorful pie charts

### 💼 Trade Management
- **Add/Edit Trades**: Easy-to-use form to record your trades
- **Trade History**: View all your trades in one place
- **Profit/Loss Tracking**: See your profit, loss, ROI, and net values automatically calculated
- **Market Selection**: Trade in multiple markets (Bank Nifty, Nifty, Fin Nifty, MidCap Nifty, Sensex)
- **Brokerage Tracking**: Keep track of brokerage costs in your calculations

### 📋 Trade Sheets
- **Create Sheets**: Plan your trading with expected returns and starting capital
- **Daily Tracking**: Add your daily profit or loss to see how you're doing
- **Capital Updates**: Watch your capital grow or shrink as you add entries
- **Helpful Guide**: Built-in instructions to help you use trade sheets
- **Market Selection**: Pick your market and lot size for each trading plan

### 📈 Analytics & Overview
- **Performance Charts**: See your weekly investment vs actual results in easy-to-read charts
- **ROI Analysis**: Find out your return on investment with clear visuals
- **Week Comparison**: Look back at previous weeks to see your progress
- **Color Coding**: Green for profits, red for losses - easy to understand at a glance
- **Helpful Guide**: Step-by-step instructions on how to use analytics

### 💰 Account Management
- **Profile Management**: Update your personal information, email, and preferred market
- **Profile Picture**: Upload your profile picture (max 1MB)
- **Fund Tracking**: 
  - Add funds with dates
  - Track withdrawals
  - See total funds added and withdrawn
  - View your net profit or loss
- **Organized Tabs**: Easy navigation between Profile, Funds, and Summary sections
- **Financial Summary**: Complete overview of all your financial transactions

### 📦 Stock Portfolio
- **Manage Stocks**: Add, edit, or remove stocks from your portfolio
- **Quick Search**: Type a company name and it finds the details for you
- **Track Prices**: Record your buy price, sell price, and how many shares
- **Auto Calculations**: Your total buy and sell amounts are calculated for you
- **Sold Tracking**: Mark when you sell and see your sell prices

### 🧮 Stop-Loss Calculator
- **Target & Stop-Loss Calculation**: Calculate your stop-loss and target prices
- **Flexible Input**: Enter quantity or total amount - both work
- **Quick Results**: Get instant calculations for your trading decisions

### 📅 Market Holidays
- **Holiday Calendar**: View all market holidays for the year
- **Market Status**: Automatic detection of holidays affecting market status

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Angular CLI (v16.2 or higher)

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd trade-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install Angular CLI globally** (if not already installed)
   ```bash
   npm install -g @angular/cli
   ```

4. **Configure Firebase**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication (Email/Password)
   - Create a Firestore database
   - Update `src/app/app.module.ts` with your Firebase configuration:
     ```typescript
     const firebaseConfig = {
       apiKey: "YOUR_API_KEY",
       authDomain: "YOUR_AUTH_DOMAIN",
       databaseURL: "YOUR_DATABASE_URL",
       projectId: "YOUR_PROJECT_ID",
       storageBucket: "YOUR_STORAGE_BUCKET",
       messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
       appId: "YOUR_APP_ID",
       measurementId: "YOUR_MEASUREMENT_ID"
     };
     ```

5. **Proxy Setup** (for NSE API)
   - Already configured - no changes needed!

6. **Run the development server**
   ```bash
   ng serve
   ```

7. **Open your browser**
   Navigate to `http://localhost:4200/`

## 🚀 Usage

### Getting Started

1. **Register/Login**: Create an account or login with existing credentials
2. **Set Preferred Market**: Choose your primary trading market during registration
3. **Add Funds**: Go to Account → Fund Management → Add Fund to start tracking your capital
4. **Add Trades**: Navigate to Trades → Add Trade to record your trading activities
5. **Create Trade Sheet**: Use the Sheet feature to plan and track weekly trading goals
6. **View Analytics**: Check the Analytics page for detailed performance insights

### Key Features Usage

#### Market Marquee
- The market ticker appears at the top of all pages
- Updates every 30 seconds when market is open (9:15 AM - 3:30 PM IST)
- Shows NIFTY 50, BANK NIFTY, FIN NIFTY, and MIDCAP NIFTY with live prices and changes

#### Trade Sheets
1. Click "Generate Sheet" in the Sheet page
2. Enter starting capital, expected ROI, and number of days
3. Add daily entries as you trade
4. Track actual performance vs expected performance

#### Stock Portfolio
1. Use the search bar to find companies (auto-completes from NSE)
2. Enter buy price and quantity
3. Mark as sold when you exit the position
4. View all your holdings in the Stocks page

## 📸 Screenshots

<!-- Add your screenshots here -->
<img width="1710" height="934" alt="trade-01" src="https://github.com/user-attachments/assets/bbf54460-e7e0-4f16-84d9-f48d7af3df2d" />
*Dashboard with market data and performance charts*

<img width="2559" height="1275" alt="trade-02" src="https://github.com/user-attachments/assets/bd069160-70d3-451c-b80c-7a4fc89398d3" />
*Trade management interface*

<img width="2559" height="1278" alt="trade-03" src="https://github.com/user-attachments/assets/7576234b-c900-4001-a7cb-2aac79c676d7" />
*Trade sheet with daily entries*

<img width="2559" height="1274" alt="trade-06" src="https://github.com/user-attachments/assets/4dd7c3e2-da7b-4ce1-a9e7-a7817e85617f" />
*Performance analytics and charts*

<img width="2559" height="1273" alt="trade-04" src="https://github.com/user-attachments/assets/90537a47-82e1-4fa8-9e5b-75796bed7fd6" />
*Stock portfolio management*

## 🌐 Live Demo

Check out the live application: [https://tradetracker-io.vercel.app/](https://tradetracker-io.vercel.app/)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

**Keval Vadhiya**

- GitHub: [@keval101](https://github.com/keval101)
- Project Link: [Trade Tracker](https://github.com/keval101/paper-trading)

## 🙏 Acknowledgments

- NSE India for providing market data APIs
- Firebase for backend infrastructure
- PrimeNG for UI components
- Chart.js for data visualization
- All contributors and users of this project

---

**Made with ❤️ for traders**


