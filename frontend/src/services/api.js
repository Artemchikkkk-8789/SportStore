const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const GOOGLE_LOGIN_URL = `${API_URL}/oauth2/authorization/google`;

function getToken() {
  return localStorage.getItem('sportstore_token');
}

async function request(path, options = {}) {
  const isFormData = options.body instanceof FormData;
  const headers = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(options.headers || {})
  };

  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `HTTP ${response.status}`);
  }

  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get('content-type');
  return contentType?.includes('application/json') ? response.json() : response.text();
}

export const api = {
  getProducts(params = {}) {
    const search = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        search.set(key, value);
      }
    });

    const query = search.toString();
    return request(`/products${query ? `?${query}` : ''}`);
  },

  getProduct(id) {
    return request(`/products/${id}`);
  },

  getCategories() {
    return request('/categories');
  },

  getBrands() {
    return request('/brands');
  },

  createBrand(payload) {
    return request('/brands', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  updateBrand(id, payload) {
    return request(`/brands/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload)
    });
  },

  deleteBrand(id) {
    return request(`/brands/${id}`, {
      method: 'DELETE'
    });
  },

  getAdminStats() {
    return request('/admin/stats');
  },

  getUsers() {
    return request('/admin/users');
  },

  updateUserRole(id, role) {
    return request(`/admin/users/${id}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role })
    });
  },

  login(payload) {
    return request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  register(payload) {
    return request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  createOrder(payload) {
    return request('/orders', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  getOrders() {
    return request('/orders');
  },

  getMyOrders() {
    return request('/orders/my');
  },

  updateOrderStatus(id, status) {
    return request(`/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
  },

  createProduct(payload) {
    return request('/products', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  uploadProductImages(id, mainImage, galleryImages = []) {
    if (!id) {
      throw new Error('Product id is required for image upload');
    }

    const additionalImages = Array.from(galleryImages || []).filter(Boolean);
    if (!mainImage && additionalImages.length === 0) {
      throw new Error('Не вибрано фото для завантаження.');
    }

    const formData = new FormData();
    if (mainImage) {
      formData.append('mainImage', mainImage);
    }
    additionalImages.forEach((image) => {
      formData.append('galleryImages', image);
    });

    const headers = {};
    const token = getToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return request(`/products/${id}/images`, {
      method: 'POST',
      headers,
      body: formData
    });
  },

  uploadProductColorImages(id, color, images = []) {
    if (!id) {
      throw new Error('Product id is required for color image upload');
    }

    const colorImages = Array.from(images || []).filter(Boolean).slice(0, 4);
    if (!color || colorImages.length === 0) {
      throw new Error('Оберіть колір і фото для завантаження.');
    }

    const formData = new FormData();
    formData.append('color', color);
    colorImages.forEach((image) => {
      formData.append('images', image);
    });

    return request(`/products/${id}/color-images`, {
      method: 'POST',
      body: formData
    });
  },

  updateProduct(id, payload) {
    return request(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload)
    });
  },

  deleteProduct(id) {
    return request(`/products/${id}`, {
      method: 'DELETE'
    });
  },

  createCategory(payload) {
    return request('/categories', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  updateCategory(id, payload) {
    return request(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload)
    });
  },

  deleteCategory(id) {
    return request(`/categories/${id}`, {
      method: 'DELETE'
    });
  }
};

export { API_URL, GOOGLE_LOGIN_URL };
