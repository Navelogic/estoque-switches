import { useState } from 'react';
import { Container, Paper, TextField, Button, Typography, Box, Alert, Avatar } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/authService';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const data = await authService.login(formData);
      localStorage.setItem('user_id', data.user_id);
      localStorage.setItem('username', data.username);
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.error || "Falha ao conectar com o servidor.";
      setError(msg);
    }
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1976d2 30%, #42a5f5 90%)'
      }}
    >
      <Container component="main" maxWidth="xs">
        <Paper 
            elevation={6} 
            sx={{ 
                p: 4, 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                borderRadius: 3 
            }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'primary.main', width: 56, height: 56 }}>
            <LockOutlinedIcon fontSize="large" />
          </Avatar>
          
          <Typography component="h1" variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
            Acesso ao Sistema
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
            Gerenciamento de Inventário
          </Typography>

          {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <TextField
              margin="normal" required fullWidth
              id="username" label="Usuário" name="username"
              autoComplete="username" autoFocus
              value={formData.username} onChange={handleChange}
              variant="outlined"
            />
            <TextField
              margin="normal" required fullWidth
              name="password" label="Senha" type="password" id="password"
              autoComplete="current-password"
              value={formData.password} onChange={handleChange}
            />
            
            <Button
              type="submit" fullWidth variant="contained" size="large"
              sx={{ mt: 3, mb: 2, py: 1.5, fontWeight: 'bold', fontSize: '1rem' }}
            >
              Entrar
            </Button>
            
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Link to="/register" style={{ textDecoration: 'none', color: '#1976d2', fontWeight: 500 }}>
                  Não tem conta? Cadastre-se
              </Link>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;