import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import type { Category } from '../../types';

interface CategoryFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (category: Partial<Category>) => Promise<void>;
  category?: Category | null;
  categories: Category[];
}

const CategoryForm: React.FC<CategoryFormProps> = ({ open, onClose, onSubmit, category, categories }) => {
  const [formData, setFormData] = useState({
    category_name: '',
    description: '',
    parent_category_id: null as number | null,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (category) {
      setFormData({
        category_name: category.category_name,
        description: category.description || '',
        parent_category_id: category.parent_category_id,
      });
    } else {
      setFormData({
        category_name: '',
        description: '',
        parent_category_id: null,
      });
    }
    setErrors({});
  }, [category, open]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.category_name.trim()) {
      newErrors.category_name = 'Category name is required';
    }

    // Check for circular reference (can't be parent of itself)
    if (category && formData.parent_category_id === category.category_id) {
      newErrors.parent_category_id = 'Category cannot be its own parent';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    try {
      const categoryData: Partial<Category> = {
        category_name: formData.category_name,
        description: formData.description,
        parent_category_id: formData.parent_category_id,
      };

      if (category) {
        categoryData.category_id = category.category_id;
      }

      await onSubmit(categoryData);
      onClose();
    } catch (error) {
      console.error('Error submitting category:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get all descendants of a category (recursive)
  const getDescendants = (categoryId: number): number[] => {
    const descendants: number[] = [];
    const children = categories.filter((cat) => cat.parent_category_id === categoryId);

    for (const child of children) {
      descendants.push(child.category_id);
      descendants.push(...getDescendants(child.category_id));
    }

    return descendants;
  };

  // Get available parent categories (excluding current category and its descendants)
  const availableParents = categories.filter((cat) => {
    if (!category) return true; // All categories available for new category
    if (cat.category_id === category.category_id) return false; // Can't be parent of itself

    // Prevent circular references by excluding descendants
    const descendants = getDescendants(category.category_id);
    if (descendants.includes(cat.category_id)) return false;

    return true;
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{category ? 'Edit Category' : 'Create New Category'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Category Name"
              value={formData.category_name}
              onChange={(e) => setFormData({ ...formData, category_name: e.target.value })}
              error={!!errors.category_name}
              helperText={errors.category_name}
              required
              fullWidth
              autoFocus
            />

            <TextField
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              multiline
              rows={3}
              fullWidth
            />

            <FormControl fullWidth error={!!errors.parent_category_id}>
              <InputLabel>Parent Category</InputLabel>
              <Select
                value={formData.parent_category_id || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    parent_category_id: e.target.value ? Number(e.target.value) : null,
                  })
                }
                label="Parent Category"
              >
                <MenuItem value="">
                  <em>None (Top Level)</em>
                </MenuItem>
                {availableParents.map((cat) => (
                  <MenuItem key={cat.category_id} value={cat.category_id}>
                    {cat.category_name}
                    {cat.parent_category_id && ' (Subcategory)'}
                  </MenuItem>
                ))}
              </Select>
              {errors.parent_category_id && (
                <Box sx={{ color: 'error.main', fontSize: '0.75rem', mt: 0.5 }}>
                  {errors.parent_category_id}
                </Box>
              )}
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{
              backgroundColor: '#6B46C1',
              '&:hover': { backgroundColor: '#5A38A3' },
            }}
          >
            {loading ? 'Saving...' : category ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CategoryForm;
