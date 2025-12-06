import { useState, useEffect } from 'react';
import { Transaction, TransactionStats, TransactionType, TransactionCategory } from '@/types/transaction';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { collection, addDoc, deleteDoc, doc, query, where, onSnapshot, Timestamp } from 'firebase/firestore';

export const useTransactions = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const q = query(collection(db, 'transactions'), where('userId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const txns: Transaction[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        txns.push({
          id: doc.id,
          type: data.type,
          amount: data.amount,
          category: data.category,
          title: data.title,
          date: data.date,
          userId: data.userId,
          createdAt: data.createdAt?.toDate?.() || new Date(data.createdAt),
        } as Transaction);
      });
      // Sort by date descending
      txns.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setTransactions(txns);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const addTransaction = async (
    type: TransactionType,
    amount: number,
    category: TransactionCategory,
    title: string,
    date: string
  ) => {
    if (!user) return;

    try {
      await addDoc(collection(db, 'transactions'), {
        type,
        amount,
        category,
        title,
        date,
        userId: user.uid,
        createdAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error adding transaction:', error);
      throw error;
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'transactions', id));
    } catch (error) {
      console.error('Error deleting transaction:', error);
      throw error;
    }
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
