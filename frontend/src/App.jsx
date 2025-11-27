import { Container, Typography, Button, Box, Paper } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';

function App() {
  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom color="primary">
          Sistema de Estoque
        </Typography>
        
        <Typography variant="body1" paragraph>
          Ambiente Front-end configurado com React + Material UI.
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 3 }}>
          <Button variant="contained" endIcon={<SendIcon />}>
            Entrar
          </Button>
          <Button variant="outlined" startIcon={<DeleteIcon />} color="error">
            Limpar
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default App;