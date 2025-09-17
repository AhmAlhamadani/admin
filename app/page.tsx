'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { brandAPI } from '../src/api/brandAPI';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

interface Brand {
  _id: string;
  slug: string;
  name: string;
  logo?: string;
  website?: string;
  established?: string;
  origin: {
    en: string;
    ar: string;
  };
  description: {
    en: string;
    ar: string;
  };
  products: {
    en: string[];
    ar: string[];
  };
  brandAdvantages: {
    en: string[];
    ar: string[];
  };
  mainImage?: string;
  galleryImages: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({
    current: 1,
    pages: 1,
    total: 0,
    limit: 10
  });

  // Fetch brands
  const fetchBrands = async (page = 1, search = '') => {
    try {
      setLoading(true);
      const response = await brandAPI.getBrands({
        page,
        limit: 10,
        search: search || undefined,
        isActive: true
      });
      
      setBrands(response.data);
      setPagination(response.pagination);
    } catch (error) {
      toast.error('Failed to fetch brands');
      console.error('Error fetching brands:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchBrands(1, searchTerm);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this brand?')) return;
    
    try {
      await brandAPI.deleteBrand(id);
      toast.success('Brand deleted successfully');
      fetchBrands(pagination.current, searchTerm);
    } catch (error) {
      toast.error('Failed to delete brand');
    }
  };

  const handleHardDelete = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this brand? This action cannot be undone.')) return;
    
    try {
      await brandAPI.hardDeleteBrand(id);
      toast.success('Brand permanently deleted');
      fetchBrands(pagination.current, searchTerm);
    } catch (error) {
      toast.error('Failed to permanently delete brand');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Brand Management</h1>
              <p className="text-gray-600">Manage your brand portfolio</p>
            </div>
            <button
              onClick={() => router.push('/create-brand')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Brand
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20">
        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search brands..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <button
              type="submit"
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Search
            </button>
          </form>
        </div>

        {/* Brands Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading brands...</p>
            </div>
          ) : brands.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-600">No brands found</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Brand
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Origin
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Established
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {brands.map((brand) => (
                      <tr key={brand._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {brand.logo && (
                              <img
                                className="h-10 w-10 rounded-full object-cover mr-4"
                                src={brand.logo}
                                alt={brand.name}
                              />
                            )}
                            <div>
                              <div className="text-sm font-medium text-gray-900">{brand.name}</div>
                              <div className="text-sm text-gray-500">{brand.slug}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {brand.origin.en}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {brand.established || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            brand.isActive 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {brand.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex gap-2">
                            <button
                              onClick={() => router.push(`/edit-brand/${brand._id}`)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(brand._id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button
                      onClick={() => fetchBrands(pagination.current - 1, searchTerm)}
                      disabled={pagination.current === 1}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => fetchBrands(pagination.current + 1, searchTerm)}
                      disabled={pagination.current === pagination.pages}
                      className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Showing{' '}
                        <span className="font-medium">
                          {(pagination.current - 1) * pagination.limit + 1}
                        </span>{' '}
                        to{' '}
                        <span className="font-medium">
                          {Math.min(pagination.current * pagination.limit, pagination.total)}
                        </span>{' '}
                        of{' '}
                        <span className="font-medium">{pagination.total}</span>{' '}
                        results
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                        <button
                          onClick={() => fetchBrands(pagination.current - 1, searchTerm)}
                          disabled={pagination.current === 1}
                          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                        >
                          Previous
                        </button>
                        {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                          <button
                            key={page}
                            onClick={() => fetchBrands(page, searchTerm)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              page === pagination.current
                                ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                            }`}
                          >
                            {page}
                          </button>
                        ))}
                        <button
                          onClick={() => fetchBrands(pagination.current + 1, searchTerm)}
                          disabled={pagination.current === pagination.pages}
                          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                        >
                          Next
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => router.push('/create-brand')}
          className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center"
          title="Add New Brand"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
