import { useState, useEffect, useRef } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  TextField, Button, Grid, MenuItem, Alert, Box, Avatar, IconButton, Typography
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import CancelIcon from '@mui/icons-material/Cancel';
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
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const stopCamera = () => {
      if (videoRef.current && videoRef.current.srcObject) {
          const stream = videoRef.current.srcObject;
          const tracks = stream.getTracks();
          tracks.forEach(track => track.stop());
          videoRef.current.srcObject = null;
      }
      setIsCameraOpen(false);
  };

  const processNewImageFile = (file) => {
      setFormData(prev => ({ ...prev, image: file }));
      setPreviewUrl(URL.createObjectURL(file));
      stopCamera();
  };

  const takePhoto = () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (video && canvas) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          
          const context = canvas.getContext('2d');
          context.drawImage(video, 0, 0, canvas.width, canvas.height);

          canvas.toBlob(blob => {
              const file = new File([blob], "camera_capture.jpg", { type: "image/jpeg" });
              processNewImageFile(file);
          }, 'image/jpeg');
      }
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
    stopCamera();
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
    if (file) {
        processNewImageFile(file);
    }
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
      handleCloseModalInterno();
    } catch (err) {
      const msg = err.response?.data?.error || "Erro ao salvar.";
      setError(msg);
    }
  };

  const handleCloseModalInterno = () => {
      stopCamera();
      handleClose();
  }

  return (
    <Dialog open={open} onClose={handleCloseModalInterno} maxWidth="sm" fullWidth>
      <DialogTitle>{switchData ? 'Editar' : 'Novo Switch'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3, p: 2, border: '1px dashed grey', borderRadius: 2 }}>
            
            {isCameraOpen ? (
                <Box sx={{ position: 'relative', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <video ref={videoRef} autoPlay playsInline style={{ width: '100%', maxWidth: '400px', borderRadius: '8px', marginBottom: '10px' }} />
                    
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button variant="contained" color="error" startIcon={<CancelIcon />} onClick={stopCamera}>
                            Cancelar
                        </Button>
                        <Button variant="contained" color="primary" startIcon={<RadioButtonCheckedIcon />} onClick={takePhoto}>
                            Capturar
                        </Button>
                    </Box>
                    <canvas ref={canvasRef} style={{ display: 'none' }} />
                </Box>
            ) : (
             <>
                <Avatar 
                    src={previewUrl || ""}
                    sx={{ width: 120, height: 120, mb: 2, bgcolor: '#e0e0e0' }}
                    variant="rounded"
                >
                    {!previewUrl && <PhotoCameraIcon sx={{ fontSize: 50, color: '#9e9e9e' }} />}
                </Avatar>
                <Typography variant="caption" sx={{ mb: 2 }}>Foto do Equipamento</Typography>
                
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button component="label" variant="outlined" startIcon={<CloudUploadIcon />}>
                        Upload Arquivo
                        <input type="file" hidden accept="image/*" onChange={handleFileChange} />
                    </Button>
                </Box>
             </>
            )}
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={6}>
                <TextField name="patrimonio" label="Patrimônio" fullWidth required value={formData.patrimonio} onChange={handleChange} disabled={!!switchData} />
            </Grid>
            <Grid item xs={6}>
                <TextField name="serial_number" label="Serial" fullWidth required value={formData.serial_number} onChange={handleChange} />
            </Grid>
            <Grid item xs={6}>
                <TextField name="marca" label="Marca" fullWidth required value={formData.marca} onChange={handleChange} />
            </Grid>
            <Grid item xs={6}>
                <TextField name="modelo" label="Modelo" fullWidth required value={formData.modelo} onChange={handleChange} />
            </Grid>
            <Grid item xs={12}>
                <TextField name="ip_address" label="IP" fullWidth value={formData.ip_address} onChange={handleChange} />
            </Grid>
            <Grid item xs={12}>
                <TextField name="localizacao" label="Localização" fullWidth value={formData.localizacao} onChange={handleChange} />
            </Grid>
            <Grid item xs={6}>
                <TextField select name="status" label="Status" fullWidth value={formData.status} onChange={handleChange}>
                    <MenuItem value="ATIVO">Ativo</MenuItem>
                    <MenuItem value="MANUTENCAO">Manutenção</MenuItem>
                    <MenuItem value="DESATIVADO">Desativado</MenuItem>
                </TextField>
            </Grid>
            <Grid item xs={6}>
                <TextField select name="condicao" label="Condição" fullWidth value={formData.condicao} onChange={handleChange}>
                    <MenuItem value="NOVO" disabled={formData.status === 'ATIVO'}>Novo</MenuItem>
                    <MenuItem value="USADO">Usado</MenuItem>
                </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModalInterno}>Cancelar</Button>
          <Button type="submit" variant="contained">Salvar</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default SwitchModal;