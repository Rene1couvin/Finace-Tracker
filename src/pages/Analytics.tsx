import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useTransactions } from '@/hooks/useTransactions';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { TrendingUp, TrendingDown, PiggyBank } from 'lucide-react';

const COLORS = ['#10b981', '#0ea5e9', '#f59e0b', '#ef4444', '#8b5cf6', '#6366f1', '#ec4899', '#14b8a6'];

const Analytics: React.FC = () => {
  const { transactions, getStats } = useTransactions();
  const stats = getStats();

  // Calculate savings rate
  const savingsRate = stats.income > 0 
    ? Math.round(((stats.income - stats.expense) / stats.income) * 100) 
    : 0;

  // Group expenses by category
  const categoryData = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => {
      const existing = acc.find((item) => item.name === t.category);
      if (existing) {
        existing.value += t.amount;
      } else {
        acc.push({ name: t.category, value: t.amount });
      }
      return acc;
    }, [] as { name: string; value: number }[]);

  // Bar chart data
  const barData = [
    { name: 'Current Month', Income: stats.income, Expense: stats.expense }
  ];

  return (
    <DashboardLayout>
      <div className="animate-fade-in max-w-7xl mx-auto">
        <div className="mb-8 mt-2 lg:mt-0">
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Analytics</h1>
          <p className="text-muted-foreground mt-1">Visualize your spending patterns</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-card p-6 rounded-2xl shadow-sm border border-border">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-muted-foreground">Savings Rate</span>
              <span className="bg-primary/10 text-primary p-2 rounded-lg">
                <PiggyBank className="w-4 h-4" />
              </span>
            </div>
            <h2 className="text-2xl font-bold text-foreground">{savingsRate}%</h2>
          </div>
          <div className="bg-card p-6 rounded-2xl shadow-sm border border-border">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-muted-foreground">Total Income</span>
              <span className="bg-primary/10 text-primary p-2 rounded-lg">
                <TrendingUp className="w-4 h-4" />
              </span>
            </div>
            <h2 className="text-2xl font-bold text-foreground">
              ${stats.income.toLocaleString()}
            </h2>
          </div>
          <div className="bg-card p-6 rounded-2xl shadow-sm border border-border">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-muted-foreground">Total Expense</span>
              <span className="bg-destructive/10 text-destructive p-2 rounded-lg">
                <TrendingDown className="w-4 h-4" />
              </span>
            </div>
            <h2 className="text-2xl font-bold text-foreground">
              ${stats.expense.toLocaleString()}
            </h2>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-card p-6 rounded-2xl shadow-sm border border-border">
            <h3 className="text-lg font-bold text-foreground mb-6">Income vs Expense</h3>
            <div className="h-64 w-full">
              {stats.income > 0 || stats.expense > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Income" fill="#10b981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Expense" fill="#ef4444" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  No data to display
                </div>
              )}
            </div>
          </div>

          <div className="bg-card p-6 rounded-2xl shadow-sm border border-border">
            <h3 className="text-lg font-bold text-foreground mb-6">Spending by Category</h3>
            <div className="h-64 w-full flex items-center justify-center">
              {categoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {categoryData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-muted-foreground">No expense data to display</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
