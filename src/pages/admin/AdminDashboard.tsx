
import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Paper, 
  Box,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  CircularProgress
} from '@mui/material';
import { 
  ShoppingCart, 
  Inventory, 
  Category, 
  Person,
  LocalFireDepartment
} from '@mui/icons-material';
import { styled } from '@mui/system';
import { Produto } from '../../models/Produto';
import { Categoria } from '../../models/Categoria';
import { Usuario } from '../../models/Usuario';
import { useNavigate } from 'react-router-dom';

const DashboardCard = styled(Card)(({ theme }) => ({
  height: '100%',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
  },
}));

const StatsIcon = styled(Box)(({ theme }) => ({
  borderRadius: '50%',
  padding: '16px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: '16px',
  width: '70px',
  height: '70px',
}));

const AdminDashboard = () => {
  const [totalProdutos, setTotalProdutos] = useState(0);
  const [totalCategorias, setTotalCategorias] = useState(0);
  const [totalUsuarios, setTotalUsuarios] = useState(0);
  const [produtosRecentes, setProdutosRecentes] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Buscar dados
        const [produtos, categorias, usuarios] = await Promise.all([
          Produto.getAll(),
          Categoria.getAll(),
          Usuario.getAll()
        ]);
        
        setTotalProdutos(produtos.length);
        setTotalCategorias(categorias.length);
        setTotalUsuarios(usuarios.length);
        
        // Ordenar produtos por data de criação (mais recentes primeiro)
        const recentes = [...produtos].sort((a, b) => {
          const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
          const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
          return dateB - dateA;
        }).slice(0, 5);
        
        setProdutosRecentes(recentes);
      } catch (error) {
        console.error('Erro ao carregar dados do dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress sx={{ color: 'primary.main' }} />
      </Box>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" sx={{ mb: 4 }}>
        Painel de Controle
      </Typography>

      {/* Cards de estatísticas */}
      <Grid container spacing={3} sx={{ mb: 6 }}>
        <Grid item xs={12} sm={6} md={4}>
          <DashboardCard>
            <CardContent sx={{ textAlign: "center" }}>
              <StatsIcon
                sx={{ bgcolor: "rgba(255, 165, 0, 0.1)", margin: "0 auto" }}
              >
                <Inventory sx={{ fontSize: 40, color: "primary.main" }} />
              </StatsIcon>
              <Typography variant="h3" fontWeight="bold" sx={{ mb: 1 }}>
                {totalProdutos}
              </Typography>
              <Typography variant="subtitle1" color="textSecondary">
                Produtos Cadastrados
              </Typography>
            </CardContent>
          </DashboardCard>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <DashboardCard>
            <CardContent sx={{ textAlign: "center" }}>
              <StatsIcon
                sx={{ bgcolor: "rgba(25, 118, 210, 0.1)", margin: "0 auto" }}
              >
                <Category sx={{ fontSize: 40, color: "#1976d2" }} />
              </StatsIcon>
              <Typography variant="h3" fontWeight="bold" sx={{ mb: 1 }}>
                {totalCategorias}
              </Typography>
              <Typography variant="subtitle1" color="textSecondary">
                Categorias
              </Typography>
            </CardContent>
          </DashboardCard>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <DashboardCard>
            <CardContent sx={{ textAlign: "center" }}>
              <StatsIcon
                sx={{ bgcolor: "rgba(76, 175, 80, 0.1)", margin: "0 auto" }}
              >
                <Person sx={{ fontSize: 40, color: "#4caf50" }} />
              </StatsIcon>
              <Typography variant="h3" fontWeight="bold" sx={{ mb: 1 }}>
                {totalUsuarios}
              </Typography>
              <Typography variant="subtitle1" color="textSecondary">
                Usuários Registrados
              </Typography>
            </CardContent>
          </DashboardCard>
        </Grid>
      </Grid>

      {/* Conteúdo principal */}
      <Grid container spacing={4}>
        {/* Produtos Recentes */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: "100%" }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Produtos Recentes
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <List>
              {produtosRecentes.length > 0 ? (
                produtosRecentes.map((produto) => (
                  <React.Fragment key={produto.id}>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: "primary.main" }}>
                          <LocalFireDepartment />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText primary={produto.nome} />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                  </React.Fragment>
                ))
              ) : (
                <Typography color="textSecondary" align="center" sx={{ py: 2 }}>
                  Nenhum produto cadastrado
                </Typography>
              )}
            </List>
          </Paper>
        </Grid>

        {/* Links Rápidos */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: "100%" }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Ações Rápidas
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <DashboardCard
                  onClick={() => {
                    navigate("/admin/produtos");
                  }}
                  sx={{ bgcolor: "#f5f5f5", cursor: "pointer" }}
                >
                  <CardContent sx={{ textAlign: "center" }}>
                    <ShoppingCart
                      sx={{ fontSize: 40, color: "primary.main", mb: 1 }}
                    />
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      Gerenciar Produtos
                    </Typography>
                  </CardContent>
                </DashboardCard>
              </Grid>

              <Grid item xs={12} sm={6}>
                <DashboardCard
                  onClick={() => {
                    navigate("/admin/categorias");
                  }}
                  sx={{ bgcolor: "#f5f5f5", cursor: "pointer" }}
                >
                  <CardContent sx={{ textAlign: "center" }}>
                    <Category sx={{ fontSize: 40, color: "#1976d2", mb: 1 }} />
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      Gerenciar Categorias
                    </Typography>
                  </CardContent>
                </DashboardCard>
              </Grid>

              <Grid item xs={12} sm={6}>
                <DashboardCard
                  onClick={() => {
                    navigate("/admin/usuarios");
                  }}
                  sx={{ bgcolor: "#f5f5f5", cursor: "pointer" }}
                >
                  <CardContent sx={{ textAlign: "center" }}>
                    <Person sx={{ fontSize: 40, color: "#4caf50", mb: 1 }} />
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      Gerenciar Usuários
                    </Typography>
                  </CardContent>
                </DashboardCard>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminDashboard;
