
import React, { useState, useEffect, useMemo } from 'react';
import debounce from "lodash.debounce";
 

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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  IconButton,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { Produto, ProdutoDTO } from '../../models/Produto';
import { Categoria } from '../../models/Categoria';
import { useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";

const AdminProducts = () => {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingSave, setLoadingSave] = useState(false);
  const [error, setError] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Produto | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const debouncedSetSearch = useMemo(
    () =>
      debounce((value: string) => {
        setDebouncedSearch(value);
      }, 400), // 400ms de delay, ajuste como preferir
    []
  );

  
  const filteredProdutos = produtos.filter((produto) =>
    produto.nome.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  const navigate = useNavigate();



  const fetchData = async () => {
    try {
      setLoading(true);
      const [produtosData, categoriasData] = await Promise.all([
        Produto.getAll(),
        Categoria.getAll(),
      ]);

      setProdutos(produtosData);
      setCategorias(categoriasData);
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
      setError("Falha ao carregar dados. Por favor, tente novamente.");
      showSnackbar("Erro ao carregar dados", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = (produto?: Produto) => {
    if (produto) {
      navigate(`/produtos/${produto.id}/edit`);
      return;
    }
    navigate(`/produtos/new`);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const openConfirmDelete = (produto: Produto) => {
    setSelectedProduct(produto);
    setConfirmDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedProduct) return;
    try {
      await selectedProduct.delete();
      setConfirmDialogOpen(false);
      showSnackbar("Produto excluído com sucesso", "success");
      fetchData();
    } catch (err) {
      console.error("Erro ao excluir produto:", err);
      showSnackbar("Erro ao excluir produto", "error");
    }
  };

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    debouncedSetSearch(searchTerm);
    // Cleanup para evitar memory leaks
    return () => {
      debouncedSetSearch.cancel();
    };
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
            Gerenciar Produtos
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <TextField
              size="small"
              variant="outlined"
              placeholder="Buscar produto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ color: "primary.main", mr: 1 }} />,
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
                "&:hover": {
                  bgcolor: "primary.main",
                },
              }}
            >
              Novo Produto
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
                    <TableCell>Preço</TableCell>
                    <TableCell>Estoque</TableCell>
                    <TableCell>Categoria</TableCell>
                    <TableCell align="center">Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredProdutos.map((produto) => (
                    <TableRow hover key={produto.id}>
                      <TableCell>{produto.id}</TableCell>
                      <TableCell>{produto.nome}</TableCell>
                      <TableCell>
                        R$ {Number(produto.preco).toFixed(2).replace(".", ",")}
                      </TableCell>
                      <TableCell>{produto.estoque}</TableCell>
                      <TableCell>
                        {categorias.find((c) => c.id === produto.categoria_id)
                          ?.nome || "N/A"}
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          color="primary"
                          onClick={() => handleOpen(produto)}
                          size="small"
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => openConfirmDelete(produto)}
                          size="small"
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                  {produtos.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        Nenhum produto cadastrado.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}
      </Box>

      {/* Diálogo de confirmação de exclusão */}
      <Dialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
      >
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <Typography>
            Você tem certeza que deseja excluir o produto "
            {selectedProduct?.nome}"? Esta ação não pode ser desfeita.
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

export default AdminProducts;
