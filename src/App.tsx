import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ExpenseForm } from './components/ExpenseForm';
import { ExpenseList } from './components/ExpenseList';
import { IncomeForm } from './components/IncomeForm';
import { HealthTree } from './components/HealthTree';
import { ExpensePredictor } from './ml/ExpensePredictor';
import type { Expense, Income, FinancialState, FinancialHealth } from './types';
import { AlertTriangle } from 'lucide-react';

function calculateFinancialHealth(totalIncome: number, totalExpenses: number): FinancialHealth {
  const ratio = totalExpenses / totalIncome;
  
  if (ratio <= 0.6) return 'healthy';
  if (ratio <= 0.8) return 'balanced';
  if (ratio <= 1.0) return 'struggling';
  return 'critical';
}

function App() {
  const [state, setState] = useState<FinancialState>({
    expenses: [],
    incomes: [],
    budgets: [],
    totalExpenses: 0,
    totalIncome: 0,
    health: 'balanced'
  });

  const [prediction, setPrediction] = useState<number | null>(null);
  const [anomaly, setAnomaly] = useState<boolean>(false);
  const predictor = useRef(new ExpensePredictor());

  useEffect(() => {
    predictor.current.initialize();
  }, []);

  useEffect(() => {
    const totalExpenses = state.expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const totalIncome = state.incomes.reduce((sum, income) => sum + income.amount, 0);
    const health = calculateFinancialHealth(totalIncome, totalExpenses);

    setState(prev => ({
      ...prev,
      totalExpenses,
      totalIncome,
      health
    }));

    // Train model and update prediction
    const updateML = async () => {
      if (state.expenses.length > 0) {
        await predictor.current.trainModel(state.expenses);
        const nextExpense = await predictor.current.predictNextExpense(state.expenses);
        setPrediction(nextExpense);
      }
    };
    updateML();
  }, [state.expenses, state.incomes]);

  const handleAddExpense = async (expenseData: Omit<Expense, 'id'>) => {
    // Check for anomaly before adding
    const isAnomaly = await predictor.current.detectAnomaly(
      expenseData.amount,
      state.expenses
    );
    setAnomaly(isAnomaly);

    const newExpense: Expense = {
      ...expenseData,
      id: uuidv4()
    };
    setState(prev => ({
      ...prev,
      expenses: [...prev.expenses, newExpense]
    }));
  };

  const handleAddIncome = (incomeData: Omit<Income, 'id'>) => {
    const newIncome: Income = {
      ...incomeData,
      id: uuidv4()
    };
    setState(prev => ({
      ...prev,
      incomes: [...prev.incomes, newIncome]
    }));
  };

  const handleDeleteExpense = (id: string) => {
    setState(prev => ({
      ...prev,
      expenses: prev.expenses.filter(expense => expense.id !== id)
    }));
  };

  const remainingMoney = state.totalIncome - state.totalExpenses;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Financial Health Tracker</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="flex flex-col space-y-6">
              <ExpenseForm onSubmit={handleAddExpense} />
              <IncomeForm onSubmit={handleAddIncome} />
            </div>
            
            <div className="flex flex-col space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Financial Summary</h2>
                <div className="grid grid-cols-1 gap-4">
                  <div className="p-4 bg-green-100 rounded-lg">
                    <p className="text-sm text-green-600">Total Income</p>
                    <p className="text-2xl font-bold text-green-800">
                      ₹{state.totalIncome.toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div className="p-4 bg-red-100 rounded-lg">
                    <p className="text-sm text-red-600">Total Expenses</p>
                    <p className="text-2xl font-bold text-red-800">
                      ₹{state.totalExpenses.toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div className={`p-4 rounded-lg ${remainingMoney >= 0 ? 'bg-blue-100' : 'bg-orange-100'}`}>
                    <p className={`text-sm ${remainingMoney >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                      {remainingMoney >= 0 ? 'Remaining Money' : 'Deficit'}
                    </p>
                    <p className={`text-2xl font-bold ${remainingMoney >= 0 ? 'text-blue-800' : 'text-orange-800'}`}>
                      ₹{Math.abs(remainingMoney).toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>

                {prediction !== null && (
                  <div className="mt-4 p-4 bg-purple-100 rounded-lg">
                    <p className="text-sm text-purple-600">Predicted Next Expense</p>
                    <p className="text-2xl font-bold text-purple-800">
                      ₹{prediction.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </p>
                  </div>
                )}

                {anomaly && (
                  <div className="mt-4 p-4 bg-yellow-100 rounded-lg flex items-center">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
                    <p className="text-sm text-yellow-600">
                      This expense amount is unusually high compared to your spending pattern
                    </p>
                  </div>
                )}
              </div>
              
              <HealthTree health={state.health} />
            </div>
          </div>

          <ExpenseList 
            expenses={state.expenses} 
            onDelete={handleDeleteExpense}
          />
        </div>
      </div>
    </div>
  );
}

export default App;