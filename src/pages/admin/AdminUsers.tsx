
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Chip
} from '@mui/material';
import debounce from "lodash.debounce";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import { Add, Edit, Delete, Visibility, VisibilityOff } from '@mui/icons-material';
import { Usuario, UsuarioDTO } from '../../models/Usuario';
import { TipoUsuario } from '../../models/TipoUsuario';

const AdminUsers = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [tiposUsuarios, setTiposUsuarios] = useState<TipoUsuario[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingSave, setLoadingSave] = useState(false);
  const [error, setError] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Usuario | null>(null);
  const [formData, setFormData] = useState<UsuarioDTO & { confirmarSenha?: string }>({
    id: 0,
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    tipo_usuario_id: 2,
    created_at: '',
    updated_at: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const[searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  
  const debouncedSetSearch = React.useMemo(
    () => debounce((value: string) => setDebouncedSearch(value), 400),
    []
  );

 
  const filteredUsuarios = usuarios.filter(
    (usuario) =>
      usuario.nome.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      usuario.email.toLowerCase().includes(debouncedSearch.toLowerCase())
  );


  const fetchData = async () => {
    try {
      setLoading(true);
      const [usuariosData, tiposUsuariosData] = await Promise.all([
        Usuario.getAll(),
        TipoUsuario.getAll(),
      ]);
      console.log("usuariosData: ", usuariosData);
      setUsuarios(usuariosData);

      setTiposUsuarios(tiposUsuariosData);
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
      setError("Falha ao carregar dados. Por favor, tente novamente.");
      showSnackbar("Erro ao carregar dados", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = (usuario?: Usuario) => {
    if (usuario) {
      setSelectedUser(usuario);
      setFormData({
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        senha: "",
        confirmarSenha: "",
        tipo_usuario_id: usuario.tipo_usuario_id,
        created_at: usuario.created_at?.toISOString() || "",
        updated_at: usuario.updated_at?.toISOString() || "",
      });
    } else {
      setSelectedUser(null);
      setFormData({
        id: 0,
        nome: "",
        email: "",
        senha: "",
        confirmarSenha: "",
        tipo_usuario_id: 2,
        created_at: "",
        updated_at: "",
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target;
    if (name) {
      setFormData({
        ...formData,
        [name]: name === "tipo_usuario_id" ? parseInt(value as string) : value,
      });
    }
  };

  const validateForm = () => {
    if (!formData.nome.trim()) return "Nome é obrigatório";
    if (!formData.email.trim()) return "Email é obrigatório";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) return "Email inválido";

    if (!selectedUser) {
      if (!formData.senha) return "Senha é obrigatória";
      if (formData.senha.length < 6)
        return "A senha deve ter pelo menos 6 caracteres";
      if (formData.senha !== formData.confirmarSenha)
        return "As senhas não conferem";
    } else if (formData.senha) {
      if (formData.senha.length < 6)
        return "A senha deve ter pelo menos 6 caracteres";
      if (formData.senha !== formData.confirmarSenha)
        return "As senhas não conferem";
    }

    return null;
  };

  const handleSave = async () => {
    const validationError = validateForm();
    if (validationError) {
      showSnackbar(validationError, "error");
      return;
    }
    try {
      setLoadingSave(true);
      const userData = { ...formData };
      delete userData.confirmarSenha;
      const usuario = new Usuario(userData);
      if (selectedUser) {
        if (!usuario.senha) {
          delete userData.senha;
        }
        await usuario.update();
        showSnackbar("Usuário atualizado com sucesso", "success");
        handleClose();
        fetchData();
        return;
      }
      await usuario.create();
      showSnackbar("Usuário criado com sucesso", "success");
      handleClose();
      fetchData();
    } catch (err) {
      console.error("Erro ao salvar usuário:", err);
      showSnackbar("Erro ao salvar usuário", "error");
    } finally {
      setLoadingSave(false);
    }
  };

  const openConfirmDelete = (usuario: Usuario) => {
    setSelectedUser(usuario);
    setConfirmDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedUser) return;
    try {
      await selectedUser.delete();
      setConfirmDialogOpen(false);
      showSnackbar("Usuário excluído com sucesso", "success");
      fetchData();
    } catch (err) {
      console.error("Erro ao excluir usuário:", err);
      showSnackbar("Erro ao excluir usuário", "error");
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

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  useEffect(() => {
    fetchData();
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
            Gerenciar Usuários
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <TextField
              size="small"
              variant="outlined"
              placeholder="Buscar usuário..."
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
              Novo Usuário
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
                    <TableCell>Email</TableCell>
                    <TableCell>Tipo</TableCell>
                    <TableCell>Cadastro</TableCell>
                    <TableCell align="center">Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredUsuarios.map((usuario) => (
                    <TableRow hover key={usuario.id}>
                      <TableCell>{usuario.id}</TableCell>
                      <TableCell>{usuario.nome}</TableCell>
                      <TableCell>{usuario.email}</TableCell>
                      <TableCell>
                        {usuario.tipo_usuario_id === 1 ? (
                          <Chip
                            label="Administrador"
                            color="primary"
                            size="small"
                            sx={{ bgcolor: "primary.main", fontWeight: "bold" }}
                          />
                        ) : (
                          <Chip
                            label="Cliente"
                            color="default"
                            size="small"
                            variant="outlined"
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        {usuario.created_at
                          ? new Date(usuario.created_at).toLocaleDateString()
                          : "-"}
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          color="primary"
                          onClick={() => handleOpen(usuario)}
                          size="small"
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => openConfirmDelete(usuario)}
                          size="small"
                          disabled={usuario.id === 1} // Não permitir excluir o admin principal
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                  {usuarios.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        Nenhum usuário cadastrado.
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
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>
          {selectedUser
            ? `Editar Usuário: ${selectedUser.nome}`
            : "Novo Usuário"}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                name="nome"
                label="Nome Completo"
                fullWidth
                required
                value={formData.nome}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="email"
                label="Email"
                fullWidth
                required
                type="email"
                value={formData.email}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel id="tipo-usuario-label">Tipo de Usuário</InputLabel>
                <Select
                  labelId="tipo-usuario-label"
                  name="tipo_usuario_id"
                  value={formData.tipo_usuario_id}
                  label="Tipo de Usuário"
                  onChange={(event) => {
                    setFormData({
                      ...formData,
                      tipo_usuario_id: parseInt(
                        event.target.value as string,
                        10
                      ),
                    });
                  }}
                >
                  {tiposUsuarios.map((tipo) => (
                    <MenuItem key={tipo.id} value={tipo.id}>
                      {tipo.tipo}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="senha"
                label={
                  selectedUser
                    ? "Nova Senha (deixe em branco para não alterar)"
                    : "Senha"
                }
                fullWidth
                required={!selectedUser}
                type={showPassword ? "text" : "password"}
                value={formData.senha}
                onChange={handleChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleTogglePasswordVisibility}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="confirmarSenha"
                label="Confirmar Senha"
                fullWidth
                required={!selectedUser || !!formData.senha}
                type={showPassword ? "text" : "password"}
                value={formData.confirmarSenha}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button
            onClick={handleSave}
            variant="contained"
            disabled={loadingSave}
            sx={{
              bgcolor: "primary.main",
              "&:hover": {
                bgcolor: "primary.main",
              },
            }}
          >
            {loadingSave ? "Salvando..." : "Salvar"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de confirmação de exclusão */}
      <Dialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
      >
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <Typography>
            Você tem certeza que deseja excluir o usuário "{selectedUser?.nome}
            "? Esta ação não pode ser desfeita.
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

export default AdminUsers;
