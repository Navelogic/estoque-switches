import { useState, useEffect } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  TextField, Button, Grid, MenuItem, Alert, Box, Avatar, Typography, Divider
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ImageIcon from '@mui/icons-material/Image';
import switchService from '../services/switchService';

const SwitchModal = ({ open, handleClose, switchData, onSaveSuccess }) => {
  const initialFormState = {
    patrimonio: '', marca: '', modelo: '', serial_number: '',
    ip_address: '', localizacao: '', status: 'ATIVO', condicao: 'USADO',
    image: null
  };
  const [formData, setFormData] = useState(initialFormState);
  const [error, setError] = useState('');
  
  const [previewUrl, setPreviewUrl] = useState(null);

  const processNewImageFile = (file) => {
      setFormData(prev => ({ ...prev, image: file }));
      setPreviewUrl(URL.createObjectURL(file));
  };

  useEffect(() => {
    if (switchData) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        patrimonio: switchData.patrimonio || '',
        marca: switchData.marca || '',
        modelo: switchData.modelo || '',
        serial_number: switchData.serial_number || '',
        ip_address: switchData.ip_address || '',
        localizacao: switchData.localizacao || '',
        status: switchData.status || 'ATIVO',
        condicao: switchData.condicao || 'USADO',
        image: null
      });
      if (switchData.image_path) {
          setPreviewUrl(`http://127.0.0.1:5000/static/uploads/${switchData.image_path}?t=${new Date().getTime()}`);
      } else {
          setPreviewUrl(null);
      }
    } else {
      setFormData(initialFormState);
      setPreviewUrl(null);
    }
    setError('');
  }, [switchData, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      let newData = { ...prev, [name]: value };
      if (name === 'status' && value === 'ATIVO') newData.condicao = 'USADO';
      return newData;
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) processNewImageFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (switchData) {
        await switchService.update(switchData.id, formData);
      } else {
        await switchService.create(formData);
      }
      onSaveSuccess();
      handleClose();
    } catch (err) {
      setError(err.response?.data?.error || "Erro ao salvar.");
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ bgcolor: '#f5f5f5', pb: 2 }}>
        {switchData ? 'Editar Equipamento' : 'Novo Equipamento'}
      </DialogTitle>
      
      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ mt: 1 }}>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
                <Box sx={{ 
                    display: 'flex', flexDirection: 'column', alignItems: 'center', 
                    p: 2, border: '2px dashed #ccc', borderRadius: 2, 
                    bgcolor: '#fafafa', height: '100%', justifyContent: 'center'
                }}>
                    <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 2 }}>IMAGEM DO ATIVO</Typography>
                    
                    <Avatar 
                        src={previewUrl || ""}
                        variant="rounded"
                        sx={{ width: 140, height: 140, mb: 2, bgcolor: '#e0e0e0', border: '1px solid #ddd' }}
                    >
                        <ImageIcon sx={{ fontSize: 50, color: '#9e9e9e' }} />
                    </Avatar>
                    
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: '100%' }}>
                        <Button component="label" variant="outlined" startIcon={<CloudUploadIcon />} size="small" fullWidth>
                            Carregar Foto
                            <input type="file" hidden accept="image/*" onChange={handleFileChange} />
                        </Button>
                    </Box>
                </Box>
            </Grid>

            <Grid item xs={12} md={8}>
                <Typography variant="subtitle2" sx={{ mb: 2, color: 'primary.main' }}>DADOS TÉCNICOS</Typography>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <TextField name="patrimonio" label="Patrimônio" fullWidth required value={formData.patrimonio} onChange={handleChange} disabled={!!switchData} variant="outlined" size="small" />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField name="serial_number" label="Serial Number" fullWidth required value={formData.serial_number} onChange={handleChange} variant="outlined" size="small" />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField name="marca" label="Marca" fullWidth required value={formData.marca} onChange={handleChange} variant="outlined" size="small" />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField name="modelo" label="Modelo" fullWidth required value={formData.modelo} onChange={handleChange} variant="outlined" size="small" />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField name="ip_address" label="Endereço IP" fullWidth value={formData.ip_address} onChange={handleChange} variant="outlined" size="small" placeholder="Ex: 192.168.1.10" />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField name="localizacao" label="Localização Física" fullWidth value={formData.localizacao} onChange={handleChange} variant="outlined" size="small" />
                    </Grid>
                    
                    <Grid item xs={12}><Divider sx={{ my: 1 }} /></Grid>
                    
                    <Grid item xs={6}>
                        <TextField select name="status" label="Status Operacional" fullWidth value={formData.status} onChange={handleChange} size="small">
                            <MenuItem value="ATIVO">Ativo</MenuItem>
                            <MenuItem value="MANUTENCAO">Manutenção</MenuItem>
                            <MenuItem value="DESATIVADO">Desativado</MenuItem>
                        </TextField>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField select name="condicao" label="Condição Física" fullWidth value={formData.condicao} onChange={handleChange} size="small">
                            <MenuItem value="NOVO" disabled={formData.status === 'ATIVO'}>Novo</MenuItem>
                            <MenuItem value="USADO">Usado</MenuItem>
                        </TextField>
                    </Grid>
                </Grid>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3, bgcolor: '#f5f5f5' }}>
          <Button onClick={handleClose} color="inherit">Cancelar</Button>
          <Button type="submit" variant="contained" sx={{ px: 4 }}>Salvar</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default SwitchModal;