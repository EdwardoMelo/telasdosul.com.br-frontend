import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Grid,
  Typography,
  Button,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  Breadcrumbs,
  Link,
  Stack,
  Tooltip,
  IconButton,
} from "@mui/material";
import {
  ArrowBack,
  Close,
  Edit as EditIcon,
  WhatsApp,
} from "@mui/icons-material";
import { Produto } from "../models/Produto";
import { useUser } from "@/contexts/userContext";
import { LinhaPrecoDTO } from "@/models/LinhaPreco";
import {
  contactInfo,
  formatCategoryLabel,
  formatProductPrice,
  openWhatsappWithConversionSolicitar,
} from "@/utils";
import { FONT_BODY, FONT_DISPLAY } from "@/theme/typography";
import ProductDescription from "@/components/product/ProductDescription";
import ProductPriceDisplay from "@/components/product/ProductPriceDisplay";

const LAYOUT = {
  containerMaxWidth: 1200,
} as const;

const PageContainer = ({ children }: { children: React.ReactNode }) => (
  <Box
    sx={{
      width: "100%",
      maxWidth: LAYOUT.containerMaxWidth,
      mx: "auto",
      px: { xs: 2, sm: 3 },
      py: { xs: 2, md: 3 },
    }}
  >
    {children}
  </Box>
);

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [produto, setProduto] = useState<Produto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [productImageOpen, setProductImageOpen] = useState(false);
  const [linhaSelecionada, setLinhaSelecionada] = useState<LinhaPrecoDTO | null>(
    null
  );

  const { user } = useUser();

  useEffect(() => {
    const fetchProduto = async () => {
      try {
        setLoading(true);
        if (id) {
          const produtoData = await Produto.getById(parseInt(id, 10));
          setProduto(produtoData);
        }
      } catch (err) {
        console.error("Erro ao carregar produto:", err);
        setError(
          "Erro ao carregar as informações do produto. Por favor, tente novamente."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchProduto();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  const handleGoBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate("/produtos");
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "50vh",
          }}
        >
          <CircularProgress size={36} sx={{ color: "primary.main" }} />
        </Box>
      </PageContainer>
    );
  }

  if (error || !produto) {
    return (
      <PageContainer>
        <Stack spacing={2} sx={{ minHeight: "40vh", pt: 4 }}>
          <IconButton
            onClick={handleGoBack}
            aria-label="Voltar"
            sx={backButtonSx}
          >
            <ArrowBack sx={{ fontSize: 20 }} />
          </IconButton>
          <Alert severity="error">{error || "Produto não encontrado"}</Alert>
        </Stack>
      </PageContainer>
    );
  }

  const displayName = formatCategoryLabel(produto.nome);
  const categoriaNome = produto.categoria?.nome
    ? formatCategoryLabel(produto.categoria.nome)
    : null;
  const buildWhatsappMessage = () => {
    let detalhePreco = "";
    if (produto.isPrecoPorMetrica && linhaSelecionada) {
      const ref = formatProductPrice(linhaSelecionada.preco);
      const opcao =
        linhaSelecionada.rotulo_exibicao ?? `${linhaSelecionada.valor}`;
      detalhePreco = ref ? ` — ${opcao}: ${ref}` : ` — ${opcao}`;
    } else {
      const ref = formatProductPrice(Number(produto.preco ?? 0));
      if (ref) detalhePreco = ` — ref. ${ref}`;
    }
    return encodeURIComponent(
      `Olá! Vim pelo site e gostaria de um orçamento para ${displayName} (código ${produto.id})${detalhePreco}.`
    );
  };

  return (
    <Box component="article" sx={{ bgcolor: "background.default", pb: 6 }}>
      <PageContainer>
        {/* Topo: voltar + breadcrumb + editar */}
        <Stack
          direction="row"
          alignItems="center"
          spacing={1.5}
          sx={{ mb: { xs: 2, md: 2.5 } }}
        >
          <Tooltip title="Voltar">
            <IconButton
              onClick={handleGoBack}
              aria-label="Voltar para produtos"
              sx={backButtonSx}
            >
              <ArrowBack sx={{ fontSize: 20 }} />
            </IconButton>
          </Tooltip>

          <Breadcrumbs
            separator="›"
            aria-label="Navegação"
            sx={{
              flex: 1,
              minWidth: 0,
              "& .MuiBreadcrumbs-li": { fontSize: 12 },
              "& .MuiTypography-root": { fontSize: 12 },
            }}
          >
            <Link
              color="inherit"
              href="/"
              onClick={(e) => {
                e.preventDefault();
                navigate("/");
              }}
              underline="hover"
              sx={{ fontFamily: FONT_BODY, color: "text.secondary" }}
            >
              Home
            </Link>
            <Link
              color="inherit"
              href="/produtos"
              onClick={(e) => {
                e.preventDefault();
                navigate("/produtos");
              }}
              underline="hover"
              sx={{ fontFamily: FONT_BODY, color: "text.secondary" }}
            >
              Produtos
            </Link>
            <Typography
              color="text.primary"
              noWrap
              sx={{ fontFamily: FONT_BODY, fontSize: 12, maxWidth: 180 }}
            >
              {displayName}
            </Typography>
          </Breadcrumbs>

          {user?.hasPermission("editar_produto") && (
            <Tooltip title="Editar produto">
              <IconButton
                size="small"
                onClick={() => navigate(`/produtos/${produto.id}/edit`)}
                sx={{
                  color: "primary.main",
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Stack>

        <Grid container spacing={{ xs: 3, md: 4 }} alignItems="flex-start">
          {/* Coluna da imagem — prioridade visual */}
          <Grid item xs={12} md={4} lg={4}>
            <Box
              sx={{
                position: { md: "sticky" },
                top: { md: 96 },
                maxWidth: { xs: 360, sm: 320, md: "100%" },
                mx: { xs: "auto", md: 0 },
              }}
            >
              <Box
                onClick={() => setProductImageOpen(true)}
                sx={{
                  position: "relative",
                  width: "100%",
                  aspectRatio: "4 / 3",
                  maxHeight: { xs: 240, sm: 260, md: 280 },
                  bgcolor: "#eef1f4",
                  borderRadius: 1.5,
                  border: "1px solid",
                  borderColor: "divider",
                  overflow: "hidden",
                  cursor: "zoom-in",
                  transition: "box-shadow 0.2s ease",
                  "&:hover": {
                    boxShadow: "0 4px 16px rgba(0, 32, 74, 0.1)",
                  },
                }}
              >
                <Box
                  component="img"
                  src={produto.imagem || "/images/product-placeholder.jpg"}
                  alt={displayName}
                  sx={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "center",
                    display: "block",
                  }}
                />
              </Box>

              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  display: "block",
                  textAlign: "center",
                  mt: 0.5,
                  fontSize: 11,
                  fontFamily: FONT_BODY,
                }}
              >
                Clique na imagem para ampliar
              </Typography>

              <Button
                variant="contained"
                size="small"
                startIcon={<WhatsApp sx={{ fontSize: 18 }} />}
                fullWidth
                onClick={() =>
                  openWhatsappWithConversionSolicitar(
                    `https://api.whatsapp.com/send?phone=${contactInfo.phone}&text=${buildWhatsappMessage()}`
                  )
                }
                sx={{
                  mt: 1.25,
                  py: 0.75,
                  fontFamily: FONT_DISPLAY,
                  fontWeight: 600,
                  fontSize: "0.8125rem",
                  textTransform: "none",
                  borderRadius: 1.5,
                  bgcolor: "primary.main",
                  boxShadow: "none",
                  "&:hover": {
                    bgcolor: "primary.dark",
                    boxShadow: "0 3px 10px rgba(0, 32, 74, 0.18)",
                  },
                }}
              >
                Solicitar orçamento
              </Button>
            </Box>
          </Grid>

          {/* Coluna de informações */}
          <Grid item xs={12} md={8} lg={8}>
            <Stack spacing={2}>
              <Box>
                {categoriaNome && (
                  <Chip
                    label={categoriaNome}
                    size="small"
                    sx={{
                      height: 22,
                      fontSize: 11,
                      fontFamily: FONT_BODY,
                      bgcolor: "primary.main",
                      color: "#fff",
                      mb: 1,
                    }}
                  />
                )}

                <Typography
                  component="h1"
                  sx={{
                    fontFamily: FONT_DISPLAY,
                    fontWeight: 700,
                    fontSize: {
                      xs: "clamp(1.35rem, 4vw, 1.6rem)",
                      md: "clamp(1.5rem, 2.5vw, 1.85rem)",
                    },
                    lineHeight: 1.25,
                    letterSpacing: "-0.02em",
                    color: "primary.main",
                    textTransform: "none",
                  }}
                >
                  {displayName}
                </Typography>

                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontFamily: FONT_BODY, mt: 0.5, display: "block" }}
                >
                  Código {produto.id}
                  {produto.marca ? ` · ${formatCategoryLabel(produto.marca)}` : ""}
                </Typography>

                <Box sx={{ mt: 1.5 }}>
                  <ProductPriceDisplay
                    tipoPreco={produto.tipo_preco}
                    preco={produto.preco}
                    linhasPreco={produto.linhas_preco}
                    metrica={produto.metrica}
                    onLinhaChange={setLinhaSelecionada}
                  />
                </Box>
              </Box>

              {produto.variacoes && produto.variacoes.length > 0 && (
                <Box
                  sx={{
                    py: 1.5,
                    px: 2,
                    borderRadius: 1.5,
                    bgcolor: "grey.50",
                    borderLeft: "3px solid",
                    borderColor: "primary.main",
                  }}
                >
                  <Typography
                    variant="overline"
                    sx={{
                      fontFamily: FONT_DISPLAY,
                      fontSize: 11,
                      fontWeight: 600,
                      letterSpacing: "0.08em",
                      color: "text.secondary",
                      display: "block",
                      mb: 0.75,
                    }}
                  >
                    Variações
                  </Typography>
                  <Stack spacing={0.5}>
                    {produto.variacoes.map((variacao) => (
                      <Typography
                        key={variacao.id}
                        variant="body2"
                        sx={{
                          fontFamily: FONT_BODY,
                          color: "text.secondary",
                          fontSize: 13,
                        }}
                      >
                        {formatCategoryLabel(variacao.nome)}
                      </Typography>
                    ))}
                  </Stack>
                </Box>
              )}

              <Divider />

              <ProductDescription
                description={produto.descricao ?? ""}
              />

              {/* CTA secundário no mobile — após descrição */}
              <Button
                variant="outlined"
                size="small"
                startIcon={<WhatsApp />}
                onClick={() =>
                  openWhatsappWithConversionSolicitar(
                    `https://api.whatsapp.com/send?phone=${contactInfo.phone}&text=${buildWhatsappMessage()}`
                  )
                }
                sx={{
                  display: { xs: "inline-flex", md: "none" },
                  alignSelf: "flex-start",
                  fontFamily: FONT_DISPLAY,
                  textTransform: "none",
                  borderRadius: 2,
                  borderColor: "primary.main",
                  color: "primary.main",
                }}
              >
                Solicitar orçamento
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </PageContainer>

      {/* Lightbox */}
      {productImageOpen && (
        <Box
          sx={{
            position: "fixed",
            inset: 0,
            bgcolor: "rgba(0, 20, 45, 0.92)",
            zIndex: 2000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "zoom-out",
            p: 2,
          }}
          onClick={() => setProductImageOpen(false)}
        >
          <Box
            component="img"
            src={produto.imagem || "/images/product-placeholder.jpg"}
            alt={displayName}
            sx={{
              maxWidth: "min(95vw, 900px)",
              maxHeight: "90vh",
              objectFit: "contain",
              borderRadius: 1,
            }}
            onClick={(e) => e.stopPropagation()}
          />
          <IconButton
            onClick={() => setProductImageOpen(false)}
            aria-label="Fechar"
            sx={{
              position: "fixed",
              top: 16,
              right: 16,
              bgcolor: "rgba(255,255,255,0.95)",
              "&:hover": { bgcolor: "#fff" },
            }}
          >
            <Close fontSize="small" />
          </IconButton>
        </Box>
      )}
    </Box>
  );
};

const backButtonSx = {
  width: 36,
  height: 36,
  flexShrink: 0,
  color: "text.secondary",
  border: "1px solid",
  borderColor: "divider",
  borderRadius: 1.5,
  transition: "all 0.2s ease",
  "&:hover": {
    color: "primary.main",
    borderColor: "primary.light",
    bgcolor: "rgba(0, 32, 74, 0.04)",
  },
} as const;

export default ProductDetail;
