import React from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Stack,
  Typography,
  Chip,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import VerifiedIcon from "@mui/icons-material/Verified";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import RequestQuoteOutlinedIcon from "@mui/icons-material/RequestQuoteOutlined";
import { motion } from "framer-motion";
import heroBg from "@/assets/hero.jpg";
import { contactInfo, openWhatsappWithConversion } from "@/utils";
import { FONT_BODY, FONT_DISPLAY } from "@/theme/typography";

const heroContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { delay: 0.15, staggerChildren: 0.12 },
  },
};

const heroItemVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

const WHATSAPP_URL = `https://api.whatsapp.com/send?phone=${contactInfo.phone}&text=${encodeURIComponent(
  "Olá! Vim pelo site e gostaria de um orçamento para telas e cercamentos."
)}`;

const TRUST_ITEMS = [
  { icon: VerifiedIcon, label: "Qualidade garantida" },
  { icon: LocalShippingOutlinedIcon, label: "Entrega no RS" },
  { icon: RequestQuoteOutlinedIcon, label: "Orçamento rápido" },
] as const;

const HeroSection = () => {
  return (
    <Box
      component="section"
      id="hero-section"
      aria-labelledby="hero-heading"
      sx={{
        position: "relative",
        width: "100%",
        minHeight: { xs: "72vh", sm: "78vh", md: "82vh" },
        maxHeight: { md: 720 },
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      {/* Background */}
      <Box
        component="img"
        src={heroBg}
        alt=""
        role="presentation"
        sx={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: { xs: "65% center", md: "center" },
        }}
      />

      {/* Gradient overlay — legibilidade mobile e desktop */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background: {
            xs: "linear-gradient(180deg, rgba(0, 20, 45, 0.88) 0%, rgba(0, 20, 45, 0.72) 45%, rgba(0, 20, 45, 0.55) 100%)",
            md: "linear-gradient(105deg, rgba(0, 20, 45, 0.92) 0%, rgba(0, 20, 45, 0.75) 42%, rgba(0, 20, 45, 0.35) 68%, rgba(0, 20, 45, 0.2) 100%)",
          },
        }}
      />

      <Container
        maxWidth="lg"
        sx={{
          position: "relative",
          zIndex: 2,
          py: { xs: 10, sm: 12, md: 14 },
          px: { xs: 2.5, sm: 3, md: 4 },
        }}
      >
        <motion.div
          variants={heroContainerVariants}
          initial="hidden"
          animate="visible"
        >
          <Stack
            spacing={{ xs: 2, sm: 2.5, md: 3 }}
            sx={{
              maxWidth: { xs: "100%", md: 620, lg: 680 },
              alignItems: { xs: "center", md: "flex-start" },
              textAlign: { xs: "center", md: "left" },
            }}
          >
            {/* Eyebrow — SEO local + contexto */}
            <motion.div variants={heroItemVariants}>
              <Typography
                component="p"
                sx={{
                  fontFamily: FONT_BODY,
                  fontSize: { xs: 11, sm: 12 },
                  fontWeight: 600,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "secondary.main",
                }}
              >
                Fornecedora · Telas e cercamentos · RS
              </Typography>
            </motion.div>

            {/* H1 — palavras-chave naturais */}
            <motion.div variants={heroItemVariants}>
              <Typography
                id="hero-heading"
                component="h1"
                sx={{
                  fontFamily: FONT_DISPLAY,
                  fontWeight: 800,
                  fontSize: {
                    xs: "clamp(1.65rem, 5.5vw, 2rem)",
                    sm: "clamp(2rem, 4vw, 2.5rem)",
                    md: "clamp(2.25rem, 3.2vw, 3rem)",
                  },
                  lineHeight: { xs: 1.2, md: 1.15 },
                  letterSpacing: "-0.03em",
                  color: "#fff",
                }}
              >
                Telas, arames e gradis para cercamento profissional
              </Typography>
            </motion.div>

            {/* Subtítulo */}
            <motion.div variants={heroItemVariants}>
              <Typography
                component="p"
                sx={{
                  fontFamily: FONT_BODY,
                  fontSize: {
                    xs: "clamp(0.95rem, 3.5vw, 1.05rem)",
                    sm: "1.05rem",
                    md: "1.125rem",
                  },
                  lineHeight: { xs: 1.55, md: 1.6 },
                  color: "rgba(255, 255, 255, 0.88)",
                  fontWeight: 400,
                  maxWidth: { xs: "100%", md: 520 },
                }}
              >
                <Box component="span" sx={{ fontWeight: 600, color: "#fff" }}>
                  Telas do Sul
                </Box>{" "}
                — telas soldadas, arames farpados, gradis e acessórios com
                atendimento especializado e orçamento sob medida para sua obra ou
                empresa.
              </Typography>
            </motion.div>

            {/* CTAs */}
            <motion.div variants={heroItemVariants} style={{ width: "100%" }}>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1.5}
                sx={{
                  width: "100%",
                  maxWidth: { xs: 360, sm: "none" },
                  mx: { xs: "auto", md: 0 },
                  alignItems: "stretch",
                }}
              >
                <Button
                  component={RouterLink}
                  to="/produtos"
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    flex: { sm: "0 0 auto" },
                    py: { xs: 1.35, md: 1.5 },
                    px: { xs: 2.5, md: 3 },
                    fontFamily: FONT_DISPLAY,
                    fontWeight: 700,
                    fontSize: { xs: "0.9rem", md: "0.95rem" },
                    borderRadius: 2,
                    textTransform: "none",
                    color: "#00204a",
                    bgcolor: "secondary.main",
                    boxShadow: "0 4px 20px rgba(255, 201, 60, 0.45)",
                    "&:hover": {
                      bgcolor: "#ffdb6e",
                      boxShadow: "0 6px 28px rgba(255, 201, 60, 0.55)",
                      transform: "translateY(-1px)",
                    },
                    transition: "all 0.2s ease",
                  }}
                >
                  Ver catálogo de produtos
                </Button>

                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<WhatsAppIcon />}
                  onClick={(e) => {
                    e.preventDefault();
                    openWhatsappWithConversion(WHATSAPP_URL);
                  }}
                  sx={{
                    flex: { sm: "0 0 auto" },
                    py: { xs: 1.35, md: 1.5 },
                    px: { xs: 2.5, md: 3 },
                    fontFamily: FONT_DISPLAY,
                    fontWeight: 600,
                    fontSize: { xs: "0.9rem", md: "0.95rem" },
                    borderRadius: 2,
                    textTransform: "none",
                    color: "#fff",
                    borderColor: "rgba(255,255,255,0.55)",
                    borderWidth: 2,
                    "&:hover": {
                      borderColor: "#fff",
                      bgcolor: "rgba(255,255,255,0.08)",
                      borderWidth: 2,
                    },
                  }}
                >
                  Solicitar orçamento
                </Button>
              </Stack>
            </motion.div>

            {/* Trust cues */}
            <motion.div variants={heroItemVariants} style={{ width: "100%" }}>
              <Stack
                direction="row"
                flexWrap="wrap"
                gap={1}
                justifyContent={{ xs: "center", md: "flex-start" }}
                sx={{ pt: { xs: 0.5, md: 1 } }}
              >
                {TRUST_ITEMS.map(({ icon: Icon, label }) => (
                  <Chip
                    key={label}
                    icon={<Icon sx={{ fontSize: 16, color: "secondary.main !important" }} />}
                    label={label}
                    size="small"
                    sx={{
                      fontFamily: FONT_BODY,
                      fontSize: 12,
                      fontWeight: 500,
                      color: "rgba(255,255,255,0.92)",
                      bgcolor: "rgba(255,255,255,0.1)",
                      border: "1px solid rgba(255,255,255,0.18)",
                      backdropFilter: "blur(6px)",
                      "& .MuiChip-icon": { ml: 0.75 },
                    }}
                  />
                ))}
              </Stack>
            </motion.div>
          </Stack>
        </motion.div>
      </Container>
    </Box>
  );
};

export default HeroSection;
