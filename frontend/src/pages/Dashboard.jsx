import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Paper } from '@mui/material';
import Navbar from '../components/Navbar';

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem('user_id');
    if (!userId) {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Navbar />

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom component="div" color="primary">
                Painel de Controle
            </Typography>
            <Typography variant="body1" color="text.secondary">
                TESTE...
            </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default Dashboard;