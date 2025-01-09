import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Edit2, Trash2, Package } from 'lucide-react';

const ManageProducts = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Dummy data - replace with your actual data
  const [products] = useState([
    {
      id: 1,
      title: "Organic Tomatoes",
      price: 4.99,
      stock: 150,
      image: "/api/placeholder/300/200",
      category: "Vegetables",
      type: "farmer"
    },
    {
      id: 2,
      title: "Fresh Apples",
      price: 2.99,
      stock: 200,
      image: "/api/placeholder/300/200",
      category: "Fruits",
      type: "farmer"
    },
    {
      id: 3,
      title: "Tractor XL-2000",
      price: 45000,
      stock: 5,
      image: "/api/placeholder/300/200",
      category: "Machine",
      type: "agribusiness"
    },
    {
      id: 4,
      title: "Organic Fertilizer",
      price: 29.99,
      stock: 75,
      image: "/api/placeholder/300/200",
      category: "Chemical",
      type: "agribusiness"
    },
    {
      id: 5,
      title: "Sweet Corn",
      price: 3.49,
      stock: 300,
      image: "/api/placeholder/300/200",
      category: "Vegetables",
      type: "farmer"
    }
  ]);

  // Filter products based on search term
  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (productId) => {
    navigate(`/edit-product-farmer/${productId}`);
  };

  const handleDelete = (product) => {
    setSelectedProduct(product);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    // Implement delete functionality here
    console.log('Deleting product:', selectedProduct.id);
    setShowDeleteModal(false);
    setSelectedProduct(null);
  };

  return (
    <div className="min-h-screen bg-green-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Manage Products</h1>
          <p className="mt-2 text-gray-600">View and manage all your listed products</p>
        </div>

        {/* Search and Stats Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-xl">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Search products by title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Stats */}
            <div className="flex gap-4 text-sm">
              <div className="px-4 py-2 bg-green-100 rounded-md">
                <span className="text-green-800 font-medium">{products.length}</span>
                <span className="ml-1 text-green-600">Total Products</span>
              </div>
              <div className="px-4 py-2 bg-blue-100 rounded-md">
                <span className="text-blue-800 font-medium">
                  {products.filter(p => p.stock > 0).length}
                </span>
                <span className="ml-1 text-blue-600">In Stock</span>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300"
            >
              {/* Product Image */}
              <div className="relative h-48 bg-gray-200">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-md text-sm font-medium text-gray-600">
                  {product.category}
                </div>
              </div>

              {/* Product Details */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {product.title}
                </h3>
                <div className="flex justify-between items-center mb-4">
                  <div className="text-2xl font-bold text-green-600">
                    ${product.price.toFixed(2)}
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-500">Stock:</span>
                    <span className={`ml-1 font-medium ${
                      product.stock > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {product.stock}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(product.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors duration-200"
                  >
                    <Edit2 className="h-4 w-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors duration-200"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No products found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? 'Try adjusting your search terms.' : 'Start by adding some products.'}
            </p>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Delete Product
              </h3>
              <p className="text-gray-600 mb-4">
                Are you sure you want to delete "{selectedProduct.title}"? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageProducts;