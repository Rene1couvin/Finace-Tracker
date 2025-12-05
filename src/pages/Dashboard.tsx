import React, { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import TransactionModal from '@/components/dashboard/TransactionModal';
import TransactionItem from '@/components/dashboard/TransactionItem';
import BalanceTrendChart from '@/components/dashboard/BalanceTrendChart';
import { useTransactions } from '@/hooks/useTransactions';
import { TrendingUp, TrendingDown, Wallet, Plus } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { transactions, addTransaction, getStats, getRecentTransactions, loading } = useTransactions();
  const stats = getStats();
  const recentTransactions = getRecentTransactions(5);

  return (
    <DashboardLayout>
      <div className="animate-fade-in max-w-7xl mx-auto">
        <div className="mb-8 mt-2 lg:mt-0">
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Track your financial health</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-card p-6 rounded-2xl shadow-sm border border-border">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-muted-foreground">Total Balance</span>
              <span className="bg-primary/10 text-primary p-2 rounded-lg">
                <Wallet className="w-4 h-4" />
              </span>
            </div>
            <h2 className="text-2xl font-bold text-foreground">
              ${stats.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </h2>
            <p className="text-xs text-muted-foreground mt-1">Current balance</p>
          </div>

          <div className="bg-card p-6 rounded-2xl shadow-sm border border-border">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-muted-foreground">Total Income</span>
              <span className="bg-primary/10 text-primary p-2 rounded-lg">
                <TrendingUp className="w-4 h-4" />
              </span>
            </div>
            <h2 className="text-2xl font-bold text-foreground">
              ${stats.income.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </h2>
            <p className="text-xs text-muted-foreground mt-1">Money earned</p>
          </div>

          <div className="bg-card p-6 rounded-2xl shadow-sm border border-border">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-muted-foreground">Total Expenses</span>
              <span className="bg-destructive/10 text-destructive p-2 rounded-lg">
                <TrendingDown className="w-4 h-4" />
              </span>
            </div>
            <h2 className="text-2xl font-bold text-foreground">
              ${stats.expense.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </h2>
            <p className="text-xs text-muted-foreground mt-1">Money spent</p>
          </div>
        </div>

        {/* Balance Trend Chart */}
        <BalanceTrendChart transactions={transactions} />

        {/* Recent Transactions */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-foreground">Recent Transactions</h3>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-primary hover:bg-primary-dark text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 shadow-primary-glow"
          >
            <Plus className="w-4 h-4" />
            Add Transaction
          </button>
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading...</div>
          ) : recentTransactions.length > 0 ? (
            recentTransactions.map((tx) => <TransactionItem key={tx.id} transaction={tx} />)
          ) : (
            <div className="text-center py-8 text-muted-foreground bg-card rounded-2xl border border-border">
              No transactions found. Start by adding a transaction!
            </div>
          )}
        </div>
      </div>

      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={addTransaction}
      />
    </DashboardLayout>
  );
};

export default Dashboard;
