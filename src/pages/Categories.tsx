import React, { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tag, Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
  color: string;
}

const defaultCategories: Category[] = [
  { id: '1', name: 'Salary', type: 'income', color: '#10B981' },
  { id: '2', name: 'Freelance', type: 'income', color: '#3B82F6' },
  { id: '3', name: 'Food', type: 'expense', color: '#6B7280' },
  { id: '4', name: 'Entertainment', type: 'expense', color: '#6B7280' },
  { id: '5', name: 'Transportation', type: 'expense', color: '#EF4444' },
  { id: '6', name: 'Utilities', type: 'expense', color: '#6B7280' },
];

const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState<'income' | 'expense'>('expense');

  const incomeCategories = categories.filter(c => c.type === 'income');
  const expenseCategories = categories.filter(c => c.type === 'expense');

  const handleAddCategory = () => {
    if (!newName.trim()) {
      toast.error('Please enter a category name');
      return;
    }
    const newCategory: Category = {
      id: Date.now().toString(),
      name: newName.trim(),
      type: newType,
      color: newType === 'income' ? '#10B981' : '#EF4444',
    };
    setCategories([...categories, newCategory]);
    setNewName('');
    setIsDialogOpen(false);
    toast.success('Category added');
  };

  const handleEditCategory = () => {
    if (!editingCategory || !newName.trim()) return;
    setCategories(categories.map(c => 
      c.id === editingCategory.id ? { ...c, name: newName.trim() } : c
    ));
    setEditingCategory(null);
    setNewName('');
    setIsDialogOpen(false);
    toast.success('Category updated');
  };

  const handleDeleteCategory = (id: string) => {
    setCategories(categories.filter(c => c.id !== id));
    toast.success('Category deleted');
  };

  const openEditDialog = (category: Category) => {
    setEditingCategory(category);
    setNewName(category.name);
    setNewType(category.type);
    setIsDialogOpen(true);
  };

  const openAddDialog = () => {
    setEditingCategory(null);
    setNewName('');
    setNewType('expense');
    setIsDialogOpen(true);
  };

  const CategoryCard = ({ category }: { category: Category }) => (
    <div className="flex items-center justify-between p-4 bg-background rounded-lg border border-border">
      <div className="flex items-center gap-3">
        <div 
          className="w-3 h-3 rounded-full" 
          style={{ backgroundColor: category.color }}
        />
        <span className="font-medium text-foreground">{category.name}</span>
        <span className={`text-xs px-2 py-1 rounded ${
          category.type === 'income' 
            ? 'bg-emerald-100 text-emerald-700' 
            : 'bg-red-100 text-red-700'
        }`}>
          {category.type === 'income' ? 'Income' : 'Expense'}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => openEditDialog(category)}>
          <Pencil className="w-4 h-4 text-muted-foreground" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => handleDeleteCategory(category.id)}>
          <Trash2 className="w-4 h-4 text-muted-foreground" />
        </Button>
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Categories</h1>
            <p className="text-muted-foreground mt-1">Manage your transaction categories</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openAddDialog} className="bg-emerald-500 hover:bg-emerald-600">
                <Plus className="w-4 h-4 mr-2" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingCategory ? 'Edit Category' : 'Add Category'}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div>
                  <label className="text-sm font-medium">Name</label>
                  <Input 
                    value={newName} 
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Category name"
                    className="mt-1"
                  />
                </div>
                {!editingCategory && (
                  <div>
                    <label className="text-sm font-medium">Type</label>
                    <Select value={newType} onValueChange={(v) => setNewType(v as 'income' | 'expense')}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="income">Income</SelectItem>
                        <SelectItem value="expense">Expense</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <Button 
                  onClick={editingCategory ? handleEditCategory : handleAddCategory}
                  className="w-full"
                >
                  {editingCategory ? 'Update' : 'Add'} Category
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Income Categories */}
          <div className="bg-card rounded-2xl p-6 border border-border">
            <div className="flex items-center gap-2 mb-4">
              <Tag className="w-5 h-5 text-emerald-500" />
              <h2 className="text-lg font-semibold text-emerald-500">
                Income Categories ({incomeCategories.length})
              </h2>
            </div>
            <div className="space-y-3">
              {incomeCategories.map(category => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          </div>

          {/* Expense Categories */}
          <div className="bg-card rounded-2xl p-6 border border-border">
            <div className="flex items-center gap-2 mb-4">
              <Tag className="w-5 h-5 text-red-500" />
              <h2 className="text-lg font-semibold text-red-500">
                Expense Categories ({expenseCategories.length})
              </h2>
            </div>
            <div className="space-y-3">
              {expenseCategories.map(category => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Categories;
