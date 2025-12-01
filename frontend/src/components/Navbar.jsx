import { AppBar, Toolbar, Typography, Button, Box, Avatar, Container } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

const Navbar = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem('username');
  const userId = localStorage.getItem('user_id');

  const handleLogout = async () => {
    try {
      if (userId) {
        await authService.logout(userId);
      }
    } catch (error) {
      console.error("Erro ao registrar logout", error);
    } finally {
      localStorage.removeItem('user_id');
      localStorage.removeItem('username');
      navigate('/login');
    }
  };

  return (
    <AppBar position="sticky" elevation={0} sx={{ backgroundColor: '#1976d2', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ flexGrow: 1, fontWeight: 700, letterSpacing: '.1rem' }}
          >
            SWITCH MANAGER
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, bgcolor: 'rgba(255,255,255,0.15)', px: 2, py: 0.5, borderRadius: 2 }}>
                <AccountCircleIcon />
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {username || 'Visitante'}
                </Typography>
            </Box>
            
            <Button 
              color="inherit" 
              variant="outlined"
              size="small"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              sx={{ borderColor: 'rgba(255,255,255,0.5)', '&:hover': { borderColor: '#fff', bgcolor: 'rgba(255,255,255,0.1)' } }}
            >
              Sair
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;