import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  IconButton,
  Chip,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import FolderIcon from '@mui/icons-material/Folder';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import CategoryForm from '../../components/admin/CategoryForm';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../../services/api';
import type { Category } from '../../types';

const CategoryManagement: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = categories.filter(
        (c) =>
          c.category_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCategories(filtered);
    } else {
      setFilteredCategories(categories);
    }
  }, [searchQuery, categories]);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      showSnackbar('Error loading categories', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCreate = () => {
    setSelectedCategory(null);
    setFormOpen(true);
  };

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setFormOpen(true);
  };

  const handleDeleteClick = (category: Category) => {
    setCategoryToDelete(category);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!categoryToDelete) return;

    try {
      await deleteCategory(categoryToDelete.category_id);
      await loadCategories();
      showSnackbar('Category deleted successfully', 'success');
      setDeleteDialogOpen(false);
      setCategoryToDelete(null);
    } catch (error: any) {
      showSnackbar(error.message || 'Error deleting category', 'error');
    }
  };

  const handleFormSubmit = async (categoryData: Partial<Category>) => {
    try {
      if (selectedCategory) {
        await updateCategory(categoryData as Category);
        showSnackbar('Category updated successfully', 'success');
      } else {
        await createCategory(categoryData);
        showSnackbar('Category created successfully', 'success');
      }
      await loadCategories();
      setFormOpen(false);
    } catch (error) {
      showSnackbar(`Error ${selectedCategory ? 'updating' : 'creating'} category`, 'error');
    }
  };

  // Group categories by parent
  const parentCategories = filteredCategories.filter((c) => !c.parent_category_id);
  const getSubcategories = (parentId: number) =>
    filteredCategories.filter((c) => c.parent_category_id === parentId);

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#FAFAFA', py: 4 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconButton
            onClick={() => navigate('/admin')}
            sx={{ mr: 2, color: '#6B46C1' }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" sx={{ flexGrow: 1, fontWeight: 600, color: '#2C2C2C' }}>
            Category Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreate}
            sx={{
              backgroundColor: '#6B46C1',
              '&:hover': { backgroundColor: '#5A38A3' },
            }}
          >
            Add Category
          </Button>
        </Box>

        {/* Search Bar */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <TextField
            fullWidth
            placeholder="Search categories by name or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#757575' }} />
                </InputAdornment>
              ),
            }}
          />
        </Paper>

        {/* Categories List */}
        <Paper>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 8 }}>
              <CircularProgress sx={{ color: '#6B46C1' }} />
            </Box>
          ) : (
            <List>
              {parentCategories.length === 0 ? (
                <ListItem>
                  <ListItemText
                    primary={
                      <Typography variant="body1" color="text.secondary" align="center" sx={{ py: 4 }}>
                        {searchQuery ? 'No categories found matching your search.' : 'No categories yet. Create your first category!'}
                      </Typography>
                    }
                  />
                </ListItem>
              ) : (
                parentCategories.map((parent, index) => {
                  const subcategories = getSubcategories(parent.category_id);

                  return (
                    <Box key={parent.category_id}>
                      {index > 0 && <Divider />}

                      {/* Parent Category */}
                      <ListItem
                        sx={{
                          backgroundColor: '#F5F5F5',
                          '&:hover': { backgroundColor: '#EEEEEE' },
                        }}
                      >
                        <FolderOpenIcon sx={{ mr: 2, color: '#6B46C1' }} />
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                {parent.category_name}
                              </Typography>
                              <Chip label="Parent" size="small" sx={{ backgroundColor: '#6B46C1', color: '#FFFFFF' }} />
                            </Box>
                          }
                          secondary={parent.description || 'No description'}
                        />
                        <Box>
                          <IconButton size="small" onClick={() => handleEdit(parent)} sx={{ color: '#6B46C1', mr: 1 }}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton size="small" onClick={() => handleDeleteClick(parent)} sx={{ color: '#D32F2F' }}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </ListItem>

                      {/* Subcategories */}
                      {subcategories.map((sub) => (
                        <ListItem
                          key={sub.category_id}
                          sx={{
                            pl: 6,
                            '&:hover': { backgroundColor: '#FAFAFA' },
                          }}
                        >
                          <FolderIcon sx={{ mr: 2, color: '#9E9E9E' }} />
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                  {sub.category_name}
                                </Typography>
                                <Chip label="Subcategory" size="small" sx={{ backgroundColor: '#E0E0E0' }} />
                              </Box>
                            }
                            secondary={sub.description || 'No description'}
                          />
                          <Box>
                            <IconButton size="small" onClick={() => handleEdit(sub)} sx={{ color: '#6B46C1', mr: 1 }}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton size="small" onClick={() => handleDeleteClick(sub)} sx={{ color: '#D32F2F' }}>
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </ListItem>
                      ))}
                    </Box>
                  );
                })
              )}
            </List>
          )}
        </Paper>

        {/* Category Form Dialog */}
        <CategoryForm
          open={formOpen}
          onClose={() => setFormOpen(false)}
          onSubmit={handleFormSubmit}
          category={selectedCategory}
          categories={categories}
        />

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete "{categoryToDelete?.category_name}"?
              {getSubcategories(categoryToDelete?.category_id || 0).length > 0 && (
                <Box component="span" sx={{ color: 'error.main', display: 'block', mt: 1 }}>
                  Warning: This category has subcategories and cannot be deleted.
                </Box>
              )}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={handleDeleteConfirm}
              color="error"
              variant="contained"
              disabled={getSubcategories(categoryToDelete?.category_id || 0).length > 0}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default CategoryManagement;
