'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { brandAPI } from '../../src/api/brandAPI';
import { ArrowLeft, Upload, Plus, Trash2, Save } from 'lucide-react';
import toast from 'react-hot-toast';

interface BrandFormData {
  slug: string;
  name: string;
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
}

export default function CreateBrandPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<BrandFormData>({
    defaultValues: {
      slug: '',
      name: '',
      website: '',
      established: '',
      origin: { en: '', ar: '' },
      description: { en: '', ar: '' },
      products: { en: [], ar: [] },
      brandAdvantages: { en: [], ar: [] }
    }
  });

  const [productsEn, setProductsEn] = useState<string[]>([]);
  const [productsAr, setProductsAr] = useState<string[]>([]);
  const [advantagesEn, setAdvantagesEn] = useState<string[]>([]);
  const [advantagesAr, setAdvantagesAr] = useState<string[]>([]);

  const addProduct = (lang: 'en' | 'ar', value: string) => {
    if (value.trim()) {
      if (lang === 'en') {
        const newProducts = [...productsEn, value.trim()];
        setProductsEn(newProducts);
        setValue('products.en', newProducts);
      } else {
        const newProducts = [...productsAr, value.trim()];
        setProductsAr(newProducts);
        setValue('products.ar', newProducts);
      }
    }
  };

  const removeProduct = (lang: 'en' | 'ar', index: number) => {
    if (lang === 'en') {
      const newProducts = productsEn.filter((_, i) => i !== index);
      setProductsEn(newProducts);
      setValue('products.en', newProducts);
    } else {
      const newProducts = productsAr.filter((_, i) => i !== index);
      setProductsAr(newProducts);
      setValue('products.ar', newProducts);
    }
  };

  const addAdvantage = (lang: 'en' | 'ar', value: string) => {
    if (value.trim()) {
      if (lang === 'en') {
        const newAdvantages = [...advantagesEn, value.trim()];
        setAdvantagesEn(newAdvantages);
        setValue('brandAdvantages.en', newAdvantages);
      } else {
        const newAdvantages = [...advantagesAr, value.trim()];
        setAdvantagesAr(newAdvantages);
        setValue('brandAdvantages.ar', newAdvantages);
      }
    }
  };

  const removeAdvantage = (lang: 'en' | 'ar', index: number) => {
    if (lang === 'en') {
      const newAdvantages = advantagesEn.filter((_, i) => i !== index);
      setAdvantagesEn(newAdvantages);
      setValue('brandAdvantages.en', newAdvantages);
    } else {
      const newAdvantages = advantagesAr.filter((_, i) => i !== index);
      setAdvantagesAr(newAdvantages);
      setValue('brandAdvantages.ar', newAdvantages);
    }
  };

  const handleFileChange = (type: 'logo' | 'mainImage' | 'gallery', file: File | FileList | null) => {
    if (!file) return;

    if (type === 'logo' && file instanceof File) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setLogoPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    } else if (type === 'mainImage' && file instanceof File) {
      setMainImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setMainImagePreview(e.target?.result as string);
      reader.readAsDataURL(file);
    } else if (type === 'gallery' && file instanceof FileList) {
      const files = Array.from(file);
      setGalleryFiles(files);
      const readers = files.map(f => {
        const reader = new FileReader();
        reader.onload = (e) => {
          setGalleryPreviews(prev => [...prev, e.target?.result as string]);
        };
        reader.readAsDataURL(f);
        return reader;
      });
    }
  };

  const onSubmit = async (data: BrandFormData) => {
    try {
      setLoading(true);

      const hasFiles = logoFile || mainImageFile || galleryFiles.length > 0;

      if (hasFiles) {
        const formData = new FormData();
        formData.append('brandData', JSON.stringify(data));

        if (logoFile) formData.append('logo', logoFile);
        if (mainImageFile) formData.append('mainImage', mainImageFile);
        galleryFiles.forEach(file => formData.append('galleryImages', file));

        await brandAPI.createBrandWithImages(formData);
      } else {
        await brandAPI.createBrand(data);
      }

      toast.success('Brand created successfully');
      router.push('/');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to create brand');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Create New Brand</h1>
          <p className="text-gray-600 mt-2">Add a new brand to your portfolio</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Basic Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6 border-b border-gray-200 pb-2">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Brand Name *
                  </label>
                  <input
                    {...register('name', { required: 'Brand name is required' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter brand name"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Slug *
                  </label>
                  <input
                    {...register('slug', { 
                      required: 'Slug is required',
                      pattern: {
                        value: /^[a-z0-9-]+$/,
                        message: 'Slug can only contain lowercase letters, numbers, and hyphens'
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="brand-slug"
                  />
                  {errors.slug && (
                    <p className="text-red-500 text-sm mt-1">{errors.slug.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website
                  </label>
                  <input
                    {...register('website')}
                    type="url"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Established Year
                  </label>
                  <input
                    {...register('established')}
                    pattern="[0-9]{4}"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="2023"
                  />
                </div>
              </div>
            </div>

            {/* Origin */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6 border-b border-gray-200 pb-2">Origin</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    English *
                  </label>
                  <input
                    {...register('origin.en', { required: 'English origin is required' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter origin in English"
                  />
                  {errors.origin?.en && (
                    <p className="text-red-500 text-sm mt-1">{errors.origin.en.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Arabic *
                  </label>
                  <input
                    {...register('origin.ar', { required: 'Arabic origin is required' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="أدخل المنشأ بالعربية"
                  />
                  {errors.origin?.ar && (
                    <p className="text-red-500 text-sm mt-1">{errors.origin.ar.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6 border-b border-gray-200 pb-2">Description</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    English *
                  </label>
                  <textarea
                    {...register('description.en', { required: 'English description is required' })}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter description in English"
                  />
                  {errors.description?.en && (
                    <p className="text-red-500 text-sm mt-1">{errors.description.en.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Arabic *
                  </label>
                  <textarea
                    {...register('description.ar', { required: 'Arabic description is required' })}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="أدخل الوصف بالعربية"
                  />
                  {errors.description?.ar && (
                    <p className="text-red-500 text-sm mt-1">{errors.description.ar.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Products */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6 border-b border-gray-200 pb-2">Products</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    English Products
                  </label>
                  <div className="space-y-2">
                    {productsEn.map((product, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <span className="flex-1 px-3 py-2 bg-gray-100 rounded-lg">{product}</span>
                        <button
                          type="button"
                          onClick={() => removeProduct('en', index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Add product"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addProduct('en', e.currentTarget.value);
                            e.currentTarget.value = '';
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                          addProduct('en', input.value);
                          input.value = '';
                        }}
                        className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Arabic Products
                  </label>
                  <div className="space-y-2">
                    {productsAr.map((product, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <span className="flex-1 px-3 py-2 bg-gray-100 rounded-lg">{product}</span>
                        <button
                          type="button"
                          onClick={() => removeProduct('ar', index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="أضف منتج"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addProduct('ar', e.currentTarget.value);
                            e.currentTarget.value = '';
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                          addProduct('ar', input.value);
                          input.value = '';
                        }}
                        className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Brand Advantages */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6 border-b border-gray-200 pb-2">Brand Advantages</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    English Advantages
                  </label>
                  <div className="space-y-2">
                    {advantagesEn.map((advantage, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <span className="flex-1 px-3 py-2 bg-gray-100 rounded-lg">{advantage}</span>
                        <button
                          type="button"
                          onClick={() => removeAdvantage('en', index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Add advantage"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addAdvantage('en', e.currentTarget.value);
                            e.currentTarget.value = '';
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                          addAdvantage('en', input.value);
                          input.value = '';
                        }}
                        className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Arabic Advantages
                  </label>
                  <div className="space-y-2">
                    {advantagesAr.map((advantage, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <span className="flex-1 px-3 py-2 bg-gray-100 rounded-lg">{advantage}</span>
                        <button
                          type="button"
                          onClick={() => removeAdvantage('ar', index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="أضف ميزة"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addAdvantage('ar', e.currentTarget.value);
                            e.currentTarget.value = '';
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                          addAdvantage('ar', input.value);
                          input.value = '';
                        }}
                        className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Image Uploads */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6 border-b border-gray-200 pb-2">Images</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Logo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Logo
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    {logoPreview ? (
                      <div className="space-y-2">
                        <img src={logoPreview} alt="Logo preview" className="w-full h-24 object-contain" />
                        <button
                          type="button"
                          onClick={() => {
                            setLogoFile(null);
                            setLogoPreview(null);
                          }}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <div>
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange('logo', e.target.files?.[0] || null)}
                          className="hidden"
                          id="logo-upload"
                        />
                        <label
                          htmlFor="logo-upload"
                          className="cursor-pointer text-sm text-gray-600 hover:text-gray-800"
                        >
                          Upload Logo
                        </label>
                      </div>
                    )}
                  </div>
                </div>

                {/* Main Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Main Image
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    {mainImagePreview ? (
                      <div className="space-y-2">
                        <img src={mainImagePreview} alt="Main image preview" className="w-full h-24 object-cover" />
                        <button
                          type="button"
                          onClick={() => {
                            setMainImageFile(null);
                            setMainImagePreview(null);
                          }}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <div>
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange('mainImage', e.target.files?.[0] || null)}
                          className="hidden"
                          id="main-image-upload"
                        />
                        <label
                          htmlFor="main-image-upload"
                          className="cursor-pointer text-sm text-gray-600 hover:text-gray-800"
                        >
                          Upload Main Image
                        </label>
                      </div>
                    )}
                  </div>
                </div>

                {/* Gallery Images */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gallery Images
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => handleFileChange('gallery', e.target.files)}
                      className="hidden"
                      id="gallery-upload"
                    />
                    <label
                      htmlFor="gallery-upload"
                      className="cursor-pointer text-sm text-gray-600 hover:text-gray-800"
                    >
                      Upload Gallery Images
                    </label>
                    {galleryPreviews.length > 0 && (
                      <div className="mt-2 text-xs text-gray-500">
                        {galleryPreviews.length} image(s) selected
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-4 pt-8 border-t border-gray-200">
              <button
                type="button"
                onClick={() => router.push('/')}
                className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2 font-medium transition-colors"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <Save className="w-5 h-5" />
                )}
                Create Brand
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
