import React, { useReducer, useEffect, useCallback, useState } from 'react';
import axios from 'axios';
import AdminLayout from '../../../components/layout/AdminLayout';
import { useRouter } from 'next/router';
import { useDropzone } from 'react-dropzone';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Editor from '../../../components/univisport/Editor';
import { debounce } from 'lodash';

// Vietnamese to ASCII for slug generation
const vietnameseToAscii = (str) => {
  const vietnameseMap = {
    'à': 'a', 'á': 'a', 'ả': 'a', 'ã': 'a', 'ạ': 'a',
    'ă': 'a', 'ằ': 'a', 'ắ': 'a', 'ẳ': 'a', 'ẵ': 'a', 'ặ': 'a',
    'â': 'a', 'ầ': 'a', 'ấ': 'a', 'ẩ': 'a', 'ẫ': 'a', 'ậ': 'a',
    'è': 'e', 'é': 'e', 'ẻ': 'e', 'ẽ': 'e', 'ẹ': 'e',
    'ê': 'e', 'ề': 'e', 'ế': 'e', 'ể': 'e', 'ễ': 'e', 'ệ': 'e',
    'ì': 'i', 'í': 'i', 'ỉ': 'i', 'ĩ': 'i', 'ị': 'i',
    'ò': 'o', 'ó': 'o', 'ỏ': 'o', 'õ': 'o', 'ọ': 'o',
    'ô': 'o', 'ồ': 'o', 'ố': 'o', 'ổ': 'o', 'ỗ': 'o', 'ộ': 'o',
    'ơ': 'o', 'ờ': 'o', 'ớ': 'o', 'ở': 'o', 'ỡ': 'o', 'ợ': 'o',
    'ù': 'u', 'ú': 'u', 'ủ': 'u', 'ũ': 'u', 'ụ': 'u',
    'ư': 'u', 'ừ': 'u', 'ứ': 'u', 'ử': 'u', 'ữ': 'u', 'ự': 'u',
    'ỳ': 'y', 'ý': 'y', 'ỷ': 'y', 'ỹ': 'y', 'ỵ': 'y',
    'đ': 'd',
    'À': 'A', 'Á': 'A', 'Ả': 'A', 'Ã': 'A', 'Ạ': 'A',
    'Ă': 'A', 'Ằ': 'A', 'Ắ': 'A', 'Ẳ': 'A', 'Ẵ': 'A', 'Ặ': 'A',
    'Â': 'A', 'Ầ': 'A', 'Ấ': 'A', 'Ẩ': 'A', 'Ẫ': 'A', 'Ậ': 'A',
    'È': 'E', 'É': 'E', 'Ẻ': 'E', 'Ẽ': 'E', 'Ẹ': 'E',
    'Ê': 'E', 'Ề': 'E', 'Ế': 'E', 'Ể': 'E', 'Ễ': 'E', 'Ệ': 'E',
    'Ì': 'I', 'Í': 'I', 'Ỉ': 'I', 'Ĩ': 'I', 'Ị': 'I',
    'Ò': 'O', 'Ó': 'O', 'Ỏ': 'O', 'Õ': 'O', 'Ọ': 'O',
    'Ô': 'O', 'Ồ': 'O', 'Ố': 'O', 'Ổ': 'O', 'Ỗ': 'O', 'Ộ': 'O',
    'Ơ': 'O', 'Ờ': 'O', 'Ớ': 'O', 'Ở': 'O', 'Ỡ': 'O', 'Ợ': 'O',
    'Ù': 'U', 'Ú': 'U', 'Ủ': 'U', 'Ũ': 'U', 'Ụ': 'U',
    'Ư': 'U', 'Ừ': 'U', 'Ứ': 'U', 'Ử': 'U', 'Ữ': 'U', 'Ự': 'U',
    'Ỳ': 'Y', 'Ý': 'Y', 'Ỷ': 'Y', 'Ỹ': 'Y', 'Ỵ': 'Y',
    'Đ': 'D',
  };
  return str.replace(/./g, (char) => vietnameseMap[char] || char);
};

// Generate slug from title
const generateSlug = (title) =>
  vietnameseToAscii(title)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .trim();

// Transform Cloudinary URL to relative path
const toRelativePath = (url) => {
  if (!url) return '';
  if (url.startsWith('/') && !url.includes('/image/upload/') && !url.includes('djbmybqt2')) {
    return url;
  }
  const parts = url.split('/');
  const versionIndex = parts.findIndex((part) => part.startsWith('v') && !isNaN(part.slice(1)));
  if (versionIndex !== -1 && parts[versionIndex - 1] === 'image' && parts[versionIndex - 2] === 'upload') {
    return `/${parts.slice(versionIndex + 1).join('/')}`;
  }
  const cloudNameIndex = parts.findIndex((part) => part === 'djbmybqt2');
  if (cloudNameIndex !== -1 && parts.length > cloudNameIndex + 1) {
    return `/${parts.slice(cloudNameIndex + 1).join('/')}`;
  }
  return url.startsWith('/') ? url : `/${url.split('/').pop()}`;
};

// Transform relative path to full Cloudinary URL
const toCloudinaryUrl = (relativePath) => {
  if (!relativePath) return '';
  const cleanPath = relativePath.startsWith('/') ? relativePath.slice(1) : relativePath;
  return `https://res.cloudinary.com/djbmybqt2/${cleanPath}`;
};

// Initial state
const initialState = {
  maSanPham: '',
  name: '',
  image: [],
  slug: '',
  content: '',
  description: '',
  category: '',
  categoryNameVN: '',
  price: 0,
  promotionalPrice: 0,
  isNew: false,
  isFeatured: false,
  rating: 0,
  reviewCount: 0,
  stockStatus: 'Còn hàng',
  unit: 'Kg', // Added unit field
};

// Reducer
function reducer(state, action) {
  switch (action.type) {
    case 'UPDATE_FIELD':
      return { ...state, [action.field]: action.value };
    case 'SET_PRODUCT':
      return { ...action.payload };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

// Categories
const categories = [
  { categoryNameVN: 'Rau ăn lá', category: 'rau-an-la' },
  { categoryNameVN: 'Củ, quả, hạt', category: 'cu-qua-hat' },
  { categoryNameVN: 'Đồ khô sấy lạng', category: 'do-kho-say-lanh' },
  { categoryNameVN: 'Rau gia vị', category: 'rau-gia-vi' },
  { categoryNameVN: 'Sản phẩm OCOP', category: 'san-pham-ocop' },


];

export default function CreateProductPage() {
  const router = useRouter();
  const { _id } = router.query;
  const [formData, dispatch] = useReducer(reducer, initialState);
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [cloudinaryImages, setCloudinaryImages] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSlugEdited, setIsSlugEdited] = useState(false);
  const [originalSlug, setOriginalSlug] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newProductMaSanPham, setNewProductMaSanPham] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Add error helper
  const addError = (message) => {
    setErrors((prev) => (prev.includes(message) ? prev : [...prev, message]));
    toast.error(message, { position: 'top-right', autoClose: 3000 });
  };

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isModalOpen]);

  // Clean up blob URLs
  useEffect(() => {
    return () => {
      images.forEach((img) => {
        if (img.preview?.startsWith('blob:')) {
          URL.revokeObjectURL(img.preview);
        }
      });
    };
  }, [images]);

  // Fetch product for editing
  const fetchProduct = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`/api/products?_id=${_id}`);
      const product = response.data.product || {};
      const selCat = categories.find((c) => c.category === product.category) || {};

      dispatch({
        type: 'SET_PRODUCT',
        payload: {
          maSanPham: product.maSanPham || '',
          name: product.name || '',
          image: Array.isArray(product.image) ? product.image : [],
          slug: product.slug || '',
          content: product.content || '',
          description: product.description || '',
          category: product.category || '',
          categoryNameVN: selCat.categoryNameVN || product.categoryNameVN || '',
          price: product.price || 0,
          promotionalPrice: product.promotionalPrice || 0,
          isNew: product.isNew || false,
          isFeatured: product.isFeatured || false,
          rating: product.rating || 0,
          reviewCount: product.reviewCount || 0,
          stockStatus: product.stockStatus || 'Còn hàng',
          unit: product.unit || 'Kg', // Added unit
        },
      });

      if (Array.isArray(product.image) && product.image.length > 0) {
        setImages(product.image.map((src) => ({ src, preview: toCloudinaryUrl(src) })));
      }
      setIsSlugEdited(true);
      setOriginalSlug(product.slug || '');
    } catch (err) {
      console.error('Error fetching product:', err);
      addError('Không thể tải sản phẩm');
    } finally {
      setIsLoading(false);
    }
  }, [_id]);

  // Fetch Cloudinary images
  const fetchCloudinaryImages = useCallback(async () => {
    try {
      const res = await axios.get('/api/image');
      setCloudinaryImages(res.data.images.map((img) => img.src));
    } catch (err) {
      addError('Không thể tải danh sách ảnh');
    }
  }, []);

  useEffect(() => {
    if (_id) fetchProduct();
    fetchCloudinaryImages();
  }, [_id, fetchProduct, fetchCloudinaryImages]);

  // Handle name change
  const handleNameChange = (e) => {
    const name = e.target.value;
    dispatch({ type: 'UPDATE_FIELD', field: 'name', value: name });
    if (!isSlugEdited) {
      dispatch({ type: 'UPDATE_FIELD', field: 'slug', value: generateSlug(name) });
    }
  };

  // Handle slug change
  const handleSlugChange = (e) => {
    setIsSlugEdited(true);
    dispatch({ type: 'UPDATE_FIELD', field: 'slug', value: e.target.value.trim().toLowerCase() });
  };

  // Handle maSanPham change
  const handleMaSanPhamChange = (e) => {
    dispatch({ type: 'UPDATE_FIELD', field: 'maSanPham', value: e.target.value });
  };

  // Handle description change
  const handleDescriptionChange = (e) => {
    dispatch({ type: 'UPDATE_FIELD', field: 'description', value: e.target.value });
  };

  // Handle content change
  const handleContentChange = (content) => {
    const sanitizedContent = typeof content === 'string' ? content : '';
    dispatch({ type: 'UPDATE_FIELD', field: 'content', value: sanitizedContent });
  };

  // Handle category change
  const handleCategoryChange = (e) => {
    const selectedCategory = categories.find((cat) => cat.category === e.target.value);
    dispatch({
      type: 'UPDATE_FIELD',
      field: 'category',
      value: e.target.value,
    });
    dispatch({
      type: 'UPDATE_FIELD',
      field: 'categoryNameVN',
      value: selectedCategory ? selectedCategory.categoryNameVN : '',
    });
  };

  // Handle image drop and upload
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
    },
    multiple: true,
    maxSize: 5 * 1024 * 1024,
    onDrop: async (acceptedFiles, rejectedFiles) => {
      if (rejectedFiles.length > 0) {
        addError('Chỉ hỗ trợ file JPEG, JPG, PNG, WEBP dưới 5MB');
        return;
      }
      setErrors((prev) => prev.filter((err) => err !== 'Chỉ hỗ trợ file JPEG, JPG, PNG, WEBP dưới 5MB'));

      const newImages = acceptedFiles.map((file) => ({
        src: '',
        preview: URL.createObjectURL(file),
        file,
      }));
      setImages((prev) => [...prev, ...newImages]);

      setUploading(true);
      try {
        const uploadedUrls = [];
        for (const img of newImages) {
          const uploadFormData = new FormData();
          uploadFormData.append('image', img.file);
          const response = await axios.post('/api/image', uploadFormData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
          uploadedUrls.push(response.data.src);
        }
        const relativePaths = uploadedUrls.map(toRelativePath);
        setImages((prev) => [
          ...prev.slice(0, prev.length - newImages.length),
          ...newImages.map((img, i) => ({
            src: relativePaths[i],
            preview: uploadedUrls[i],
            file: null,
          })),
        ]);
        dispatch({
          type: 'UPDATE_FIELD',
          field: 'image',
          value: [...formData.image, ...relativePaths],
        });
      } catch (error) {
        console.error('Error uploading images:', error.response?.data || error.message);
        addError('Không thể upload ảnh');
        setImages([]);
        dispatch({ type: 'UPDATE_FIELD', field: 'image', value: [] });
      } finally {
        setUploading(false);
      }
    },
  });

  // Handle Cloudinary image selection
  const handleSelectImage = (src) => {
    const relativePath = toRelativePath(src);
    setImages((prev) => [...prev, { src: relativePath, preview: src }]);
    dispatch({
      type: 'UPDATE_FIELD',
      field: 'image',
      value: [...formData.image, relativePath],
    });
    setIsModalOpen(false);
  };

  // Check slug availability
  const checkSlug = async (slug, productId = null) => {
    try {
      const normalizedSlug = slug.trim().toLowerCase();
      const response = await axios.post('/api/products', { action: 'checkSlug', slug: normalizedSlug, _id: productId });
      return response.data.status === 'success';
    } catch (error) {
      console.error('Error checking slug:', error.response?.data || error.message);
      return false;
    }
  };

  // Debounce slug check
  const debouncedCheckSlug = useCallback(
    debounce(async (slug, productId) => {
      const isValid = await checkSlug(slug, productId);
      if (!isValid) {
        addError('Slug đã tồn tại, vui lòng chọn slug khác');
      } else {
        setErrors((prev) => prev.filter((err) => err !== 'Slug đã tồn tại, vui lòng chọn slug khác'));
      }
    }, 500),
    []
  );

  useEffect(() => {
    if (formData.slug && (!_id || formData.slug !== originalSlug)) {
      debouncedCheckSlug(formData.slug, _id);
    }
  }, [formData.slug, _id, originalSlug, debouncedCheckSlug]);

  // Reset form
  const resetForm = () => {
    dispatch({ type: 'RESET' });
    images.forEach((img) => {
      if (img.preview?.startsWith('blob:')) {
        URL.revokeObjectURL(img.preview);
      }
    });
    setImages([]);
    setIsSlugEdited(false);
    setOriginalSlug('');
    setErrors([]);
    setNewProductMaSanPham(null);
  };

  // Handle image removal
  const handleRemoveImage = (index) => {
    setImages((prev) => {
      const newImages = prev.filter((_, i) => i !== index);
      if (prev[index].preview?.startsWith('blob:')) {
        URL.revokeObjectURL(prev[index].preview);
      }
      return newImages;
    });
    dispatch({
      type: 'UPDATE_FIELD',
      field: 'image',
      value: formData.image.filter((_, i) => i !== index),
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    setIsSubmitting(true);

    try {
      // Client-side validation
      if (!formData.name) {
        addError('Tên sản phẩm là bắt buộc');
        setIsSubmitting(false);
        return;
      }
      if (!formData.maSanPham) {
        addError('Mã sản phẩm là bắt buộc');
        setIsSubmitting(false);
        return;
      }
      if (!/^[A-Za-z0-9_-]+$/.test(formData.maSanPham)) {
        addError('Mã sản phẩm chỉ được chứa chữ cái, số, dấu gạch dưới hoặc gạch ngang');
        setIsSubmitting(false);
        return;
      }
      if (!formData.slug) {
        addError('Slug là bắt buộc');
        setIsSubmitting(false);
        return;
      }
      if (!formData.category) {
        addError('Danh mục là bắt buộc');
        setIsSubmitting(false);
        return;
      }
      if (!formData.categoryNameVN) {
        addError('Tên danh mục là bắt buộc');
        setIsSubmitting(false);
        return;
      }
      if (!formData.description) {
        addError('Mô tả là bắt buộc');
        setIsSubmitting(false);
        return;
      }
      if (!formData.image.length) {
        addError('Vui lòng tải lên ít nhất một ảnh sản phẩm');
        setIsSubmitting(false);
        return;
      }
      if (formData.price < 0) {
        addError('Giá gốc không được âm');
        setIsSubmitting(false);
        return;
      }
      if (formData.promotionalPrice < 0) {
        addError('Giá khuyến mãi không được âm');
        setIsSubmitting(false);
        return;
      }
      if (formData.promotionalPrice && formData.promotionalPrice > formData.price) {
        addError('Giá khuyến mãi không được lớn hơn giá gốc');
        setIsSubmitting(false);
        return;
      }
      if (formData.rating < 0 || formData.rating > 5) {
        addError('Đánh giá phải từ 0 đến 5');
        setIsSubmitting(false);
        return;
      }
      if (formData.reviewCount < 0) {
        addError('Số lượng đánh giá không được âm');
        setIsSubmitting(false);
        return;
      }
      if (!['Còn hàng', 'Hết hàng'].includes(formData.stockStatus)) {
        addError('Tình trạng kho phải là "Còn hàng" hoặc "Hết hàng"');
        setIsSubmitting(false);
        return;
      }
      if (!['Kg', 'gam', 'túi', 'chai'].includes(formData.unit)) {
        addError('Đơn vị phải là Kg, gam, túi hoặc chai');
        setIsSubmitting(false);
        return;
      }

      // Ensure all images are uploaded
      if (images.some((img) => img.file)) {
        addError('Vui lòng chờ tất cả ảnh được tải lên');
        setIsSubmitting(false);
        return;
      }

      // Construct product data
      const productData = {
        maSanPham: formData.maSanPham,
        name: formData.name,
        image: formData.image,
        slug: formData.slug.trim().toLowerCase(),
        content: formData.content,
        description: formData.description,
        category: formData.category,
        categoryNameVN: formData.categoryNameVN,
        price: formData.price,
        promotionalPrice: formData.promotionalPrice,
        isNew: formData.isNew,
        isFeatured: formData.isFeatured,
        rating: Number(formData.rating),
        reviewCount: formData.reviewCount,
        stockStatus: formData.stockStatus,
        unit: formData.unit, // Added unit
      };

      // Validate slug
      let isSlugValid = true;
      if (!_id || formData.slug !== originalSlug) {
        isSlugValid = await checkSlug(formData.slug, _id);
        if (!isSlugValid) {
          addError('Slug đã tồn tại, vui lòng chọn slug khác');
          setIsSubmitting(false);
          return;
        }
      }

      // Submit to backend
      if (_id) {
        await axios.put(`/api/products?_id=${_id}`, productData);
        setErrors([]);
        toast.success('Sản phẩm đã được cập nhật thành công!', {
          position: 'top-right',
          autoClose: 3000,
        });
        router.push('/dashboard/san-pham');
      } else {
        const response = await axios.post('/api/products', productData);
        if (response.data.status === 'success') {
          setNewProductMaSanPham(formData.maSanPham);
          setErrors([]);
          toast.success(`Sản phẩm đã được thêm thành công! Mã sản phẩm: ${formData.maSanPham}`, {
            position: 'top-right',
            autoClose: 3000,
          });
          resetForm();
        } else {
          throw new Error(response.data.err || 'Không thể tạo sản phẩm');
        }
      }
    } catch (error) {
      console.error('API error:', error.response?.data || error.message);
      const errorMessage = error.response?.data?.err || 'Không thể lưu sản phẩm';
      addError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout title={_id ? 'Sửa sản phẩm' : 'Thêm sản phẩm'}>
      <div className="product-form-container">
        <div className="product-form-header">
          <h2 className='uppercase'>{_id ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}</h2>
          <p>Quản lý thông tin sản phẩm của bạn một cách dễ dàng</p>
        </div>

        {errors.length > 0 && (
          <div className="error-messages">
            {errors.map((error, idx) => (
              <div key={idx} className="error-message" id={`error-${idx}`}>
                {error}
              </div>
            ))}
          </div>
        )}

        {newProductMaSanPham && !_id && (
          <div className="success-message">
            Sản phẩm đã được tạo với mã sản phẩm: <strong>{newProductMaSanPham}</strong>
          </div>
        )}

        {isLoading ? (
          <div className="text-center text-black dark:text-white">
            <div className="loading-spinner"></div>
            <span className="ml-2">Đang tải...</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="product-form">
            {/* Basic Information Section */}
            <div className="form-section">
              <h3 className="form-section-title">📝 Thông tin cơ bản</h3>
              
              <div className="form-group">
                <label className="form-label required" htmlFor="maSanPham">
                  Mã sản phẩm
                </label>
                <input
                  id="maSanPham"
                  type="text"
                  value={formData.maSanPham}
                  onChange={handleMaSanPhamChange}
                  className={`form-input ${errors.some((e) => e.includes('Mã sản phẩm')) ? 'error' : ''}`}
                  required
                  placeholder="Ví dụ: SP001"
                  aria-label="Mã sản phẩm"
                  aria-describedby={errors.some((e) => e.includes('Mã sản phẩm')) ? 'error-maSanPham' : undefined}
                />
              </div>

              <div className="form-group">
                <label className="form-label required" htmlFor="name">
                  Tên sản phẩm
                </label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={handleNameChange}
                  className={`form-input ${errors.some((e) => e.includes('Tên sản phẩm')) ? 'error' : ''}`}
                  required
                  placeholder="Nhập tên sản phẩm"
                  aria-label="Tên sản phẩm"
                  aria-describedby={errors.some((e) => e.includes('Tên sản phẩm')) ? 'error-name' : undefined}
                />
              </div>

              <div className="form-group">
                <label className="form-label required" htmlFor="slug">
                  Slug
                </label>
                <input
                  id="slug"
                  type="text"
                  value={formData.slug}
                  onChange={handleSlugChange}
                  className={`form-input ${errors.some((e) => e.includes('Slug')) ? 'error' : ''}`}
                  required
                  placeholder="slug-san-pham"
                  aria-label="Slug sản phẩm"
                  aria-describedby={errors.some((e) => e.includes('Slug')) ? 'error-slug' : undefined}
                />
              </div>

              <div className="form-group">
                <label className="form-label required" htmlFor="description">
                  Mô tả
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={handleDescriptionChange}
                  className={`form-input form-textarea ${errors.some((e) => e.includes('Mô tả')) ? 'error' : ''}`}
                  rows={3}
                  placeholder="Nhập mô tả sản phẩm"
                  required
                  aria-label="Mô tả sản phẩm"
                  aria-describedby={errors.some((e) => e.includes('Mô tả')) ? 'error-description' : undefined}
                />
              </div>
            </div>

            {/* Image Upload Section */}
            <div className="form-section">
              <h3 className="form-section-title">🖼️ Hình ảnh sản phẩm</h3>
              
              <div className="image-upload-section">
                <div
                  {...getRootProps()}
                  className={`${isDragActive ? 'drag-active' : ''}`}
                  role="button"
                  aria-label="Tải lên hoặc thả hình ảnh"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      document.querySelector('input[type="file"]').click();
                    }
                  }}
                >
                  <input {...getInputProps()} />
                  <div className="upload-icon">📸</div>
                  <p className="upload-text">
                    Thả tập tin vào đây hoặc nhấp để tải lên
                  </p>
                  <p className="upload-hint">
                    (Chỉ hỗ trợ JPEG, JPG, PNG, WEBP dưới 5MB)
                  </p>
                </div>
                
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="select-existing-btn"
                >
                  🖼️ Chọn ảnh đã upload
                </button>
              </div>

              {uploading && (
                <div className="uploading-indicator">
                  <div className="loading-spinner"></div>
                  <span>Đang tải ảnh...</span>
                </div>
              )}

              {images.length > 0 && (
                <div className="image-preview-grid">
                  {images.map((img, index) => (
                    <div key={index} className="image-preview-item">
                      <img
                        src={img.preview}
                        alt={`Ảnh sản phẩm ${index + 1}`}
                        className="w-full h-24 object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="remove-image-btn"
                        aria-label={`Xóa ảnh ${index + 1}`}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details Section */}
            <div className="form-section">
              <h3 className="form-section-title">⚙️ Chi tiết sản phẩm</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="form-group">
                  <label className="form-label required" htmlFor="category">
                    Danh mục
                  </label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={handleCategoryChange}
                    className={`form-input form-select ${errors.some((e) => e.includes('Danh mục')) ? 'error' : ''}`}
                    required
                    aria-label="Danh mục sản phẩm"
                    aria-describedby={errors.some((e) => e.includes('Danh mục')) ? 'error-category' : undefined}
                  >
                    <option value="">Chọn danh mục</option>
                    {categories.map((cat, index) => (
                      <option key={index} value={cat.category}>
                        {cat.categoryNameVN}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label required" htmlFor="stockStatus">
                    Tình trạng kho
                  </label>
                  <select
                    id="stockStatus"
                    value={formData.stockStatus}
                    onChange={(e) => dispatch({ type: 'UPDATE_FIELD', field: 'stockStatus', value: e.target.value })}
                    className={`form-input form-select ${errors.some((e) => e.includes('Tình trạng kho')) ? 'error' : ''}`}
                    required
                    aria-label="Tình trạng kho"
                    aria-describedby={errors.some((e) => e.includes('Tình trạng kho')) ? 'error-stockStatus' : undefined}
                  >
                    <option value="Còn hàng">Còn hàng</option>
                    <option value="Hết hàng">Hết hàng</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label required" htmlFor="unit">
                    Đơn vị
                  </label>
                  <select
                    id="unit"
                    value={formData.unit}
                    onChange={(e) => dispatch({ type: 'UPDATE_FIELD', field: 'unit', value: e.target.value })}
                    className={`form-input form-select ${errors.some((e) => e.includes('Đơn vị')) ? 'error' : ''}`}
                    required
                    aria-label="Đơn vị sản phẩm"
                    aria-describedby={errors.some((e) => e.includes('Đơn vị')) ? 'error-unit' : undefined}
                  >
                    {['Kg', 'gam', 'túi', 'chai'].map((unit) => (
                      <option key={unit} value={unit}>
                        {unit}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label required" htmlFor="price">
                    Giá gốc
                  </label>
                  <input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => dispatch({ type: 'UPDATE_FIELD', field: 'price', value: Number(e.target.value) })}
                    className={`form-input ${errors.some((e) => e.includes('Giá gốc')) ? 'error' : ''}`}
                    min="0"
                    placeholder="0"
                    required
                    aria-label="Giá gốc"
                    aria-describedby={errors.some((e) => e.includes('Giá gốc')) ? 'error-price' : undefined}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="form-group">
                  <label className="form-label" htmlFor="promotionalPrice">
                    Giá khuyến mãi
                  </label>
                  <input
                    id="promotionalPrice"
                    type="number"
                    value={formData.promotionalPrice}
                    onChange={(e) => dispatch({ type: 'UPDATE_FIELD', field: 'promotionalPrice', value: Number(e.target.value) })}
                    className={`form-input ${errors.some((e) => e.includes('Giá khuyến mãi')) ? 'error' : ''}`}
                    min="0"
                    placeholder="0"
                    aria-label="Giá khuyến mãi"
                    aria-describedby={errors.some((e) => e.includes('Giá khuyến mãi')) ? 'error-promotionalPrice' : undefined}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="rating">
                    Đánh giá (0-5)
                  </label>
                  <input
                    id="rating"
                    type="number"
                    value={formData.rating}
                    onChange={(e) => dispatch({ type: 'UPDATE_FIELD', field: 'rating', value: Number(e.target.value) })}
                    className={`form-input ${errors.some((e) => e.includes('Đánh giá')) ? 'error' : ''}`}
                    min="0"
                    max="5"
                    step="0.1"
                    placeholder="0"
                    aria-label="Đánh giá"
                    aria-describedby={errors.some((e) => e.includes('Đánh giá')) ? 'error-rating' : undefined}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="form-group">
                  <label className="form-label" htmlFor="reviewCount">
                    Số lượng đánh giá
                  </label>
                  <input
                    id="reviewCount"
                    type="number"
                    value={formData.reviewCount}
                    onChange={(e) => dispatch({ type: 'UPDATE_FIELD', field: 'reviewCount', value: Number(e.target.value) })}
                    className={`form-input ${errors.some((e) => e.includes('Số lượng đánh giá')) ? 'error' : ''}`}
                    min="0"
                    placeholder="0"
                    aria-label="Số lượng đánh giá"
                    aria-describedby={errors.some((e) => e.includes('Số lượng đánh giá')) ? 'error-reviewCount' : undefined}
                  />
                </div>
              </div>
            </div>

            {/* Product Options Section */}
            <div className="form-section">
              <h3 className="form-section-title">🔧 Tùy chọn sản phẩm</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-checkbox">
                  <input
                    type="checkbox"
                    id="isNew"
                    checked={formData.isNew}
                    onChange={(e) => dispatch({ type: 'UPDATE_FIELD', field: 'isNew', value: e.target.checked })}
                    aria-label="Sản phẩm mới"
                  />
                  <label htmlFor="isNew">Sản phẩm mới</label>
                </div>

                <div className="form-checkbox">
                  <input
                    type="checkbox"
                    id="isFeatured"
                    checked={formData.isFeatured}
                    onChange={(e) => dispatch({ type: 'UPDATE_FIELD', field: 'isFeatured', value: e.target.checked })}
                    aria-label="Sản phẩm nổi bật"
                  />
                  <label htmlFor="isFeatured">Sản phẩm nổi bật</label>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="form-section">
              <h3 className="form-section-title">📄 Nội dung chi tiết</h3>
              <Editor
                content={formData.content || ''}
                onChange={handleContentChange}
              />
            </div>

            {/* Form Actions */}
            <div className="form-actions">
              <button
                type="button"
                onClick={() => router.push('/dashboard/san-pham')}
                className="btn btn-secondary"
                aria-label="Hủy"
              >
                ❌ Hủy
              </button>
              <button
                type="submit"
                disabled={uploading || isSubmitting}
                className={`btn btn-primary ${uploading || isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                aria-label={_id ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm'}
              >
                {uploading ? (
                  <>
                    <div className="loading-spinner"></div>
                    Đang upload...
                  </>
                ) : isSubmitting ? (
                  <>
                    <div className="loading-spinner"></div>
                    Đang xử lý...
                  </>
                ) : _id ? (
                  '✅ Cập nhật'
                ) : (
                  '➕ Thêm sản phẩm'
                )}
              </button>
            </div>
          </form>
        )}

        {/* Image Selection Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" role="dialog" aria-modal="true" aria-label="Chọn ảnh">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto" tabIndex={-1} ref={(el) => el?.focus()}>
              <h3 className="text-xl font-bold mb-4 text-black dark:text-white">Chọn ảnh đã tải lên</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-96 overflow-y-auto">
                {cloudinaryImages.map((src, index) => (
                  <img
                    key={index}
                    src={src}
                    alt={`Cloudinary image ${index + 1}`}
                    className="w-full h-32 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => handleSelectImage(src)}
                  />
                ))}
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-secondary"
                  aria-label="Đóng"
                >
                  ❌ Đóng
                </button>
              </div>
            </div>
          </div>
        )}
        <ToastContainer />
      </div>
    </AdminLayout>
  );
}