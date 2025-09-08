import React, { useState, FormEvent } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Divider,
  Alert,
  IconButton,
  InputAdornment,
  Snackbar,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { styled } from "@mui/system";
import { Usuario } from "../models/Usuario";
import { useUser } from "@/contexts/userContext";
import MuiAlert, { AlertProps } from '@mui/material/Alert';

const StyledPaper = styled(Paper)({
  padding: "40px",
  marginTop: "40px",
  marginBottom: "40px",
});

const Login = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [nome, setNome] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const {login} = useUser();

  const handleToggleVisibilidade = () => {
    setMostrarSenha(!mostrarSenha);
  };

  const handleToggleForm = () => {
    setIsLogin(!isLogin);
    setError("");
  };

  const validateForm = () => {
    if (!email) return "Email é obrigatório";
    if (!senha) return "Senha é obrigatória";

    if (!isLogin) {
      if (!nome) return "Nome é obrigatório";
      if (senha.length < 6) return "A senha deve ter pelo menos 6 caracteres";
      if (senha !== confirmarSenha) return "As senhas não conferem";
    }

    return "";
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(email)) throw new Error("Email inválido, preencha com seu email da conta para que possamos lhe enviar o link de recuperação.");
    return 
  }

  const showFeedback = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleSendPasswordReset = async () => { 
    try{ 
      validateEmail(email);
      const response = await Usuario.sendPasswordReset(email);
      if(response.status === 200){
        showFeedback("Email de recuperação enviado com sucesso.", "success");
      }
    }catch(err: any){
      showFeedback(`Ocorreu um erro: ${err.message}`, "error");
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const validacaoError = validateForm();
    if (validacaoError) {
      showFeedback(validacaoError, "error");
      return;
    }
    setLoading(true);
    setError("");
    try {
      if (isLogin) {
        const { token, usuario } = await Usuario.login(email, senha);
        login(usuario, token);
        navigate("/")
        return;
      }
      const novoUsuario = new Usuario({
        id: 0,
        nome,
        email,
        senha,
        tipo_usuario_id: 2, // Cliente por padrão
        created_at: "",
        updated_at: "",
      });
      await novoUsuario.signUp();
      setIsLogin(true);
      showFeedback("Conta criada com sucesso! Faça login.", "success");
    } catch (err: any) {
      const { error } = err.response?.data || { error: err.message };
      showFeedback(`Ocorreu um erro: ${error}`, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <StyledPaper elevation={3}>
        <Box textAlign="center" mb={4}>
          <Typography component="h1" variant="h4" fontWeight="bold">
            {isLogin ? "Login" : "Criar Conta"}
          </Typography>
          <Typography variant="body1" color="textSecondary" mt={1}>
            {isLogin
              ? "Entre com suas credenciais para acessar sua conta"
              : "Preencha os dados abaixo para criar sua conta"}
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={2}>
            {!isLogin && (
              <Grid item xs={12}>
                <TextField
                  label="Nome Completo"
                  variant="outlined"
                  fullWidth
                  required
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                />
              </Grid>
            )}
            <Grid item xs={12}>
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Senha"
                variant="outlined"
                fullWidth
                required
                type={mostrarSenha ? "text" : "password"}
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleToggleVisibilidade} edge="end">
                        {mostrarSenha ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            {!isLogin && (
              <Grid item xs={12}>
                <TextField
                  label="Confirmar Senha"
                  variant="outlined"
                  fullWidth
                  required
                  type={mostrarSenha ? "text" : "password"}
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                />
              </Grid>
            )}
          </Grid>

          {isLogin && (
            <Box textAlign="right" mt={1}>
              <Button
                onClick={handleSendPasswordReset}
                color="primary"
              >
                Esqueceu sua senha?
              </Button>
            </Box>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              mb: 2,
              py: 1.5,
              bgcolor: "primary.main",
              color: 'white',
              "&:hover": {
                bgcolor: "primary.main",
              },
            }}
            disabled={loading}
          >
            {loading ? "Processando..." : isLogin ? "Entrar" : "Cadastrar"}
          </Button>
        </Box>

        <Divider sx={{ my: 3 }}>
          <Typography variant="body2" color="textSecondary">
            OU
          </Typography>
        </Divider>

        <Box textAlign="center">
          <Typography variant="body1" mb={2}>
            {isLogin ? "Ainda não tem uma conta?" : "Já tem uma conta?"}
          </Typography>
          <Button
            variant="outlined"
            onClick={handleToggleForm}
            sx={{
              borderColor: "primary.main",
              color: "primary.main",
              "&:hover": {
                borderColor: "primary.main",
                bgcolor: "rgba(255, 165, 0, 0.1)",
              },
            }}
          >
            {isLogin ? "Criar Conta" : "Fazer Login"}
          </Button>
        </Box>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={5000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <MuiAlert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </MuiAlert>
        </Snackbar>
      </StyledPaper>
    </Container>
  );
};

export default Login;
