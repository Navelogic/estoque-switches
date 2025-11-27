import api from './api';

const switchService = {
  getAll: async () => {
    const response = await api.get('/switches/');
    return response.data;
  },

  create: async (switchData) => {
    const userId = localStorage.getItem('user_id');
    
    const config = {
      headers: {
        'X-User-ID': userId
      }
    };

    const response = await api.post('/switches/', switchData, config);
    return response.data;
  },

  update: async (id, switchData) => {
    const response = await api.put(`/switches/${id}`, switchData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/switches/${id}`);
    return response.data;
  }
};

export default switchService;