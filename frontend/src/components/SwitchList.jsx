import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, 
  IconButton, Chip, Typography, Tooltip, Box 
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const SwitchList = ({ switches, onEdit, onDelete }) => {

  const getStatusColor = (status) => {
    switch (status) {
      case 'ATIVO': return 'success';
      case 'MANUTENCAO': return 'warning';
      case 'DESATIVADO': return 'error';
      default: return 'default';
    }
  };

  return (
    <TableContainer component={Paper} sx={{ mt: 2 }}>
      <Table sx={{ minWidth: 650 }} aria-label="tabela de switches">
        <TableHead>
          <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
            <TableCell><strong>Património</strong></TableCell>
            <TableCell><strong>Marca/Modelo</strong></TableCell>
            <TableCell><strong>Serial</strong></TableCell>
            <TableCell><strong>IP</strong></TableCell>
            <TableCell><strong>Localização</strong></TableCell>
            <TableCell><strong>Status</strong></TableCell>
            <TableCell><strong>Condição</strong></TableCell>
            <TableCell align="right"><strong>Ações</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {switches.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} align="center">
                <Typography sx={{ py: 3, color: 'text.secondary' }}>
                  Nenhum equipamento encontrado.
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            switches.map((item) => (
              <TableRow key={item.id} hover>
                <TableCell>{item.patrimonio}</TableCell>
                <TableCell>{item.marca} {item.modelo}</TableCell>
                <TableCell>{item.serial_number}</TableCell>
                <TableCell>{item.ip_address || '-'}</TableCell>
                <TableCell>{item.localizacao || '-'}</TableCell>
                <TableCell>
                  <Chip 
                    label={item.status} 
                    color={getStatusColor(item.status)} 
                    size="small" 
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color={item.condicao === 'NOVO' ? 'primary' : 'textSecondary'}>
                    {item.condicao}
                    </Typography>
                  </TableCell>
                <TableCell align="right">
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Tooltip title="Editar">
                      <IconButton color="primary" onClick={() => onEdit(item)} size="small">
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Excluir">
                      <IconButton color="error" onClick={() => onDelete(item.id)} size="small">
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default SwitchList;