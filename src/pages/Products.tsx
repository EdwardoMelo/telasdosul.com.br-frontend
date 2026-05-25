import React, { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  Tabs,
  Tab,
  CircularProgress,
  Snackbar,
  Alert,
  Pagination,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { motion } from "framer-motion";
import { styled } from "@mui/material/styles";
import { Produto } from "../models/Produto";
import { Categoria } from "../models/Categoria";
import { useUser } from "@/contexts/userContext";
import { useProduct } from "@/contexts/productContext";
import { formatCategoryLabel } from "@/utils";

const LAYOUT = {
  containerMaxWidth: 1320,
  itemsPerPage: 18,
  imageAspectRatio: "4 / 3",
} as const;

const PageContainer = styled(Box)(({ theme }) => ({
  width: "100%",
  maxWidth: LAYOUT.containerMaxWidth,
  marginLeft: "auto",
  marginRight: "auto",
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  [theme.breakpoints.up("sm")]: {
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
  },
}));

const ProductCard = styled(Card)(({ theme }) => ({
  cursor: "pointer",
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  borderRadius: 12,
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: "0 1px 3px rgba(0, 32, 74, 0.06)",
  transition: "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease",
  overflow: "hidden",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 6px 16px rgba(0, 32, 74, 0.1)",
    borderColor: theme.palette.primary.light,
    "& .product-card-overlay": {
      opacity: 1,
    },
  },
}));

const ProductImageWrapper = styled(Box)({
  position: "relative",
  width: "100%",
  aspectRatio: LAYOUT.imageAspectRatio,
  overflow: "hidden",
  backgroundColor: "#f4f6f8",
});

const ProductCardOverlay = styled(Box)({
  position: "absolute",
  inset: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "rgba(0, 32, 74, 0.45)",
  opacity: 0,
  transition: "opacity 0.2s ease",
});

const ProductCardBody = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(0.75),
  padding: theme.spacing(1.25, 1.5, 1.5),
  flexGrow: 1,
}));

const CategoryChip = styled(Chip)({
  height: 22,
  fontSize: 11,
  fontWeight: 500,
  letterSpacing: "0.02em",
  backgroundColor: "#00204a",
  color: "#fff",
  alignSelf: "flex-start",
  "& .MuiChip-label": {
    paddingLeft: 8,
    paddingRight: 8,
  },
});

const ProductGrid = styled(Box)(({ theme }) => ({
  display: "grid",
  gap: theme.spacing(2),
  gridTemplateColumns: "1fr",
  [theme.breakpoints.up("sm")]: {
    gridTemplateColumns: "repeat(2, 1fr)",
  },
  [theme.breakpoints.up("md")]: {
    gridTemplateColumns: "repeat(4, 1fr)",
  },
  [theme.breakpoints.up("lg")]: {
    gridTemplateColumns: "repeat(5, 1fr)",
  },
  [theme.breakpoints.up("xl")]: {
    gridTemplateColumns: "repeat(6, 1fr)",
  },
}));

const AdminIconButton = styled(IconButton)(({ theme }) => ({
  width: 32,
  height: 32,
  backgroundColor: theme.palette.primary.main,
  color: "#fff",
  transition: "background-color 0.2s ease",
  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
  },
}));

const fadeInUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: Math.min(i * 0.04, 0.4),
      duration: 0.35,
      ease: "easeOut",
    },
  }),
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4 } },
};

const shuffleArray = (array: Produto[]) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const normalize = (str: string = "") =>
  str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]/g, "")
    .toLowerCase();

const Products = () => {
  const {
    selectedCategory,
    setSelectedCategory,
    currentPage,
    setCurrentPage,
    searchTerm,
  } = useProduct();

  const [searchParams, setSearchParams] = useSearchParams();
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const location = useLocation();
  const isHome = location.pathname === "/";
  const { user } = useUser();
  const navigate = useNavigate();

  const categoriaPorId = useMemo(
    () =>
      new Map(
        categorias.map((c) => [c.id, formatCategoryLabel(c.nome)])
      ),
    [categorias]
  );

  const handleCategoryChange = (
    _event: React.SyntheticEvent,
    newValue: number | null
  ) => {
    setSelectedCategory(newValue);
    setCurrentPage(1);
    if (newValue) {
      setSearchParams({ categoria: newValue.toString() });
    } else {
      setSearchParams({});
    }
  };

  const navigateToProduct = (id: number) => {
    navigate(`/produtos/${id}`);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const normalizedSearchTerm = normalize(searchTerm);

  const filteredProdutos = produtos.filter((produto) => {
    const nome = normalize(produto.nome);
    const descricao = normalize(produto.descricao ?? "");
    const marca = normalize(produto.marca ?? "");
    const categoria = normalize(produto.categoria?.nome ?? "");

    return (
      nome.includes(normalizedSearchTerm) ||
      descricao.includes(normalizedSearchTerm) ||
      marca.includes(normalizedSearchTerm) ||
      categoria.includes(normalizedSearchTerm)
    );
  });

  const indexOfLastItem = currentPage * LAYOUT.itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - LAYOUT.itemsPerPage;
  const currentProdutos = filteredProdutos.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredProdutos.length / LAYOUT.itemsPerPage);

  useEffect(() => {
    const fetchData = async () => {
      setError("");
      try {
        setLoading(true);
        const categoriasData = await Categoria.getAll();
        setCategorias(categoriasData);
        let produtosData;
        if (selectedCategory) {
          produtosData = await Produto.getByCategoria(selectedCategory);
        } else {
          produtosData = shuffleArray(await Produto.getAll());
        }
        setProdutos(produtosData);
      } catch {
        setError("Erro ao carregar os produtos. Por favor, tente novamente.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedCategory]);

  useEffect(() => {
    const categoria_id = searchParams.get("categoria");
    if (categoria_id) {
      setSelectedCategory(parseInt(categoria_id, 10));
    }
  }, [searchParams, setSelectedCategory]);

  const canManageCatalog =
    user?.hasPermission("criar_produto") ?? false;

  const tabSx = {
    minHeight: 40,
    minWidth: { xs: 72, sm: 96 },
    fontSize: { xs: 12, sm: 13 },
    fontWeight: 500,
    textTransform: "none" as const,
    letterSpacing: "0.01em",
    color: "text.secondary",
    px: { xs: 1, sm: 1.5 },
    py: 0.75,
    "&.Mui-selected": {
      color: "primary.main",
      fontWeight: 600,
    },
  };

  return (
    <motion.div initial="hidden" animate="visible" variants={fadeIn}>
      <Box
        component="section"
        sx={{
          py: { xs: 2, md: 3 },
          minHeight: "60vh",
          bgcolor: "background.default",
        }}
      >
        <PageContainer>
          {/* Header */}
          {(canManageCatalog || !isHome) && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: { xs: 1.5, md: 2 },
                gap: 2,
              }}
            >
              {!isHome && (
                <Typography
                  component="h1"
                  sx={{
                    fontWeight: 600,
                    fontSize: { xs: 20, sm: 22, md: 24 },
                    color: "primary.main",
                    letterSpacing: "-0.02em",
                  }}
                >
                  Produtos
                </Typography>
              )}
              {isHome && <Box />}
              {canManageCatalog && (
                <Tooltip title="Adicionar novo produto">
                  <AdminIconButton
                    size="small"
                    onClick={() => navigate("/produtos/new")}
                    aria-label="Adicionar produto"
                  >
                    <AddIcon sx={{ fontSize: 18 }} />
                  </AdminIconButton>
                </Tooltip>
              )}
            </Box>
          )}

          {/* Category filters */}
          <Box
            sx={{
              mb: { xs: 2, md: 2.5 },
              display: "flex",
              alignItems: "center",
              gap: 1,
              borderBottom: 1,
              borderColor: "divider",
            }}
          >
            {canManageCatalog && (
              <Tooltip title="Criar nova categoria">
                <AdminIconButton
                  size="small"
                  onClick={() => navigate("/categorias/new")}
                  aria-label="Criar categoria"
                  sx={{ flexShrink: 0, mb: 0.5 }}
                >
                  <AddIcon sx={{ fontSize: 18 }} />
                </AdminIconButton>
              </Tooltip>
            )}
            <Tabs
              value={selectedCategory}
              onChange={handleCategoryChange}
              variant="scrollable"
              scrollButtons="auto"
              allowScrollButtonsMobile
              sx={{
                minHeight: 40,
                flex: 1,
                "& .MuiTabs-indicator": {
                  height: 2,
                  borderRadius: 1,
                },
                "& .MuiTabs-flexContainer": {
                  gap: 0.25,
                },
              }}
            >
              <Tab label="Todos" value={null} sx={tabSx} />
              {categorias.map((categoria) => (
                <Tab
                  key={categoria.id}
                  label={formatCategoryLabel(categoria.nome)}
                  value={categoria.id}
                  sx={tabSx}
                />
              ))}
            </Tabs>
          </Box>

          {/* Results meta */}
          {!loading && !error && filteredProdutos.length > 0 && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: "block", mb: 1.5 }}
            >
              {filteredProdutos.length}{" "}
              {filteredProdutos.length === 1 ? "produto" : "produtos"}
              {selectedCategory != null &&
                categoriaPorId.get(selectedCategory) &&
                ` em ${categoriaPorId.get(selectedCategory)}`}
            </Typography>
          )}

          {/* Grid */}
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
              <CircularProgress size={36} sx={{ color: "primary.main" }} />
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ my: 2 }}>
              {error}
            </Alert>
          ) : currentProdutos.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 10 }}>
              <Typography
                variant="subtitle1"
                color="text.secondary"
                fontWeight={500}
              >
                Nenhum produto encontrado.
              </Typography>
              {searchTerm && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Tente outro termo na busca.
                </Typography>
              )}
            </Box>
          ) : (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              variants={fadeIn}
            >
              <ProductGrid>
                {currentProdutos.map((produto, idx) => {
                  const categoriaNome = categoriaPorId.get(
                    produto.categoria_id
                  );

                  return (
                    <motion.div
                      key={produto.id}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, amount: 0.1 }}
                      variants={fadeInUp}
                      custom={idx + 1}
                      style={{ height: "100%" }}
                    >
                      <ProductCard
                        onClick={() => navigateToProduct(produto.id)}
                        elevation={0}
                      >
                        <ProductImageWrapper>
                          <CardMedia
                            component="img"
                            title={produto.nome}
                            image={produto.imagem}
                            sx={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                          <ProductCardOverlay className="product-card-overlay">
                            <Typography
                              variant="caption"
                              sx={{
                                color: "#fff",
                                fontWeight: 600,
                                letterSpacing: "0.04em",
                                textTransform: "uppercase",
                              }}
                            >
                              Ver detalhes
                            </Typography>
                          </ProductCardOverlay>
                        </ProductImageWrapper>

                        <ProductCardBody>
                          <Typography
                            component="h2"
                            sx={{
                              fontSize: { xs: 13, sm: 14 },
                              fontWeight: 600,
                              lineHeight: 1.35,
                              color: "text.primary",
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                            }}
                          >
                            {produto.nome}
                          </Typography>

                          {categoriaNome && (
                            <CategoryChip
                              label={categoriaNome}
                              size="small"
                            />
                          )}

                          {produto.descricao && (
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{
                                fontSize: 12,
                                lineHeight: 1.45,
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                              }}
                            >
                              {produto.descricao}
                            </Typography>
                          )}
                        </ProductCardBody>
                      </ProductCard>
                    </motion.div>
                  );
                })}
              </ProductGrid>
            </motion.div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mt: { xs: 4, md: 5 },
                pb: 2,
              }}
            >
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                size="small"
                shape="rounded"
                sx={{
                  "& .MuiPaginationItem-root": {
                    fontSize: 13,
                  },
                  "& .MuiPaginationItem-root.Mui-selected": {
                    bgcolor: "primary.main",
                    color: "white",
                    "&:hover": {
                      bgcolor: "primary.dark",
                    },
                  },
                }}
              />
            </Box>
          )}
        </PageContainer>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity="success"
            sx={{ width: "100%" }}
          >
            Produto adicionado ao carrinho!
          </Alert>
        </Snackbar>
      </Box>
    </motion.div>
  );
};

export default Products;
