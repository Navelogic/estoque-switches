import { useState, useEffect } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  TextField, Button, Grid, MenuItem, Alert 
} from '@mui/material';
import switchService from '../services/switchService';

const SwitchModal = ({ open, handleClose, switchData, onSaveSuccess }) => {
  const initialFormState = {
    patrimonio: '',
    marca: '',
    modelo: '',
    serial_number: '',
    ip_address: '',
    localizacao: '',
    status: 'ATIVO',
    condicao: 'USADO'
  };

  const [formData, setFormData] = useState(initialFormState);
  const [error, setError] = useState('');

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
        condicao: switchData.condicao || 'USADO'
      });
    } else {
      setFormData(initialFormState);
    }
    setError('');
  }, [switchData, open]);

 const handleChange = (e) => {
  const { name, value } = e.target;

    setFormData(prev => {
      let newData = { ...prev, [name]: value };

      if (name === 'status' && value === 'ATIVO') {
        newData.condicao = 'USADO';
      }

      return newData;
    });
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
        const msg = err.response?.data?.error || "Erro ao salvar.";
        setError(msg);
      }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {switchData ? `Editar Switch: ${switchData.patrimonio}` : 'Novo Switch'}
      </DialogTitle>
      
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                name="patrimonio"
                label="Património"
                fullWidth
                required
                disabled={!!switchData}
                value={formData.patrimonio}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="serial_number"
                label="Serial Number"
                fullWidth
                required
                value={formData.serial_number}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                name="marca"
                label="Marca"
                fullWidth
                required
                value={formData.marca}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="modelo"
                label="Modelo"
                fullWidth
                required
                value={formData.modelo}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                name="ip_address"
                label="Endereço IP"
                fullWidth
                value={formData.ip_address}
                onChange={handleChange}
                helperText="Opcional (Ex: 192.168.1.1)"
              />
            </Grid>

            <Grid item xs={8}>
              <TextField
                name="localizacao"
                label="Localização"
                fullWidth
                value={formData.localizacao}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                select
                name="status"
                label="Status"
                fullWidth
                value={formData.status}
                onChange={handleChange}
              >
                <MenuItem value="ATIVO">Ativo</MenuItem>
                <MenuItem value="MANUTENCAO">Manutenção</MenuItem>
                <MenuItem value="DESATIVADO">Desativado</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={6}>
                    <TextField
                        select
                        name="condicao"
                        label="Condição"
                        fullWidth
                        value={formData.condicao}
                        onChange={handleChange}
                    >
                        <MenuItem value="NOVO" disabled={formData.status === 'ATIVO'}>
                            Novo {formData.status === 'ATIVO' ? '(Proibido se Ativo)' : ''}
                        </MenuItem>
                        <MenuItem value="USADO">Usado</MenuItem>
                    </TextField>
                </Grid>
          </Grid>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={handleClose} color="inherit">Cancelar</Button>
          <Button type="submit" variant="contained" color="primary">
            Salvar
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default SwitchModal;