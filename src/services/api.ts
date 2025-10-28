// API Base URL - Replace with your actual backend URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Token management
export const getToken = (): string | null => {
  return localStorage.getItem('token');
};

export const setToken = (token: string): void => {
  localStorage.setItem('token', token);
};

export const removeToken = (): void => {
  localStorage.removeItem('token');
};

// API request helper
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = getToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Auth APIs
export const authAPI = {
  register: async (name: string, email: string, password: string) => {
    const response = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
    
    if (response.success && response.data.token) {
      setToken(response.data.token);
    }
    
    return response;
  },

  login: async (email: string, password: string) => {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (response.success && response.data.token) {
      setToken(response.data.token);
    }
    
    return response;
  },

  getMe: async () => {
    return await apiRequest('/auth/me');
  },

  updateProfile: async (data: any) => {
    return await apiRequest('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  logout: () => {
    removeToken();
  },
};

// Expense APIs
export const expenseAPI = {
  getAll: async () => {
    return await apiRequest('/expenses');
  },

  create: async (expense: any) => {
    return await apiRequest('/expenses', {
      method: 'POST',
      body: JSON.stringify(expense),
    });
  },

  update: async (id: string, expense: any) => {
    return await apiRequest(`/expenses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(expense),
    });
  },

  delete: async (id: string) => {
    return await apiRequest(`/expenses/${id}`, {
      method: 'DELETE',
    });
  },

  getByDateRange: async (startDate: string, endDate: string) => {
    return await apiRequest(`/expenses/range?startDate=${startDate}&endDate=${endDate}`);
  },
};

// Savings Goals APIs
export const savingsAPI = {
  getAll: async () => {
    return await apiRequest('/savings');
  },

  create: async (goal: any) => {
    return await apiRequest('/savings', {
      method: 'POST',
      body: JSON.stringify(goal),
    });
  },

  update: async (id: string, goal: any) => {
    return await apiRequest(`/savings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(goal),
    });
  },

  delete: async (id: string) => {
    return await apiRequest(`/savings/${id}`, {
      method: 'DELETE',
    });
  },
};

// Custom Categories APIs
export const categoryAPI = {
  getAll: async () => {
    return await apiRequest('/categories');
  },

  create: async (category: any) => {
    return await apiRequest('/categories', {
      method: 'POST',
      body: JSON.stringify(category),
    });
  },

  delete: async (id: string) => {
    return await apiRequest(`/categories/${id}`, {
      method: 'DELETE',
    });
  },
};

// Recurring Expenses APIs
export const recurringAPI = {
  getAll: async () => {
    return await apiRequest('/recurring');
  },

  create: async (recurring: any) => {
    return await apiRequest('/recurring', {
      method: 'POST',
      body: JSON.stringify(recurring),
    });
  },

  update: async (id: string, recurring: any) => {
    return await apiRequest(`/recurring/${id}`, {
      method: 'PUT',
      body: JSON.stringify(recurring),
    });
  },

  delete: async (id: string) => {
    return await apiRequest(`/recurring/${id}`, {
      method: 'DELETE',
    });
  },
};

// EMI APIs
export const emiAPI = {
  getAll: async () => {
    return await apiRequest('/emi');
  },

  create: async (emi: any) => {
    return await apiRequest('/emi', {
      method: 'POST',
      body: JSON.stringify(emi),
    });
  },

  update: async (id: string, emi: any) => {
    return await apiRequest(`/emi/${id}`, {
      method: 'PUT',
      body: JSON.stringify(emi),
    });
  },

  delete: async (id: string) => {
    return await apiRequest(`/emi/${id}`, {
      method: 'DELETE',
    });
  },
};
