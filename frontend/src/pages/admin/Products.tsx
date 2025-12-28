import React, { useState } from 'react';
import { Plus, Edit, Trash2, Eye, Image as ImageIcon } from 'lucide-react';
import DataTable from '../../components/admin/DataTable';
import type { Column } from '../../components/admin/DataTable';
import Modal from '../../components/admin/Modal';
import toast from 'react-hot-toast';

interface Product {
  id: number;
  name: string;
  price: string;
  stock_quantity: number;
  category: string;
  status: string;
  image_url?: string;
}

const Products: React.FC = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);

  // Mock data - replace with actual API calls
  const products: Product[] = [
    {
      id: 1,
      name: 'ABC Learning Blocks',
      price: '₹1,299',
      stock_quantity: 45,
      category: 'Educational',
      status: 'active',
    },
    {
      id: 2,
      name: 'Alphabet Puzzle Set',
      price: '₹899',
      stock_quantity: 32,
      category: 'Puzzles',
      status: 'active',
    },
    {
      id: 3,
      name: 'Counting Bears Kit',
      price: '₹1,499',
      stock_quantity: 18,
      category: 'Educational',
      status: 'active',
    },
    {
      id: 4,
      name: 'Shape Sorter Toy',
      price: '₹749',
      stock_quantity: 0,
      category: 'Learning',
      status: 'out_of_stock',
    },
    {
      id: 5,
      name: 'Musical Xylophone',
      price: '₹1,199',
      stock_quantity: 28,
      category: 'Musical',
      status: 'active',
    },
  ];

  const columns: Column<Product>[] = [
    {
      key: 'name',
      label: 'Product Name',
      sortable: true,
      render: (product) => (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-warmgray-100 rounded-lg flex items-center justify-center">
            <ImageIcon className="h-5 w-5 text-warmgray-400" />
          </div>
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

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      toast.success('Product deleted successfully');
    }
  };

  const handleBulkDelete = () => {
    if (selectedProducts.length === 0) {
      toast.error('Please select products to delete');
      return;
    }
    if (
      window.confirm(
        `Are you sure you want to delete ${selectedProducts.length} products?`
      )
    ) {
      toast.success(`${selectedProducts.length} products deleted`);
      setSelectedProducts([]);
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
      <DataTable
        columns={columns}
        data={products}
        searchable
        searchPlaceholder="Search products..."
        emptyMessage="No products found"
      />

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
  const [formData, setFormData] = useState({
    name: product?.name || '',
    price: product?.price?.replace('₹', '').replace(',', '') || '',
    stock_quantity: product?.stock_quantity || 0,
    category: product?.category || '',
    description: '',
    age_range: '',
  });
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setImages(files);

      // Generate previews
      const previews = files.map((file) => URL.createObjectURL(file));
      setImagePreviews(previews);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(product ? 'Product updated successfully' : 'Product added successfully');
    onClose();
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

        {/* Price */}
        <div>
          <label className="block text-sm font-bold text-warmgray-700 mb-2">
            Price (₹) *
          </label>
          <input
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            className="w-full px-4 py-3 border-2 border-warmgray-200 rounded-xl focus:outline-none focus:border-teal transition-colors"
            required
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
              setFormData({ ...formData, stock_quantity: parseInt(e.target.value) })
            }
            className="w-full px-4 py-3 border-2 border-warmgray-200 rounded-xl focus:outline-none focus:border-teal transition-colors"
            required
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-bold text-warmgray-700 mb-2">
            Category *
          </label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-4 py-3 border-2 border-warmgray-200 rounded-xl focus:outline-none focus:border-teal transition-colors"
            required
          >
            <option value="">Select Category</option>
            <option value="Educational">Educational</option>
            <option value="Puzzles">Puzzles</option>
            <option value="Learning">Learning</option>
            <option value="Musical">Musical</option>
            <option value="Creative">Creative</option>
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
          </select>
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label className="block text-sm font-bold text-warmgray-700 mb-2">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            rows={4}
            className="w-full px-4 py-3 border-2 border-warmgray-200 rounded-xl focus:outline-none focus:border-teal transition-colors resize-none"
          />
        </div>

        {/* Images */}
        <div className="md:col-span-2">
          <label className="block text-sm font-bold text-warmgray-700 mb-2">
            Product Images
          </label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="w-full px-4 py-3 border-2 border-warmgray-200 rounded-xl focus:outline-none focus:border-teal transition-colors"
          />
          {imagePreviews.length > 0 && (
            <div className="grid grid-cols-4 gap-4 mt-4">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative aspect-square rounded-lg overflow-hidden border-2 border-warmgray-200">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
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
          className="px-6 py-3 bg-teal-gradient text-white font-bold rounded-xl shadow-soft hover-lift"
        >
          {product ? 'Update Product' : 'Add Product'}
        </button>
      </div>
    </form>
  );
};

export default Products;
