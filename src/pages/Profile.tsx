import React, { useEffect, useState } from 'react';
import { Usuario, UsuarioDTO } from '@/models/Usuario';
import { useUser } from '@/contexts/userContext';
import { Container, Box, Typography, Paper, Avatar, CircularProgress, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, InputAdornment, IconButton } from '@mui/material';
import { Edit, Visibility, VisibilityOff, Save, Cancel } from '@mui/icons-material';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const Profile = () => {
  const { user, logout } = useUser();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const navigate = useNavigate();

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");
  const id = queryParams.get("id");

  
  useEffect(() => {
    console.log('useEffect')
    const fetchUsuario = async () => {
      if (user?.id || id) {
        try {
          setLoading(true);
          const idToBeUsed = user?.id || Number(id);
          const usuarioData = await Usuario.getById(idToBeUsed);
          setUsuario(usuarioData);
        } catch (err) {
            console.error("Error fetching user:", err);
            setUsuario(null);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    fetchUsuario();
  }, [user]);

  useEffect(() => {
    if (usuario) setEmail(usuario.email);
  }, [usuario]);

  const handleEdit = () => setEditMode(true);
  const handleCancel = () => {
    setEditMode(false);
    setEmail(usuario?.email || "");
    setSenha("");
    setConfirmarSenha("");
    setFeedback(null);
  };

  const validateFields = ( ) =>  {
    console.log('validando campos')
    console.log('email: ', email)
    console.log('senha: ', senha)
    if (!email.trim()) {
      throw new Error("O email é obrigatório.");
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!senha.trim()){ 
        throw new Error("A senha é obrigatória.");
    }
    if (!emailRegex.test(email)) {
      throw new Error("Email inválido.");
    }
    if (senha && senha.length < 6) {
        console.log('validou senha')
      console.log('senha: ', senha)
      throw new Error("A senha deve ter pelo menos 6 caracteres.");
    }
    if (senha && senha !== confirmarSenha) {
      throw new Error("As senhas não conferem.");
    }
  }

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      validateFields();
      usuario.email = email;
      usuario.senha = senha;
      await usuario.update();
      setEditMode(false);
      setSenha("");
      setConfirmarSenha("");
      showSnackbar("Dados atualizados com sucesso!", "success");
      setUsuario(await Usuario.getById(usuario.id));
      navigate('/login');
    } catch (err: any) {
      showSnackbar(`Erro ao atualizar dados: ${err.message}`, "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress sx={{ color: 'primary.main' }} />
      </Box>
    );
  }

  if (!usuario) {
    return (
      <Container sx={{ py: 8 }}>
        <Typography variant="h5" color="error">Usuário não encontrado.</Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 6, minHeight: '80vh', marginTop: '10vh' }}>
      <Paper elevation={3} sx={{ p: 4, maxWidth: 500, mx: 'auto', borderRadius: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
          <Avatar sx={{ bgcolor: "primary.main", width: 72, height: 72, fontSize: 36 }}>
            {usuario.nome.charAt(0).toUpperCase()}
          </Avatar>
          <Typography variant="h5" sx={{ mt: 2, fontWeight: 'bold' }}>{usuario.nome}</Typography>
          {!editMode ? (
            <Typography variant="body1" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {usuario.email}
              <IconButton size="small" onClick={handleEdit} sx={{ ml: 1 }}>
                <Edit fontSize="small" />
              </IconButton>
            </Typography>
          ) : (
            <Box sx={{ width: '100%', mt: 2 }}>
              <TextField
                label="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                fullWidth
                margin="dense"
                type="email"
              />
              <TextField
                label="Nova Senha"
                value={senha}
                onChange={e => setSenha(e.target.value)}
                fullWidth
                margin="dense"
                type={showPassword ? 'text' : 'password'}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(v => !v)} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
              <TextField
                label="Confirmar Nova Senha"
                value={confirmarSenha}
                onChange={e => setConfirmarSenha(e.target.value)}
                fullWidth
                margin="dense"
                type={showConfirmPassword ? 'text' : 'password'}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowConfirmPassword(v => !v)} edge="end">
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
              {feedback && (
                <Typography color={feedback.includes('sucesso') ? 'success.main' : 'error'} sx={{ mt: 1 }}>{feedback}</Typography>
              )}
              <Box sx={{ display: 'flex', gap: 2, mt: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  color="inherit"
                  onClick={handleCancel}
                  startIcon={<Cancel />}
                  disabled={saving}
                >
                  Cancelar
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSave}
                  startIcon={<Save />}
                  disabled={saving}
                  sx={{ bgcolor: 'primary.main', '&:hover': { bgcolor: 'primary.main' } }}
                >
                  Salvar
                </Button>
              </Box>
            </Box>
          )}
        </Box>
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" color="text.secondary">Tipo de Usuário:</Typography>
          <Typography variant="body1" sx={{ fontWeight: 500 }}>
            {usuario.tipo_usuario_id === 1 ? 'Administrador' : 'Cliente'}
          </Typography>
        </Box>
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" color="text.secondary">Cadastrado em:</Typography>
          <Typography variant="body1">
            {usuario.created_at ? new Date(usuario.created_at).toLocaleDateString() : '-'}
          </Typography>
        </Box>
        <Button
          onClick={logout}
          sx={{ mt: 2, color: 'primary.main', '&:hover': { bgcolor: 'primary.main', color: 'white' } }}
        >
          Sair
        </Button>
      </Paper>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Profile;