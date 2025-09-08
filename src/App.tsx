import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { ThemeProvider, createTheme, styled } from "@mui/material/styles";
import { Box, Button, CssBaseline, IconButton } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UserProvider } from "./contexts/userContext";
import './index.css'
// Layout
import Layout from "./components/Layout/Layout";
import AdminLayout from "./pages/admin/AdminLayout";

// Páginas
import Home from "./pages/Home";
import Products from "./pages/Products";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

// Páginas Admin
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminUsers from "./pages/admin/AdminUsers";
import { blue, green, red } from "@mui/material/colors";
import ProductDetail from "./pages/ProductDetail";
import ProductForm from "./pages/ProductForm";
import CategoriaForm from "./pages/CategoriaForm"; // Import CategoriaForm
import Profile from "./pages/Profile";
import { Instagram, WhatsApp } from "@mui/icons-material";
import Contact from "./pages/Contact";
import { NavProvider } from "./contexts/navContext";
import { ProductProvider } from "./contexts/productContext";
import { contactInfo } from "./utils";

// Configuração do cliente de consulta
const queryClient = new QueryClient();

// Tema personalizado
const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#00204a",
      light: "#005792",
    },
    secondary: {
      main: "#ffc93c",
    },
  },
  typography: {
    fontFamily: "Montserrat",
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          textTransform: "none",
          color: "black",
          fontWeight: 600,
          fontFamily: "Montserrat, sans-serif",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        },
      },
    },
  },
});

const App = () => {
  // Verificar se o usuário atual é admin
  const userString = localStorage.getItem("usuario");
  const user = userString ? JSON.parse(userString) : null;
  const isAdmin = user?.tipo_usuario_id === 1;

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />

        <BrowserRouter>
          <UserProvider>
            <NavProvider>
              <ProductProvider>
                <Routes>
                  {/* Rotas Públicas */}
                  <Route
                    path="/"
                    element={
                      <Layout>
                        <Outlet />
                      </Layout>
                    }
                  >
                    <Route index element={<Home />} />
                    <Route path="produtos" element={<Products />} />
                    <Route
                      path="produtos?search=:search"
                      element={<ProductForm />}
                    />
                    <Route path="produtos/:id" element={<ProductDetail />} />
                    <Route path="produtos/new" element={<ProductForm />} />{" "}
                    <Route path="contato" element={<Contact />} />
                    <Route path="perfil" element={<Profile />} />
                    {/* {                http://localhost:8080/perfil?token=${resetToken}?id=${userId}
                } */}
                    <Route
                      path="perfil?token=:token&id=:id"
                      element={<Profile />}
                    />
                    <Route path="produtos/:id/edit" element={<ProductForm />} />
                    <Route
                      path="categorias/new"
                      element={<CategoriaForm />}
                    />{" "}
                    {/* Changed to relative path */}A
                    <Route
                      path="categorias/:id/edit"
                      element={<CategoriaForm />}
                    />{" "}
                    {/* Added route for editing category */}
                    <Route path="login" element={<Login />} />
                  </Route>

                  {/* Rotas de Administração */}
                  <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="produtos" element={<AdminProducts />} />
                    <Route path="categorias" element={<AdminCategories />} />
                    <Route path="usuarios" element={<AdminUsers />} />
                  </Route>

                  {/* Rota para página não encontrada */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </ProductProvider>
            </NavProvider>
          </UserProvider>
        </BrowserRouter>
        <Box
          sx={{
            height: 60,
            width: "100%",
            zIndex: 40,
            position: "fixed",
            bottom: 0,
            left: 0,
            backgroundColor: "transparent",
            display: "flex",
            gap: 2,
            paddingX: 10,
            justifyContent: "end",
          }}
        >
          <IconButton
            sx={{
              backgroundColor: "white",
              height: 50,
              width: 50,
              color: "white",
              boxShadow: "0 0 10px 4px #39ff14", // Neon green shadow
              "&:hover": {
                boxShadow: "0 0 24px 8px #39ff14",
              },
            }}
            onClick={() =>
              window.open(
                `https://api.whatsapp.com/send?phone=${contactInfo.phone}&text=Oi, vim pelo site,gostaria de saber mais sobre os produtos e serviços da SulFire!`
              )
            }
          >
            <WhatsApp sx={{ color: "green" }} />
          </IconButton>

          <IconButton
            sx={{
              backgroundColor: "white",
              height: 50,
              width: 50,
              color: "white",
              boxShadow: "0 0 10px 4px red", // Neon pink shadow
              "&:hover": {
                boxShadow: "0 0 24px 8px red",
              },
            }}
            onClick={() => window.open("https://www.instagram.com")}
          >
            <Instagram sx={{ color: red[500] }} />
          </IconButton>
        </Box>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
