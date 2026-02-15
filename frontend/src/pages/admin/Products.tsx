import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Plus, Edit, Trash2, Eye, Image as ImageIcon, Upload, X } from 'lucide-react';
import DataTable from '../../components/admin/DataTable';
import type { Column } from '../../components/admin/DataTable';
import Modal from '../../components/admin/Modal';
import toast from 'react-hot-toast';
import { adminService, type AdminProduct } from '../../services/adminService';
import axios from '../../config/axios';

interface Product {
  id: number;
  name: string;
  price: string;
  stock_quantity: number;
  category: string;
  status: string;
  image_url?: string;
  image_urls?: Array<{ id: number; url: string }>;
}

const Products: React.FC = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load products from API
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const response = await adminService.getProducts();
      if (response.success) {
        // Transform API data to match component interface
        const transformedProducts = response.data.products.map((p: AdminProduct) => ({
          id: p.id,
          name: p.name,
          price: `₹${p.price.toLocaleString()}`,
          stock_quantity: p.stock_quantity,
          category: p.category,
          status: p.stock_quantity > 0 && p.active ? 'active' : 'out_of_stock',
          image_url: p.image_url,
          image_urls: p.image_urls,
        }));
        setProducts(transformedProducts);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to load products');
    } finally {
      setIsLoading(false);
    }
  };

  const columns: Column<Product>[] = [
    {
      key: 'name',
      label: 'Product Name',
      sortable: true,
      render: (product) => (
        <div className="flex items-center space-x-3">
          {product.image_url ? (
            <img src={product.image_url} alt={product.name} className="w-10 h-10 rounded-lg object-cover" />
          ) : (
            <div className="w-10 h-10 bg-warmgray-100 rounded-lg flex items-center justify-center">
              <ImageIcon className="h-5 w-5 text-warmgray-400" />
            </div>
          )}
          <span className="font-semibold">{product.name}</span>
        </div>
      ),
    },
    { key: 'category', label: 'Category', sortable: true },
    { key: 'price', label: 'Price', sortable: true },
    {
      key: 'stock_quantity',
      label: 'Stock',
      sortable: true,
      render: (product) => (
        <span
          className={`font-semibold ${
            product.stock_quantity === 0
              ? 'text-red-600'
              : product.stock_quantity < 20
              ? 'text-yellow-600'
              : 'text-green-600'
          }`}
        >
          {product.stock_quantity} units
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (product) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-bold ${
            product.status === 'active'
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}
        >
          {product.status === 'active' ? 'Active' : 'Out of Stock'}
        </span>
      ),
    },
    {
      key: 'id',
      label: 'Actions',
      render: (product) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleEdit(product)}
            className="p-2 hover:bg-teal-light/30 rounded-lg transition-colors"
            title="Edit"
          >
            <Edit className="h-4 w-4 text-teal" />
          </button>
          <button
            onClick={() => handleDelete(product.id)}
            className="p-2 hover:bg-coral-light/30 rounded-lg transition-colors"
            title="Delete"
          >
            <Trash2 className="h-4 w-4 text-coral" />
          </button>
        </div>
      ),
    },
  ];

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await adminService.deleteProduct(id);
        if (response.success) {
          toast.success('Product deleted successfully');
          loadProducts(); // Reload products after deletion
        }
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Failed to delete product');
      }
    }
  };

  const handleBulkDelete = async () => {
    if (selectedProducts.length === 0) {
      toast.error('Please select products to delete');
      return;
    }
    if (
      window.confirm(
        `Are you sure you want to delete ${selectedProducts.length} products?`
      )
    ) {
      try {
        await Promise.all(selectedProducts.map(id => adminService.deleteProduct(id)));
        toast.success(`${selectedProducts.length} products deleted`);
        setSelectedProducts([]);
        loadProducts(); // Reload products after deletion
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Failed to delete products');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-[var(--font-family-fun)] font-bold text-warmgray-800 mb-2">
            Products
          </h1>
          <p className="text-warmgray-600">
            Manage your product inventory and categories
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center space-x-2 px-6 py-3 bg-teal-gradient text-white font-bold rounded-xl shadow-soft hover-lift"
        >
          <Plus className="h-5 w-5" />
          <span>Add Product</span>
        </button>
      </div>

      {/* Bulk Actions */}
      {selectedProducts.length > 0 && (
        <div className="bg-warmgray-100 border-2 border-warmgray-200 rounded-xl p-4 flex items-center justify-between">
          <span className="font-semibold text-warmgray-700">
            {selectedProducts.length} product(s) selected
          </span>
          <button
            onClick={handleBulkDelete}
            className="flex items-center space-x-2 px-4 py-2 bg-coral text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
          >
            <Trash2 className="h-4 w-4" />
            <span>Delete Selected</span>
          </button>
        </div>
      )}

      {/* Products Table */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal mx-auto"></div>
          <p className="mt-4 text-warmgray-600">Loading products...</p>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={products}
          searchable
          searchPlaceholder="Search products..."
          emptyMessage="No products found"
        />
      )}

      {/* Add Product Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Product"
        size="lg"
      >
        <ProductForm onClose={() => setIsAddModalOpen(false)} />
      </Modal>

      {/* Edit Product Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedProduct(null);
        }}
        title="Edit Product"
        size="lg"
      >
        <ProductForm
          product={selectedProduct}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedProduct(null);
          }}
        />
      </Modal>
    </div>
  );
};

// Product Form Component
interface ProductFormProps {
  product?: Product | null;
  onClose: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ product, onClose }) => {
  const [categories, setCategories] = useState<Array<{ id: number; name: string }>>([]);
  const [formData, setFormData] = useState({
    name: product?.name || '',
    price: product?.price?.replace('₹', '').replace(',', '') || '',
    stock_quantity: product?.stock_quantity || 0,
    category_id: '',
    description: '',
    long_description: '',
    compare_at_price: '',
    featured: false,
    age_range: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Image upload state
  const [newImages, setNewImages] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<Array<{ id: number; url: string }>>(
    product?.image_urls || []
  );
  const [removeImageIds, setRemoveImageIds] = useState<number[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/categories');
        if (response.data?.success) {
          setCategories(response.data.data || []);
        }
      } catch (error) {
        console.error('Failed to load categories');
      }
    };
    fetchCategories();
  }, []);

  const handleFilesSelected = useCallback((files: FileList | File[]) => {
    const validFiles = Array.from(files).filter((file) => {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image file`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} exceeds 5MB limit`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    setNewImages((prev) => [...prev, ...validFiles]);

    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImagePreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files) {
        handleFilesSelected(e.dataTransfer.files);
      }
    },
    [handleFilesSelected]
  );

  const removeNewImage = (index: number) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
    setNewImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (imageId: number) => {
    setExistingImages((prev) => prev.filter((img) => img.id !== imageId));
    setRemoveImageIds((prev) => [...prev, imageId]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const productData: any = {
        name: formData.name,
        price: parseFloat(formData.price),
        stock_quantity: formData.stock_quantity,
        description: formData.description,
        long_description: formData.long_description,
        featured: formData.featured,
        active: true,
      };

      if (formData.category_id) {
        productData.category_id = parseInt(formData.category_id);
      }
      if (formData.compare_at_price) {
        productData.compare_at_price = parseFloat(formData.compare_at_price);
      }
      if (formData.age_range) {
        const [min, max] = formData.age_range.split('-');
        productData.min_age = parseInt(min);
        productData.max_age = parseInt(max);
      }

      if (product) {
        await adminService.updateProduct(
          product.id,
          productData,
          newImages.length > 0 ? newImages : undefined,
          removeImageIds.length > 0 ? removeImageIds : undefined
        );
        toast.success('Product updated successfully');
      } else {
        await adminService.createProduct(
          productData,
          newImages.length > 0 ? newImages : undefined
        );
        toast.success('Product added successfully');
      }
      onClose();
      window.location.reload();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save product');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Product Name */}
        <div className="md:col-span-2">
          <label className="block text-sm font-bold text-warmgray-700 mb-2">
            Product Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-3 border-2 border-warmgray-200 rounded-xl focus:outline-none focus:border-teal transition-colors"
            required
          />
        </div>

        {/* Image Upload */}
        <div className="md:col-span-2">
          <label className="block text-sm font-bold text-warmgray-700 mb-2">
            Product Images
          </label>

          {/* Existing Images */}
          {existingImages.length > 0 && (
            <div className="flex flex-wrap gap-3 mb-3">
              {existingImages.map((img) => (
                <div key={img.id} className="relative group">
                  <img
                    src={img.url}
                    alt="Product"
                    className="w-20 h-20 rounded-lg object-cover border-2 border-warmgray-200"
                  />
                  <button
                    type="button"
                    onClick={() => removeExistingImage(img.id)}
                    className="absolute -top-2 -right-2 bg-coral text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* New Image Previews */}
          {newImagePreviews.length > 0 && (
            <div className="flex flex-wrap gap-3 mb-3">
              {newImagePreviews.map((preview, index) => (
                <div key={index} className="relative group">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-20 h-20 rounded-lg object-cover border-2 border-teal/30"
                  />
                  <button
                    type="button"
                    onClick={() => removeNewImage(index)}
                    className="absolute -top-2 -right-2 bg-coral text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
              isDragging
                ? 'border-teal bg-teal/5'
                : 'border-warmgray-300 hover:border-teal hover:bg-warmgray-50'
            }`}
          >
            <Upload className="h-8 w-8 text-warmgray-400 mx-auto mb-2" />
            <p className="text-sm text-warmgray-600">
              Drag & drop images here, or <span className="text-teal font-semibold">browse</span>
            </p>
            <p className="text-xs text-warmgray-400 mt-1">PNG, JPG up to 5MB each</p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => e.target.files && handleFilesSelected(e.target.files)}
            className="hidden"
          />
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-bold text-warmgray-700 mb-2">
            Price (₹) *
          </label>
          <input
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            className="w-full px-4 py-3 border-2 border-warmgray-200 rounded-xl focus:outline-none focus:border-teal transition-colors"
            required
          />
        </div>

        {/* Compare at Price */}
        <div>
          <label className="block text-sm font-bold text-warmgray-700 mb-2">
            Compare at Price (₹)
          </label>
          <input
            type="number"
            step="0.01"
            value={formData.compare_at_price}
            onChange={(e) => setFormData({ ...formData, compare_at_price: e.target.value })}
            className="w-full px-4 py-3 border-2 border-warmgray-200 rounded-xl focus:outline-none focus:border-teal transition-colors"
            placeholder="Original price for sale display"
          />
        </div>

        {/* Stock */}
        <div>
          <label className="block text-sm font-bold text-warmgray-700 mb-2">
            Stock Quantity *
          </label>
          <input
            type="number"
            value={formData.stock_quantity}
            onChange={(e) =>
              setFormData({ ...formData, stock_quantity: parseInt(e.target.value) || 0 })
            }
            className="w-full px-4 py-3 border-2 border-warmgray-200 rounded-xl focus:outline-none focus:border-teal transition-colors"
            required
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-bold text-warmgray-700 mb-2">
            Category
          </label>
          <select
            value={formData.category_id}
            onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
            className="w-full px-4 py-3 border-2 border-warmgray-200 rounded-xl focus:outline-none focus:border-teal transition-colors"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Age Range */}
        <div>
          <label className="block text-sm font-bold text-warmgray-700 mb-2">
            Age Range
          </label>
          <select
            value={formData.age_range}
            onChange={(e) => setFormData({ ...formData, age_range: e.target.value })}
            className="w-full px-4 py-3 border-2 border-warmgray-200 rounded-xl focus:outline-none focus:border-teal transition-colors"
          >
            <option value="">Select Age Range</option>
            <option value="0-2">0-2 years</option>
            <option value="2-4">2-4 years</option>
            <option value="4-6">4-6 years</option>
            <option value="6-8">6-8 years</option>
            <option value="8-12">8-12 years</option>
          </select>
        </div>

        {/* Featured */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="featured"
            checked={formData.featured}
            onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
            className="w-5 h-5 rounded border-warmgray-300 text-teal focus:ring-teal"
          />
          <label htmlFor="featured" className="text-sm font-bold text-warmgray-700">
            Featured Product
          </label>
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label className="block text-sm font-bold text-warmgray-700 mb-2">
            Short Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            rows={3}
            className="w-full px-4 py-3 border-2 border-warmgray-200 rounded-xl focus:outline-none focus:border-teal transition-colors resize-none"
            placeholder="Brief product description"
          />
        </div>

        {/* Long Description */}
        <div className="md:col-span-2">
          <label className="block text-sm font-bold text-warmgray-700 mb-2">
            Detailed Description
          </label>
          <textarea
            value={formData.long_description}
            onChange={(e) =>
              setFormData({ ...formData, long_description: e.target.value })
            }
            rows={5}
            className="w-full px-4 py-3 border-2 border-warmgray-200 rounded-xl focus:outline-none focus:border-teal transition-colors resize-none"
            placeholder="Full product description with details"
          />
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex items-center justify-end space-x-4 pt-6 border-t-2 border-warmgray-100">
        <button
          type="button"
          onClick={onClose}
          className="px-6 py-3 border-2 border-warmgray-300 text-warmgray-700 font-bold rounded-xl hover:bg-warmgray-100 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-3 bg-teal-gradient text-white font-bold rounded-xl shadow-soft hover-lift disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : product ? 'Update Product' : 'Add Product'}
        </button>
      </div>
    </form>
  );
};

export default Products;
