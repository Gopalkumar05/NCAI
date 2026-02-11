

// components/admin/ProductForm.jsx
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import adminService from '../../services/adminService';
const ProductForm = ({ product, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || '',
    discountPrice: product?.discountPrice || '',
    category: product?.category || '',
    occasion: product?.occasion || [],
    stock: product?.stock || '',
    tags: product?.tags?.join(', ') || '',
    isFeatured: product?.isFeatured || false,
    isAvailable: product?.isAvailable ?? true,
    images: product?.images || []
  });

  const [imageUrls, setImageUrls] = useState(['']);
  const [errors, setErrors] = useState({});
  const [uploading, setUploading] = useState(false);
  const [previewImages, setPreviewImages] = useState([]);

  const categories = [
    'Flowers', 'Plants', 'Gifts', 'Chocolates', 'Personalized',
    'Anniversary', 'Birthday', 'Wedding', 'Congratulations', 'Sympathy'
  ];

  const occasions = [
    'Birthday', 'Anniversary', 'Valentine\'s Day', 'Mother\'s Day',
    'Wedding', 'Graduation', 'Get Well', 'Sympathy', 'Congratulations',
    'Christmas', 'New Year', 'Corporate'
  ];

  useEffect(() => {
    // Populate image URLs when editing
    if (product?.images && product.images.length > 0) {
      const urls = product.images.map(img => img.url);
      setImageUrls([...urls, '']);
      setPreviewImages(urls);
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleOccasionChange = (occasion) => {
    setFormData(prev => ({
      ...prev,
      occasion: prev.occasion.includes(occasion)
        ? prev.occasion.filter(o => o !== occasion)
        : [...prev.occasion, occasion]
    }));
  };

  const handleImageUrlChange = (index, value) => {
    const newImageUrls = [...imageUrls];
    newImageUrls[index] = value;
    
    // Filter out empty URLs
    const filteredUrls = newImageUrls.filter(url => url.trim() !== '');
    setImageUrls(filteredUrls);
    setPreviewImages(filteredUrls);
    
    // Add empty field if last one is filled
    if (newImageUrls[newImageUrls.length - 1] !== '' && !value.endsWith('')) {
      setImageUrls([...filteredUrls, '']);
    }
  };

  const addImageUrlField = () => {
    setImageUrls([...imageUrls, '']);
  };

  const removeImageUrl = (index) => {
    const newImageUrls = [...imageUrls];
    newImageUrls.splice(index, 1);
    const filteredUrls = newImageUrls.filter(url => url.trim() !== '');
    setImageUrls(filteredUrls.length > 0 ? [...filteredUrls, ''] : ['']);
    setPreviewImages(filteredUrls);
  };

  // Add image upload function
 
  const handleImageUpload = async (file) => {
  try {
    setUploading(true);
    
    // Use the actual API
    const response = await adminService.uploadImage(file);
    
    if (response.data.success) {
      toast.success('Image uploaded successfully');
      return response.data;
    } else {
      throw new Error(response.data.message || 'Upload failed');
    }
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to upload image';
    toast.error(errorMessage);
    throw error;
  } finally {
    setUploading(false);
  }
};
  // Add file input for image upload
  const handleFileChange = async (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a valid image file (JPEG, PNG, JPG, WEBP, GIF)');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    try {
      const uploadedImage = await handleImageUpload(file);
      
      const newImageUrls = [...imageUrls];
      newImageUrls[index] = uploadedImage.url;
      
      // Filter out empty URLs
      const filteredUrls = newImageUrls.filter(url => url.trim() !== '');
      setImageUrls(filteredUrls);
      setPreviewImages(filteredUrls);
      
      // Add empty field for next image
      setImageUrls([...filteredUrls, '']);
      
      // Reset file input
      e.target.value = '';
    } catch (error) {
      console.error('Image upload error:', error);
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    
    if (!formData.price || isNaN(formData.price) || formData.price <= 0) {
      newErrors.price = 'Valid price is required';
    }
    
    if (formData.discountPrice && (isNaN(formData.discountPrice) || formData.discountPrice < 0)) {
      newErrors.discountPrice = 'Discount price must be a valid number';
    }
    
    if (formData.discountPrice && parseFloat(formData.discountPrice) >= parseFloat(formData.price)) {
      newErrors.discountPrice = 'Discount price must be less than regular price';
    }
    
    if (!formData.category) newErrors.category = 'Category is required';
    
    if (!formData.stock || isNaN(formData.stock) || formData.stock < 0) {
      newErrors.stock = 'Valid stock quantity is required';
    }
    
    // Validate at least one image
    const validImages = imageUrls.filter(url => url.trim() !== '');
    if (validImages.length === 0) {
      newErrors.images = 'At least one image is required';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      
      // Scroll to first error
      const firstErrorField = Object.keys(validationErrors)[0];
      const element = document.querySelector(`[name="${firstErrorField}"]`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      
      return;
    }

    // Process images
    const images = imageUrls
      .filter(url => url.trim() !== '')
      .map((url, index) => ({
        url,
        public_id: product?.images?.[index]?.public_id || `temp_${Date.now()}_${index}`,
        order: index
      }));

    // Process tags
    const tags = formData.tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    // Prepare data for submission
    const submissionData = {
      ...formData,
      price: parseFloat(formData.price),
      discountPrice: formData.discountPrice ? parseFloat(formData.discountPrice) : null,
      stock: parseInt(formData.stock),
      tags,
      images: images.length > 0 ? images : formData.images,
      occasion: formData.occasion.filter(occ => occ) // Remove any empty values
    };

    try {
      await onSubmit(submissionData);
      // Success handled by parent component
    } catch (error) {
      // Error handled by parent component
    }
  };

  const handlePasteImageUrl = async (e, index) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    
    // Check if pasted text looks like an image URL
    const imagePattern = /\.(jpg|jpeg|png|gif|webp|bmp)(\?.*)?$/i;
    if (imagePattern.test(pastedText)) {
      const newImageUrls = [...imageUrls];
      newImageUrls[index] = pastedText;
      setImageUrls(newImageUrls);
      
      // Update preview
      const filteredUrls = newImageUrls.filter(url => url.trim() !== '');
      setPreviewImages(filteredUrls);
    }
  };

  const removePreviewImage = (index) => {
    const newPreviewImages = [...previewImages];
    newPreviewImages.splice(index, 1);
    setPreviewImages(newPreviewImages);
    
    // Update image URLs
    setImageUrls(newPreviewImages.length > 0 ? [...newPreviewImages, ''] : ['']);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Basic Info */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`input-field ${errors.name ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}`}
                  placeholder="Enter product name"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className={`input-field ${errors.description ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}`}
                  placeholder="Enter product description"
                />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price ($) *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      step="0.01"
                      min="0"
                      className={`input-field pl-7 ${errors.price ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}`}
                      placeholder="0.00"
                    />
                  </div>
                  {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Discount Price ($)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      name="discountPrice"
                      value={formData.discountPrice}
                      onChange={handleChange}
                      step="0.01"
                      min="0"
                      className={`input-field pl-7 ${errors.discountPrice ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}`}
                      placeholder="Optional"
                    />
                  </div>
                  {errors.discountPrice && <p className="text-red-500 text-sm mt-1">{errors.discountPrice}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stock Quantity *
                </label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  min="0"
                  className={`input-field ${errors.stock ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}`}
                  placeholder="Enter stock quantity"
                />
                {errors.stock && <p className="text-red-500 text-sm mt-1">{errors.stock}</p>}
              </div>
            </div>
          </div>

          {/* Category and Tags */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Categorization</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={`input-field ${errors.category ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}`}
                >
                  <option value="">Select a category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Occasions
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {occasions.map(occasion => (
                    <label key={occasion} className="flex items-center p-2 hover:bg-gray-50 rounded">
                      <input
                        type="checkbox"
                        checked={formData.occasion.includes(occasion)}
                        onChange={() => handleOccasionChange(occasion)}
                        className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{occasion}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="e.g., roses, romantic, fresh, bouquet"
                />
                <p className="text-xs text-gray-500 mt-1">Separate tags with commas</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Images and Status */}
        <div className="space-y-6">
          {/* Image Upload */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Images</h3>
            
            {errors.images && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{errors.images}</p>
              </div>
            )}
            
            {/* Image Preview */}
            {previewImages.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preview
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {previewImages.map((url, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={url}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border border-gray-200"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => removePreviewImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Image URL Inputs */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image URLs {uploading && <span className="text-yellow-600 ml-2">(Uploading...)</span>}
              </label>
              
              {imageUrls.map((url, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => handleImageUrlChange(index, e.target.value)}
                    onPaste={(e) => handlePasteImageUrl(e, index)}
                    className="input-field text-sm flex-1"
                    placeholder="https://example.com/image.jpg"
                    disabled={uploading}
                  />
                  
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, index)}
                    className="hidden"
                    id={`file-upload-${index}`}
                    disabled={uploading}
                  />
                  
                  <label
                    htmlFor={`file-upload-${index}`}
                    className={`btn-secondary whitespace-nowrap ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    Upload
                  </label>
                  
                  {index < imageUrls.length - 1 && (
                    <button
                      type="button"
                      onClick={() => removeImageUrl(index)}
                      className="btn-danger whitespace-nowrap"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
              
              <button
                type="button"
                onClick={addImageUrlField}
                className="text-sm text-primary-600 hover:text-primary-800 flex items-center"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add another image URL
              </button>
              
              <div className="text-xs text-gray-500 mt-2">
                <p>• Add image URLs or upload files</p>
                <p>• Supported formats: JPG, PNG, GIF, WEBP</p>
                <p>• Maximum file size: 5MB</p>
                <p>• First image will be used as main product image</p>
              </div>
            </div>
          </div>

          {/* Product Status */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Status</h3>
            
            <div className="space-y-4">
              <label className="flex items-start">
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleChange}
                  className="mt-1 h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <div className="ml-3">
                  <span className="text-sm font-medium text-gray-700">Featured Product</span>
                  <p className="text-xs text-gray-500 mt-1">
                    Featured products will be highlighted on the homepage
                  </p>
                </div>
              </label>

              <label className="flex items-start">
                <input
                  type="checkbox"
                  name="isAvailable"
                  checked={formData.isAvailable}
                  onChange={handleChange}
                  className="mt-1 h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <div className="ml-3">
                  <span className="text-sm font-medium text-gray-700">Available for purchase</span>
                  <p className="text-xs text-gray-500 mt-1">
                    Uncheck to temporarily hide product from customers
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Validation Summary */}
          {Object.keys(errors).length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h4 className="text-sm font-medium text-red-800">Please fix the following errors:</h4>
              </div>
              <ul className="mt-2 text-sm text-red-700 list-disc list-inside">
                {Object.entries(errors).map(([field, message]) => (
                  <li key={field}>{message}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="btn-secondary px-6 py-2"
          disabled={uploading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn-primary px-6 py-2"
          disabled={uploading}
        >
          {uploading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Processing...
            </span>
          ) : (
            product ? 'Update Product' : 'Create Product'
          )}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;