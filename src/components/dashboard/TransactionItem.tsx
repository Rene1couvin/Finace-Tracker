import React from 'react';
import { Transaction } from '@/types/transaction';
import { 
  Wallet, 
  Utensils, 
  Car, 
  Film, 
  ShoppingBag, 
  Zap, 
  Home, 
  Briefcase,
  DollarSign 
} from 'lucide-react';

interface TransactionItemProps {
  transaction: Transaction;
}

const categoryIcons: Record<string, React.ReactNode> = {
  Salary: <DollarSign className="w-5 h-5" />,
  Food: <Utensils className="w-5 h-5" />,
  Transportation: <Car className="w-5 h-5" />,
  Entertainment: <Film className="w-5 h-5" />,
  Shopping: <ShoppingBag className="w-5 h-5" />,
  Utilities: <Zap className="w-5 h-5" />,
  Housing: <Home className="w-5 h-5" />,
  Freelance: <Briefcase className="w-5 h-5" />,
  Other: <Wallet className="w-5 h-5" />
};

const TransactionItem: React.FC<TransactionItemProps> = ({ transaction }) => {
  const isIncome = transaction.type === 'income';
  const iconBgClass = isIncome ? 'bg-primary/10 text-primary' : 'bg-destructive/10 text-destructive';
  const amountClass = isIncome ? 'text-primary' : 'text-foreground';
  const sign = isIncome ? '+' : '-';

  return (
    <div className="bg-card p-4 rounded-xl shadow-sm border border-border flex items-center justify-between hover:shadow-md transition-shadow cursor-pointer">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-full ${iconBgClass} flex items-center justify-center`}>
          {categoryIcons[transaction.category] || <Wallet className="w-5 h-5" />}
        </div>
        <div>
          <h4 className="font-bold text-foreground text-sm md:text-base">{transaction.title}</h4>
          <p className="text-xs text-muted-foreground">{transaction.category}</p>
        </div>
      </div>
      <div className="text-right">
        <div className={`font-bold ${amountClass} text-sm md:text-base`}>
          {sign}${transaction.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
        <div className="text-xs text-muted-foreground">{transaction.date}</div>
      </div>
    </div>
  );
};

export default TransactionItem;
