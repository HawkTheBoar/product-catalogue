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
import type { SelectChangeEvent } from '@mui/material/Select';
import type { Product, Category } from '../../types';

interface ProductFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (product: Partial<Product>) => Promise<void>;
  product?: Product | null;
  categories: Category[];
}

const ProductForm: React.FC<ProductFormProps> = ({ open, onClose, onSubmit, product, categories }) => {
  const [formData, setFormData] = useState({
    product_name: '',
    description: '',
    price: '',
    category_id: null as number | null,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        product_name: product.product_name,
        description: product.description || '',
        price: product.price.toString(),
        category_id: null, // Backend doesn't return category_id in Product type
      });
    } else {
      setFormData({
        product_name: '',
        description: '',
        price: '',
        category_id: null,
      });
    }
    setErrors({});
  }, [product, open]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.product_name.trim()) {
      newErrors.product_name = 'Product name is required';
    }

    if (!formData.price) {
      newErrors.price = 'Price is required';
    } else {
      const price = parseFloat(formData.price);
      if (isNaN(price) || price <= 0) {
        newErrors.price = 'Price must be a positive number';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    try {
      const productData: any = {
        product_name: formData.product_name,
        description: formData.description,
        price: parseFloat(formData.price),
        category_id: formData.category_id,
      };

      if (product) {
        productData.product_id = product.product_id;
        productData.created_at = product.created_at;
      }

      await onSubmit(productData);
      onClose();
    } catch (error) {
      console.error('Error submitting product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (event: SelectChangeEvent<number>) => {
    const value = event.target.value;
    setFormData({ ...formData, category_id: typeof value === 'number' ? value : null });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{product ? 'Edit Product' : 'Create New Product'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Product Name"
              value={formData.product_name}
              onChange={(e) => setFormData({ ...formData, product_name: e.target.value })}
              error={!!errors.product_name}
              helperText={errors.product_name}
              required
              fullWidth
              autoFocus
            />

            <TextField
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              multiline
              rows={4}
              fullWidth
            />

            <TextField
              label="Price"
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              error={!!errors.price}
              helperText={errors.price}
              required
              fullWidth
              inputProps={{ step: '0.01', min: '0' }}
              InputProps={{
                startAdornment: <Box sx={{ mr: 1 }}>$</Box>,
              }}
            />

            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={formData.category_id || ''}
                onChange={handleCategoryChange}
                label="Category"
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category.category_id} value={category.category_id}>
                    {category.category_name}
                  </MenuItem>
                ))}
              </Select>
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
            {loading ? 'Saving...' : product ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ProductForm;
