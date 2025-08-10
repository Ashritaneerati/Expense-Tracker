# Expense Tracker

Expense Tracker is a responsive, interactive web application built with **React**, **TypeScript**, **Vite**, and **TailwindCSS** that helps users efficiently manage their personal finances by tracking incomes and expenses. The app integrates machine learning to predict future expenses and detect anomalies, empowering users to monitor their financial health effectively.

***

## Features

- Add and manage **expenses** with details like amount, category, description, and date  
- Add and track **income** sources with amounts and dates  
- View a detailed **financial summary**: total income, total expenses, and remaining money or deficit  
- Visualize **financial health** status (Healthy, Balanced, Struggling, Critical) based on income-expense ratio  
- **Predict next expense** amount using an LSTM model powered by TensorFlow.js  
- Detect unusual **anomaly expenses** with alerts  
- Responsive and clean UI with TailwindCSS and Lucide React icons  
- Easily delete expense entries  

***

## Tech Stack

| Technology           | Purpose                                        |
|----------------------|------------------------------------------------|
| React                | Building interactive UI components             |
| TypeScript           | Type safety and scalable codebase               |
| Vite                 | Fast development server and build tool          |
| TailwindCSS          | Utility-first CSS for styling and responsiveness |
| TensorFlow.js        | Machine learning model for expense prediction    |
| Lucide React         | Icon library for clean UI icons                   |
| ESLint & TypeScript-ESLint | Code quality and linting                        |

***

## Project Structure

```
├── index.html              # Root HTML file
├── package.json            # Dependencies and scripts
├── vite.config.ts          # Vite configuration
├── tailwind.config.js      # TailwindCSS configuration
├── postcss.config.js       # PostCSS configuration
├── src/
│   ├── App.tsx             # Main app component, state management
│   ├── main.tsx            # Entry point rendering App
│   ├── index.css           # Global styles with Tailwind imports
│   ├── components/         # UI components (ExpenseForm, IncomeForm, ExpenseList, HealthTree)
│   ├── ml/                 # Machine learning logic (ExpensePredictor using TensorFlow.js)
│   ├── types.ts            # TypeScript type definitions
│   ├── vite-env.d.ts       # Vite environment types
```

***

## Installation & Setup

### Clone the repository
```bash
git clone https://github.com/yourusername/expense-tracker.git
cd expense-tracker
```

### Install dependencies
```bash
npm install
# or
yarn install
```

### Run in development mode
```bash
npm run dev
```
Access the app at `http://localhost:5173`

### Build for production
```bash
npm run build
```

### Preview production build
```bash
npm run preview
```

***

## How It Works

- Users add incomes and expenses through well-structured forms capturing amount, category/source, description (expenses), and date.  
- Total incomes and expenses are calculated, and financial health status is computed dynamically based on the ratio of expenses to income.  
- The integrated TensorFlow.js LSTM model trains on past expense data to predict the next expected expense amount.  
- If an entered expense is unusually high compared to historical spending (detected via statistical anomaly detection), the app alerts the user.  
- The UI presents data clearly with summary cards, expense lists, and a health indicator visualized by a tree icon whose color and size reflect financial status.

***

## Future Enhancements

- Add reporting and export functionality  
- Detailed budgeting and alerts for overspending within categories  
- Data visualization charts for trends over time  
- User authentication and cloud sync  
- Dark mode and UI customization options  

***

## Contributing

1. Fork the repository  
2. Create a feature branch (`git checkout -b feature/your-feature`)  
3. Commit changes (`git commit -m 'Add some feature'`)  
4. Push to your branch (`git push origin feature/your-feature`)  
5. Open a Pull Request  

***

## License

This project is licensed under the MIT License. Feel free to use, modify, and distribute.

***

If you want, I can also help you add screenshots or demo GIFs to make the README more engaging.
