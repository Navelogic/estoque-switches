import { useState } from 'react';
import { Container, Paper, TextField, Button, Typography, Box, Alert, Avatar } from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/authService';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    try {
      await authService.register({
        username: formData.username,
        password: formData.password
      });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      const msg = err.response?.data?.error || "Erro ao conectar com o servidor.";
      setError(msg);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #1976d2 30%, #42a5f5 90%)' }}>
      <Container component="main" maxWidth="xs">
        <Paper elevation={6} sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: 3 }}>
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main', width: 56, height: 56 }}>
             <PersonAddIcon fontSize="large" />
          </Avatar>
          
          <Typography component="h1" variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
            Nova Conta
          </Typography>

          {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ width: '100%', mb: 2 }}>Conta criada! Redirecionando...</Alert>}

          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <TextField
              margin="normal" required fullWidth id="username" label="Usuário" name="username"
              autoFocus value={formData.username} onChange={handleChange}
            />
            <TextField
              margin="normal" required fullWidth name="password" label="Senha" type="password" id="password"
              value={formData.password} onChange={handleChange}
            />
            <TextField
              margin="normal" required fullWidth name="confirmPassword" label="Confirmar Senha" type="password" id="confirmPassword"
              value={formData.confirmPassword} onChange={handleChange}
            />
            
            <Button type="submit" fullWidth variant="contained" size="large" sx={{ mt: 3, mb: 2, py: 1.5 }}>
              Registrar
            </Button>
            
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Link to="/login" style={{ textDecoration: 'none', color: '#1976d2', fontWeight: 500 }}>
                Já tem conta? Faça Login
              </Link>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Register;