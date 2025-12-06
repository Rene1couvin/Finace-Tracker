import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tag, Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, query, where, onSnapshot } from 'firebase/firestore';

interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
  color: string;
  userId: string;
}

const defaultCategories = [
  { name: 'Salary', type: 'income' as const, color: '#10B981' },
  { name: 'Freelance', type: 'income' as const, color: '#3B82F6' },
  { name: 'Food', type: 'expense' as const, color: '#6B7280' },
  { name: 'Entertainment', type: 'expense' as const, color: '#6B7280' },
  { name: 'Transportation', type: 'expense' as const, color: '#EF4444' },
  { name: 'Utilities', type: 'expense' as const, color: '#6B7280' },
];

const Categories: React.FC = () => {
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState<'income' | 'expense'>('expense');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, 'categories'), where('userId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const cats: Category[] = [];
      snapshot.forEach((doc) => {
        cats.push({ id: doc.id, ...doc.data() } as Category);
      });
      
      // If no categories exist, create defaults
      if (cats.length === 0 && loading) {
        initializeDefaultCategories();
      } else {
        setCategories(cats);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [user]);

  const initializeDefaultCategories = async () => {
    if (!user) return;
    try {
      for (const cat of defaultCategories) {
        await addDoc(collection(db, 'categories'), {
          ...cat,
          userId: user.uid,
        });
      }
    } catch (error) {
      console.error('Error initializing categories:', error);
    }
    setLoading(false);
  };

  const incomeCategories = categories.filter(c => c.type === 'income');
  const expenseCategories = categories.filter(c => c.type === 'expense');

  const handleAddCategory = async () => {
    if (!newName.trim() || !user) {
      toast.error('Please enter a category name');
      return;
    }
    setSaving(true);
    try {
      await addDoc(collection(db, 'categories'), {
        name: newName.trim(),
        type: newType,
        color: newType === 'income' ? '#10B981' : '#EF4444',
        userId: user.uid,
      });
      setNewName('');
      setIsDialogOpen(false);
      toast.success('Category added');
    } catch (error) {
      toast.error('Failed to add category');
    }
    setSaving(false);
  };

  const handleEditCategory = async () => {
    if (!editingCategory || !newName.trim()) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, 'categories', editingCategory.id), {
        name: newName.trim(),
      });
      setEditingCategory(null);
      setNewName('');
      setIsDialogOpen(false);
      toast.success('Category updated');
    } catch (error) {
      toast.error('Failed to update category');
    }
    setSaving(false);
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'categories', id));
      toast.success('Category deleted');
    } catch (error) {
      toast.error('Failed to delete category');
    }
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
    <div className="flex items-center justify-between p-3 bg-background rounded-lg border border-border">
      <div className="flex items-center gap-2">
        <div 
          className="w-2.5 h-2.5 rounded-full" 
          style={{ backgroundColor: category.color }}
        />
        <span className="text-sm font-medium text-foreground">{category.name}</span>
        <span className={`text-xs px-1.5 py-0.5 rounded ${
          category.type === 'income' 
            ? 'bg-emerald-100 text-emerald-700' 
            : 'bg-red-100 text-red-700'
        }`}>
          {category.type === 'income' ? 'Income' : 'Expense'}
        </span>
      </div>
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditDialog(category)}>
          <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDeleteCategory(category.id)}>
          <Trash2 className="w-3.5 h-3.5 text-muted-foreground" />
        </Button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-5">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Categories</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage your transaction categories</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openAddDialog} size="sm" className="bg-emerald-500 hover:bg-emerald-600">
                <Plus className="w-4 h-4 mr-1.5" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-lg">{editingCategory ? 'Edit Category' : 'Add Category'}</DialogTitle>
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
                  disabled={saving}
                >
                  {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {editingCategory ? 'Update' : 'Add'} Category
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {/* Income Categories */}
          <div className="bg-card rounded-xl p-5 border border-border">
            <div className="flex items-center gap-2 mb-3">
              <Tag className="w-4 h-4 text-emerald-500" />
              <h2 className="text-sm font-semibold text-emerald-500">
                Income Categories ({incomeCategories.length})
              </h2>
            </div>
            <div className="space-y-2">
              {incomeCategories.map(category => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          </div>

          {/* Expense Categories */}
          <div className="bg-card rounded-xl p-5 border border-border">
            <div className="flex items-center gap-2 mb-3">
              <Tag className="w-4 h-4 text-red-500" />
              <h2 className="text-sm font-semibold text-red-500">
                Expense Categories ({expenseCategories.length})
              </h2>
            </div>
            <div className="space-y-2">
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
