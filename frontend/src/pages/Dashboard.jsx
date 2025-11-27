import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Button, CircularProgress } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';

import Navbar from '../components/Navbar';
import SwitchList from '../components/SwitchList';
import SwitchModal from '../components/SwitchModal';
import switchService from '../services/switchService';

const Dashboard = () => {
  const navigate = useNavigate();
  
  const [switches, setSwitches] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [currentSwitch, setCurrentSwitch] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem('user_id');
    if (!userId) {
      navigate('/login');
    } else {
      loadData();
    }
  }, [navigate]);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await switchService.getAll();
      setSwitches(data);
    } catch (error) {
      console.error("Erro ao carregar lista:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setCurrentSwitch(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (switchItem) => {
    setCurrentSwitch(switchItem);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setCurrentSwitch(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tem a certeza que deseja excluir este equipamento?")) {
      try {
        await switchService.delete(id);
        loadData();
      } catch (err) {
        alert("Erro ao excluir: " + (err.response?.data?.error || "Erro desconhecido"));
      }
    }
  };

  return (
    <Box sx={{ flexGrow: 1, height: '100vh', backgroundColor: '#f4f6f8', overflow: 'auto' }}>
      <Navbar />

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, alignItems: 'center' }}>
          <Typography variant="h4" component="h1" color="primary" sx={{ fontWeight: 'bold' }}>
            Painel de Controle
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button variant="outlined" startIcon={<RefreshIcon />} onClick={loadData}>
              Atualizar
            </Button>
            <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenCreate}>
              Novo Switch
            </Button>
          </Box>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
            <CircularProgress />
          </Box>
        ) : (
          <SwitchList 
            switches={switches} 
            onEdit={handleOpenEdit} 
            onDelete={handleDelete}
          />
        )}

      </Container>

      <SwitchModal 
        open={modalOpen} 
        handleClose={handleCloseModal} 
        switchData={currentSwitch}
        onSaveSuccess={loadData}
      />

    </Box>
  );
};

export default Dashboard;