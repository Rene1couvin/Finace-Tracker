import React, { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import TransactionModal from '@/components/dashboard/TransactionModal';
import TransactionItem from '@/components/dashboard/TransactionItem';
import { useTransactions } from '@/hooks/useTransactions';
import { Plus, Search } from 'lucide-react';

const Transactions: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const { transactions, addTransaction, loading } = useTransactions();

  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch = tx.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || tx.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <DashboardLayout>
      <div className="animate-fade-in max-w-7xl mx-auto">
        <div className="mb-8 mt-2 lg:mt-0">
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Transactions</h1>
          <p className="text-muted-foreground mt-1">View and manage all your financial transactions</p>
        </div>

        <div className="bg-card p-4 rounded-2xl shadow-sm border border-border mb-8 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-muted border-none rounded-xl focus:ring-2 focus:ring-primary/20 text-foreground"
            />
          </div>
          <div className="relative w-full md:w-64">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-4 py-3 bg-muted border-none rounded-xl focus:ring-2 focus:ring-primary/20 text-foreground appearance-none cursor-pointer"
            >
              <option value="all">All Categories</option>
              <option value="Salary">Salary</option>
              <option value="Food">Food</option>
              <option value="Transportation">Transportation</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Shopping">Shopping</option>
              <option value="Utilities">Utilities</option>
              <option value="Housing">Housing</option>
              <option value="Freelance">Freelance</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-primary hover:bg-primary-dark text-primary-foreground px-6 py-3 rounded-xl font-semibold transition-colors shadow-primary-glow whitespace-nowrap flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Transaction
          </button>
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading...</div>
          ) : filteredTransactions.length > 0 ? (
            filteredTransactions.map((tx) => <TransactionItem key={tx.id} transaction={tx} />)
          ) : (
            <div className="text-center py-8 text-muted-foreground bg-card rounded-2xl border border-border">
              No transactions found.
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

export default Transactions;
