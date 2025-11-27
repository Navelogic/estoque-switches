import api from './api';

const authService = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  
  logout: async (userId) => {
    const response = await api.post('/auth/logout', { user_id: userId });
    return response.data;
  }
};

export default authService;