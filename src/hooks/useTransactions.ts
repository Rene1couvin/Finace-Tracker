import { useState, useEffect } from 'react';
import { Transaction, TransactionStats, TransactionType, TransactionCategory } from '@/types/transaction';
import { useAuth } from '@/contexts/AuthContext';

// Using localStorage for demo - in production, use Firebase Firestore
const STORAGE_KEY = 'finance_transactions';

export const useTransactions = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadTransactions();
    }
  }, [user]);

  const loadTransactions = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const allTransactions: Transaction[] = JSON.parse(stored);
        const userTransactions = allTransactions.filter(t => t.userId === user?.uid);
        setTransactions(userTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      }
    } catch (error) {
      console.error('Error loading transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveTransactions = (newTransactions: Transaction[]) => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const allTransactions: Transaction[] = stored ? JSON.parse(stored) : [];
      const otherUserTransactions = allTransactions.filter(t => t.userId !== user?.uid);
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...otherUserTransactions, ...newTransactions]));
    } catch (error) {
      console.error('Error saving transactions:', error);
    }
  };

  const addTransaction = (
    type: TransactionType,
    amount: number,
    category: TransactionCategory,
    title: string,
    date: string
  ) => {
    if (!user) return;

    const newTransaction: Transaction = {
      id: crypto.randomUUID(),
      type,
      amount,
      category,
      title,
      date,
      userId: user.uid,
      createdAt: new Date()
    };

    const updated = [newTransaction, ...transactions];
    setTransactions(updated);
    saveTransactions(updated);
  };

  const deleteTransaction = (id: string) => {
    const updated = transactions.filter(t => t.id !== id);
    setTransactions(updated);
    saveTransactions(updated);
  };

  const getStats = (): TransactionStats => {
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const expense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    return {
      income,
      expense,
      balance: income - expense
    };
  };

  const getRecentTransactions = (limit: number = 5) => {
    return transactions.slice(0, limit);
  };

  return {
    transactions,
    loading,
    addTransaction,
    deleteTransaction,
    getStats,
    getRecentTransactions
  };
};
