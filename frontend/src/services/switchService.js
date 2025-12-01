import api from './api';

const switchService = {
  getAll: async () => {
    const response = await api.get('/switches/');
    return response.data;
  },

  create: async (switchData) => {
    const userId = localStorage.getItem('user_id');
    const formData = new FormData();
    
    Object.keys(switchData).forEach(key => {
      if (key !== 'image' && switchData[key] !== null) {
        formData.append(key, switchData[key]);
      }
    });

    if (switchData.image) {
      formData.append('image', switchData.image);
    }

    const config = {
      headers: {
        'X-User-ID': userId,
        'Content-Type': 'multipart/form-data'
      }
    };

    const response = await api.post('/switches/', formData, config);
    return response.data;
  },

  update: async (id, switchData) => {
    let dataToSend = switchData;
    let config = {
       headers: {}
    };

    if (switchData.image instanceof File) {
        console.log("Enviando Update com Imagem...");
        const formData = new FormData();
        
        Object.keys(switchData).forEach(key => {
            if (key !== 'image' && switchData[key] !== null) {
                formData.append(key, switchData[key]);
            }
        });
        
        formData.append('image', switchData.image);
        dataToSend = formData;
        
        config.headers['Content-Type'] = 'multipart/form-data';
    } else {
        console.log("Enviando Update JSON simples...");
    }

    const response = await api.put(`/switches/${id}`, dataToSend, config);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/switches/${id}`);
    return response.data;
  }
};

export default switchService;