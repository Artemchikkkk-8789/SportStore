const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

function getToken() {
  return localStorage.getItem('sportstore_token');
}

async function request(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
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

  createOrder(productIds) {
    return request('/orders', {
      method: 'POST',
      body: JSON.stringify({ productIds })
    });
  },

  createProduct(payload) {
    return request('/products', {
      method: 'POST',
      body: JSON.stringify(payload)
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

export { API_URL };
