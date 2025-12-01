import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, 
  IconButton, Chip, Typography, Tooltip, Box, Avatar 
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ImageNotSupportedIcon from '@mui/icons-material/ImageNotSupported';

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
    <TableContainer component={Paper} elevation={2} sx={{ mt: 2, borderRadius: 2, overflow: 'hidden' }}>
      <Table sx={{ minWidth: 650 }} aria-label="tabela de switches">
        <TableHead sx={{ backgroundColor: '#eeeeee' }}>
          <TableRow>
            <TableCell><strong>Foto</strong></TableCell>
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
              <TableCell colSpan={9} align="center">
                <Typography sx={{ py: 4, color: 'text.secondary', fontStyle: 'italic' }}>
                  Nenhum equipamento encontrado no sistema.
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            switches.map((item) => (
              <TableRow key={item.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 }, transition: '0.2s' }}>
                <TableCell>
                    {item.image_path ? (
                         <Avatar 
                            src={`http://127.0.0.1:5000/static/uploads/${item.image_path}`} 
                            variant="rounded"
                            sx={{ width: 40, height: 40, border: '1px solid #ddd' }}
                         />
                    ) : (
                        <Avatar variant="rounded" sx={{ width: 40, height: 40, bgcolor: 'transparent', border: '1px solid #ddd' }}>
                            <ImageNotSupportedIcon color="disabled" />
                        </Avatar>
                    )}
                </TableCell>
                <TableCell sx={{ fontWeight: 500 }}>{item.patrimonio}</TableCell>
                <TableCell>{item.marca} <Typography variant="caption" display="block" color="textSecondary">{item.modelo}</Typography></TableCell>
                <TableCell sx={{ fontFamily: 'monospace' }}>{item.serial_number}</TableCell>
                <TableCell>{item.ip_address || '-'}</TableCell>
                <TableCell>{item.localizacao || '-'}</TableCell>
                <TableCell>
                  <Chip 
                    label={item.status} 
                    color={getStatusColor(item.status)} 
                    size="small" 
                    variant="filled" // Mudado para filled para mais contraste
                    sx={{ fontWeight: 'bold' }}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: item.condicao === 'NOVO' ? 'bold' : 'normal', color: item.condicao === 'NOVO' ? '#1976d2' : 'text.secondary' }}>
                    {item.condicao}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                    <Tooltip title="Editar">
                      <IconButton color="primary" onClick={() => onEdit(item)} size="small" sx={{ bgcolor: 'rgba(25, 118, 210, 0.05)' }}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Excluir">
                      <IconButton color="error" onClick={() => onDelete(item.id)} size="small" sx={{ bgcolor: 'rgba(211, 47, 47, 0.05)' }}>
                        <DeleteIcon fontSize="small" />
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