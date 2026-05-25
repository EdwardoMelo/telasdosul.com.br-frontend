import React from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Paper,
  Divider,
} from "@mui/material";
import {
  LocalFireDepartment,
  Security,
  Handshake,
  Lightbulb,
  Nature,
  CheckCircle,
} from "@mui/icons-material";
import { Stack, styled } from "@mui/system";
import { motion } from "framer-motion";
import Products from "./Products";
import hero from '../assets/hero.jpg'
import { contactInfo, openWhatsappWithConversion } from "@/utils";
import HeroSection from "@/components/home/HeroSection";
import { usePageSeo } from "@/hooks/usePageSeo";
import { FONT_BODY, FONT_DISPLAY } from "@/theme/typography";

const SectionTitle = styled(Typography)({
  position: "relative",
  marginBottom: "40px",
  "&::after": {
    content: '""',
    position: "absolute",
    bottom: "-15px",
    left: 0,
    width: "80px",
    height: "4px",
    backgroundColor: "primary.main",
  },
});

const FeatureCard = styled(Card)({
  height: "100%",
  transition: "transform 0.3s ease",
  borderRadius: 0,
  "&:hover": {
    transform: "translateY(-10px)",
    boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
    border: "1px solid lightgray",
  },
  cursor: "pointer",
});

const FeatureIcon = styled(Box)({
  color: "primary.main",
  fontSize: "3rem",
  marginBottom: "1rem",
});

const ValueCard = styled(Box)({
  display: "flex",
  alignItems: "center",
  marginBottom: "1rem",
  borderRadius: "8px",
  padding: 8,
});

const HOME_SEO = {
  title: "Telas do Sul | Telas, Arames e Gradis — Fornecedora RS",
  description:
    "Fornecedora de telas soldadas, arames farpados, gradis e acessórios para cercamento no Rio Grande do Sul. Orçamento rápido e atendimento especializado.",
};

const Home = () => {
  usePageSeo(HOME_SEO);

  const sectionTitleVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.7, ease: "easeOut" },
    },
  };

  const contentFadeInUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const imageScaleInVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const listStaggerContainerVariants = {
    hidden: {}, // No initial state needed for the container itself for whileInView
    visible: { transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
  };

  const listItemFadeInUpVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <HeroSection />
      {/* Products Section */}
      <Box sx={{ width: "100%" }}>
        <Products />
      </Box>
      {/* Sobre Nós Section */}
      <Box sx={{ py: 8, minBlockSize: "80vh" }}>
        <Container>
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <motion.div
                variants={contentFadeInUpVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    marginBottom: 4,
                  }}
                >
                  <Typography
                    variant="overline"
                    color="primary.main"
                    sx={{ fontWeight: 600 }}
                  >
                    QUEM SOMOS
                  </Typography>
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 700,
                      mb: 2,
                      mt: 1,
                      fontFamily: FONT_DISPLAY,
                    }}
                  >
                    Qualidade e confiança, é na Telas do Sul
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ color: "#3e4a61" }}
                    paragraph
                  >
                    Somos uma empresa especializada em fornecer telas de alta
                    qualidade e confiança, que oferece uma ampla variedade de
                    produtos para atender às necessidades de nossos clientes.
                    Nossa equipe de profissionais altamente qualificados
                    trabalha para garantir que nossos produtos sejam
                    excepcionais em termos de qualidade e durablidade.
                  </Typography>
                </Box>
              </motion.div>
              <motion.div
                variants={contentFadeInUpVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
              >
                <Button
                  variant="contained"
                  component={RouterLink}
                  to="/produtos"
                  sx={{
                    backgroundColor: "primary.main",
                    "&:hover": {
                      bgcolor: "primary.main",
                      color: "secondary.light",
                      scale: 1.1,
                    },
                    transition: "all 0.3s ease-in-out",
                    color: "white",
                    fontFamily: FONT_DISPLAY,
                  }}
                >
                  Conheça Nossos Produtos
                </Button>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={6}>
              <motion.div
                variants={imageScaleInVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
              ></motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>
      {/* Produtos Destacados */}

      {/* CTA Section */}
      <Box
        sx={{
          width: "100%",
          color: "white",
          py: 8,
          minHeight: "70vh",
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
        }}
      >
        <Box
          component={"img"}
          src={hero}
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            objectFit: "cover",
            width: "100%",
            height: "100%",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            objectFit: "cover",
            width: "100%",
            height: "100%",
            zIndex: 1,
            background: "rgba(0, 0, 0, 0.4)",
            opacity: 1,
          }}
        />
        <Box sx={{ position: "relative", zIndex: 2 }}>
          <Grid container justifyContent="center">
            <Grid item xs={12} spacing={2} md={8} textAlign="center">
              <motion.div
                variants={contentFadeInUpVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.5 }}
              >
                <Typography variant="h4" sx={{ mb: 2 }}>
                  Precisa de ajuda com cercamentos para sua casa ou empresa?
                </Typography>
              </motion.div>
              <motion.div
                variants={contentFadeInUpVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.5 }}
              >
                <Typography variant="body1" sx={{ mb: 4 }}>
                  Entre em contato com nossa equipe especializada para
                  consultoria e orçamentos personalizados.
                </Typography>
              </motion.div>
              <motion.div
                variants={contentFadeInUpVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.5 }}
              >
                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  justifyContent="center"
                >
                  <Button
                    variant="contained"
                    onClick={(e) => {
                      e.preventDefault();
                      openWhatsappWithConversion(`https://api.whatsapp.com/send?phone=${contactInfo.phone}&text=Oi, vim pelo site,gostaria de saber mais sobre os produtos e serviços da Telas do Sul!`);
                    }}
                    size="large"
                    sx={{
                      "&:hover": {
                        bgcolor: "primary.main",
                        color: "secondary.light",
                        scale: 1.1,
                      },
                      transition: "all 0.3s ease-in-out",
                      color: "white",
                    }}
                  >
                    Entre em Contato
                  </Button>
                  {/* <Button
                    variant="outlined"
                    size="large"
                    sx={{
                      color: "white",
                      borderColor: "white",
                      "&:hover": {
                        borderColor: "primary.main",
                        color: "primary.main",
                      },
                    }}
                  >
                    +55 51994475384
                  </Button> */}
                </Stack>
              </motion.div>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
