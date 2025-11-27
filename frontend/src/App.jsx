import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register';

const LoginPlaceholder = () => <h2>Tela de Login (Em construção)</h2>;
const HomePlaceholder = () => <h2>Sistema de Estoque (Logado)</h2>;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        <Route path="/login" element={<LoginPlaceholder />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<HomePlaceholder />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;