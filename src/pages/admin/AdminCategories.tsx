
import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Snackbar,
  Alert,
  CircularProgress,
  InputAdornment
} from '@mui/material';
import SearchIcon from "@mui/icons-material/Search";

import { Add, Edit, Delete } from '@mui/icons-material';
import { Categoria, CategoriaDTO } from '../../models/Categoria';
import { useNavigate } from 'react-router-dom';
import debounce from "lodash.debounce";


const AdminCategories = () => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingSave, setLoadingSave] = useState(false);
  const [error, setError] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Categoria | null>(null);
  const[searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

    const debouncedSetSearch = React.useMemo(
      () => debounce((value: string) => setDebouncedSearch(value), 400),
      []
    );

    const filteredCategorias = categorias.filter(
      (categoria) => categoria.nome.toLowerCase().includes(debouncedSearch.toLowerCase() ));
   
  const navigate = useNavigate();

  const fetchCategorias = async () => {
    try {
      setLoading(true);
      const data = await Categoria.getAll();
      setCategorias(data);
    } catch (err) {
      console.error('Erro ao carregar categorias:', err);
      setError('Falha ao carregar categorias. Por favor, tente novamente.');
      showSnackbar('Erro ao carregar categorias', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = (categoria?: Categoria) => {
   if(categoria){ 
    navigate(`/categorias/${categoria.id}/edit`);
    return
   }
    navigate(`/categorias/new`)
  };


  const openConfirmDelete = (categoria: Categoria) => {
    setSelectedCategory(categoria);
    setConfirmDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedCategory) return;
    try {
      await selectedCategory.delete();
      setConfirmDialogOpen(false);
      showSnackbar('Categoria excluída com sucesso', 'success');
      fetchCategorias();
    } catch (err) {
      console.error('Erro ao excluir categoria:', err);
      showSnackbar('Erro ao excluir categoria. Verifique se há produtos associados.', 'error');
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };
  
  useEffect(() => {
    fetchCategorias();
  }, []);
    
    useEffect(() => {
      debouncedSetSearch(searchTerm);
      return () => debouncedSetSearch.cancel();
    }, [searchTerm, debouncedSetSearch]);

  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
          }}
        >
          <Typography variant="h4" component="h1">
            Gerenciar Categorias
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <TextField
              size="small"
              variant="outlined"
              placeholder="Buscar categoria..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "primary.main", mr: 1 }} />
                  </InputAdornment>
                ),
                style: { background: "#fff" },
              }}
              sx={{ minWidth: 220 }}
            />
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => handleOpen()}
              sx={{
                bgcolor: "primary.main",
                "&:hover": { bgcolor: "primary.main" },
              }}
            >
              Nova Categoria
            </Button>
          </Box>
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", my: 8 }}>
            <CircularProgress sx={{ color: "primary.main" }} />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ my: 2 }}>
            {error}
          </Alert>
        ) : (
          <Paper sx={{ overflow: "hidden" }}>
            <TableContainer sx={{ maxHeight: "calc(100vh - 250px)" }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Nome</TableCell>
                    <TableCell align="center">Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredCategorias.map((categoria) => (
                    <TableRow hover key={categoria.id}>
                      <TableCell>{categoria.id}</TableCell>
                      <TableCell>{categoria.nome}</TableCell>
                      <TableCell align="center">
                        <IconButton
                          color="primary"
                          onClick={() => handleOpen(categoria)}
                          size="small"
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => openConfirmDelete(categoria)}
                          size="small"
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                  {categorias.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={3} align="center">
                        Nenhuma categoria cadastrada.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}
      </Box>

      {/* Modal de Criação/Edição */}

      {/* Diálogo de confirmação de exclusão */}
      <Dialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
      >
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <Typography>
            Você tem certeza que deseja excluir a categoria "
            {selectedCategory?.nome}"? Esta ação não pode ser desfeita e pode
            afetar produtos relacionados.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)}>Cancelar</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Excluir
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar de notificação */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AdminCategories;
