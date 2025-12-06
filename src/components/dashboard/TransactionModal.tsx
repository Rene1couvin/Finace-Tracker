import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { TransactionType, TransactionCategory } from '@/types/transaction';
import { toast } from 'sonner';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    type: TransactionType,
    amount: number,
    category: TransactionCategory,
    title: string,
    date: string
  ) => Promise<void>;
}

const categories: TransactionCategory[] = [
  'Salary',
  'Food',
  'Transportation',
  'Entertainment',
  'Shopping',
  'Utilities',
  'Housing',
  'Freelance',
  'Other'
];

const TransactionModal: React.FC<TransactionModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<TransactionCategory>('Food');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !title) {
      toast.error('Please fill all fields');
      return;
    }

    setLoading(true);
    try {
      await onSubmit(type, parseFloat(amount), category, title, date);
      toast.success('Transaction added!');
      resetForm();
      onClose();
    } catch (error) {
      toast.error('Failed to add transaction');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setType('expense');
    setAmount('');
    setCategory('Food');
    setTitle('');
    setDate(new Date().toISOString().split('T')[0]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-foreground/60 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="bg-card w-full max-w-md rounded-2xl shadow-2xl transform transition-all flex flex-col max-h-[90vh] overflow-y-auto animate-fade-in">
          <div className="p-5 border-b border-border flex justify-between items-center sticky top-0 bg-card z-10">
            <div>
              <h3 className="text-lg font-bold text-foreground">Add Transaction</h3>
              <p className="text-xs text-muted-foreground">Record a new income or expense</p>
            </div>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Type Toggle */}
            <div className="bg-muted p-1 rounded-lg flex">
              <button
                type="button"
                onClick={() => setType('expense')}
                className={`flex-1 py-2 rounded-md text-sm font-semibold transition-all ${
                  type === 'expense' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground'
                }`}
              >
                Expense
              </button>
              <button
                type="button"
                onClick={() => setType('income')}
                className={`flex-1 py-2 rounded-md text-sm font-semibold transition-all ${
                  type === 'income' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground'
                }`}
              >
                Income
              </button>
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1">Amount *</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">$</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  className="w-full pl-8 pr-4 py-3 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-foreground"
                  required
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as TransactionCategory)}
                className="w-full px-4 py-3 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none text-foreground font-medium cursor-pointer"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1">Date *</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-3 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground font-medium"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1">Description *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Grocery shopping, Monthly rent..."
                className="w-full px-4 py-3 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground font-medium"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-dark text-primary-foreground py-3 rounded-xl font-bold transition-colors shadow-primary-glow disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Adding...
                </>
              ) : (
                'Add Transaction'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TransactionModal;
