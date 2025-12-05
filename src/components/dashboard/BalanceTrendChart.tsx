import React, { useMemo } from 'react';
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { Transaction } from '@/types/transaction';
import { format, subDays, eachDayOfInterval, startOfDay } from 'date-fns';

interface BalanceTrendChartProps {
  transactions: Transaction[];
}

const BalanceTrendChart: React.FC<BalanceTrendChartProps> = ({ transactions }) => {
  const chartData = useMemo(() => {
    const today = startOfDay(new Date());
    const thirtyDaysAgo = subDays(today, 30);
    
    // Get all days in the interval
    const days = eachDayOfInterval({ start: thirtyDaysAgo, end: today });
    
    // Sort transactions by date (oldest first)
    const sortedTx = [...transactions].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    // Calculate cumulative balance for each day
    let runningBalance = 0;
    const balanceByDay: Record<string, number> = {};
    
    // First, calculate balance from all transactions before the 30-day window
    sortedTx.forEach(tx => {
      const txDate = startOfDay(new Date(tx.date));
      if (txDate < thirtyDaysAgo) {
        runningBalance += tx.type === 'income' ? tx.amount : -tx.amount;
      }
    });
    
    // Now calculate daily balances for the 30-day window
    days.forEach(day => {
      const dayKey = format(day, 'yyyy-MM-dd');
      const dayTransactions = sortedTx.filter(tx => {
        const txDate = format(startOfDay(new Date(tx.date)), 'yyyy-MM-dd');
        return txDate === dayKey;
      });
      
      dayTransactions.forEach(tx => {
        runningBalance += tx.type === 'income' ? tx.amount : -tx.amount;
      });
      
      balanceByDay[dayKey] = runningBalance;
    });
    
    // Create chart data
    return days.map((day, index) => ({
      date: format(day, 'MMM d'),
      balance: balanceByDay[format(day, 'yyyy-MM-dd')] || 0,
      isToday: index === days.length - 1,
    }));
  }, [transactions]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-sm font-semibold text-foreground">
            ${payload[0].value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card p-6 rounded-2xl shadow-sm border border-border mb-8">
      <h3 className="text-lg font-bold text-foreground mb-4">Balance Trend</h3>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="date" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              interval="preserveStartEnd"
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
              width={80}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="balance"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              fill="url(#balanceGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BalanceTrendChart;
