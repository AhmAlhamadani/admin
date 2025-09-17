import api from './index.js';

// Brand API functions
export const brandAPI = {
  // Get all brands with pagination and filtering
  getBrands: async (params = {}) => {
    const response = await api.get('/brands', { params });
    return response.data;
  },

  // Get single brand by ID or slug
  getBrand: async (identifier) => {
    const response = await api.get(`/brands/${identifier}`);
    return response.data;
  },

  // Create brand (JSON only)
  createBrand: async (brandData) => {
    const response = await api.post('/brands', brandData, {
      headers: { 'Content-Type': 'application/json' }
    });
    return response.data;
  },

  // Create brand with images
  createBrandWithImages: async (formData) => {
    const response = await api.post('/brands/with-images', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  // Update brand (full update)
  updateBrand: async (id, brandData) => {
    const response = await api.put(`/brands/${id}`, brandData, {
      headers: { 'Content-Type': 'application/json' }
    });
    return response.data;
  },

  // Partial update brand
  patchBrand: async (id, brandData) => {
    const response = await api.patch(`/brands/${id}`, brandData, {
      headers: { 'Content-Type': 'application/json' }
    });
    return response.data;
  },

  // Update brand with images
  updateBrandWithImages: async (id, formData) => {
    const response = await api.patch(`/brands/${id}/with-images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  // Soft delete brand
  deleteBrand: async (id) => {
    const response = await api.delete(`/brands/${id}`);
    return response.data;
  },

  // Hard delete brand
  hardDeleteBrand: async (id) => {
    const response = await api.delete(`/brands/${id}/hard`);
    return response.data;
  }
};

// File upload API functions
export const uploadAPI = {
  // Single file upload
  uploadSingle: async (file, destination) => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('destination', destination);
    
    const response = await api.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  // Multiple files upload
  uploadMultiple: async (files, destination) => {
    const formData = new FormData();
    files.forEach(file => formData.append('images', file));
    formData.append('destination', destination);
    
    const response = await api.post('/upload-multiple', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }
};
