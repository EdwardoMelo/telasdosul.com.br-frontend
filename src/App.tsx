import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { ThemeProvider, createTheme, styled } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
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
import Contact from "./pages/Contact";
import { NavProvider } from "./contexts/navContext";
import { ProductProvider } from "./contexts/productContext";
import GlobalWhatsAppFab from "./components/Layout/GlobalWhatsAppFab";
import { FONT_BODY, FONT_DISPLAY } from "./theme/typography";

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
    fontFamily: FONT_BODY,
    h1: {
      fontFamily: FONT_DISPLAY,
      fontWeight: 800,
    },
    h2: {
      fontFamily: FONT_DISPLAY,
      fontWeight: 700,
    },
    h3: {
      fontFamily: FONT_DISPLAY,
      fontWeight: 600,
    },
    h4: {
      fontFamily: FONT_DISPLAY,
      fontWeight: 600,
    },
    button: {
      fontFamily: FONT_DISPLAY,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          fontFamily: FONT_BODY,
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          fontFamily: FONT_BODY,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          fontWeight: 600,
          fontFamily: FONT_DISPLAY,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          fontFamily: FONT_BODY,
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
                    {/* Changed to relative path */}
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
          <GlobalWhatsAppFab />
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
