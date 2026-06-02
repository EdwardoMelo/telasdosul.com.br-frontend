import React from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  Stack,
  Chip,
} from "@mui/material";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { motion } from "framer-motion";
import { contactInfo } from "@/utils";
import { FONT_BODY, FONT_DISPLAY } from "@/theme/typography";
import aboutUsImage from "@/assets/about-us-hold-hand.png";

const MAP_EMBED_URL =
  "https://www.google.com/maps/embed?pb=!4v1780357651160!6m8!1m7!1sSjzaBA6A0RyDA5MjuylXLw!2m2!1d-29.88053193335254!2d-50.79301339171988!3f24.035016651611866!4f-0.2800309903198581!5f2.322796316337618";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

const AboutSection = () => {
  return (
    <Box
      component="section"
      id="quem-somos"
      sx={{
        width: "100%",
        py: { xs: 6, md: 8 },
        bgcolor: "#f4f6f8",
      }}
    >
      <Container maxWidth="lg">
        {/* Quem somos */}
        <Grid container spacing={{ xs: 3, md: 5 }} alignItems="center">
          <Grid item xs={12} md={6} order={{ xs: 1, md: 1 }}>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeUp}
            >
              <Box
                sx={{
                  position: "relative",
                  borderRadius: 3,
                  overflow: "hidden",
                  boxShadow: "0 12px 40px rgba(0, 32, 74, 0.12)",
                  aspectRatio: { xs: "4 / 3", md: "5 / 4" },
                }}
              >
                <Box
                  component="img"
                  src={aboutUsImage}
                  alt="Aperto de mãos em parceria diante de gradil e instalação industrial — Telas do Sul"
                  loading="lazy"
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(180deg, transparent 55%, rgba(0, 32, 74, 0.35) 100%)",
                  }}
                />
                <Chip
                  label="Parceria e confiança"
                  size="small"
                  sx={{
                    position: "absolute",
                    bottom: 16,
                    left: 16,
                    bgcolor: "secondary.main",
                    color: "#00204a",
                    fontFamily: FONT_DISPLAY,
                    fontWeight: 700,
                    fontSize: 12,
                  }}
                />
              </Box>
            </motion.div>
          </Grid>

          <Grid item xs={12} md={6} order={{ xs: 2, md: 2 }}>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeUp}
              custom={1}
            >
              <Stack spacing={2}>
                <Typography
                  variant="overline"
                  sx={{
                    fontFamily: FONT_DISPLAY,
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    color: "primary.main",
                    fontSize: 11,
                  }}
                >
                  Quem somos
                </Typography>

                <Typography
                  component="h2"
                  sx={{
                    fontFamily: FONT_DISPLAY,
                    fontWeight: 700,
                    fontSize: { xs: "1.5rem", md: "1.85rem" },
                    lineHeight: 1.2,
                    letterSpacing: "-0.02em",
                    color: "primary.main",
                  }}
                >
                  Qualidade e confiança na Telas do Sul
                </Typography>

                <Typography
                  sx={{
                    fontFamily: FONT_BODY,
                    fontSize: { xs: 14, md: 15 },
                    lineHeight: 1.65,
                    color: "text.secondary",
                  }}
                >
                  Somos uma fornecedora especializada em telas, arames, gradis e
                  acessórios para cercamento. Nossa equipe trabalha para entregar
                  produtos duráveis e atendimento próximo, do orçamento à entrega
                  no Rio Grande do Sul.
                </Typography>

                <Button
                  component={RouterLink}
                  to="/produtos"
                  variant="contained"
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    alignSelf: "flex-start",
                    mt: 0.5,
                    bgcolor: "primary.main",
                    fontFamily: FONT_DISPLAY,
                    fontWeight: 600,
                    textTransform: "none",
                    borderRadius: 2,
                    px: 2.5,
                    py: 1,
                    fontSize: 14,
                    boxShadow: "none",
                    "&:hover": {
                      bgcolor: "primary.dark",
                      boxShadow: "0 4px 14px rgba(0, 32, 74, 0.2)",
                    },
                  }}
                >
                  Conheça nossos produtos
                </Button>
              </Stack>
            </motion.div>
          </Grid>
        </Grid>

        {/* Onde estamos */}
        <Box sx={{ mt: { xs: 6, md: 8 } }}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={fadeUp}
          >
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              sx={{ mb: { xs: 2, md: 3 } }}
            >
              <LocationOnOutlinedIcon sx={{ color: "primary.main" }} />
              <Box>
                <Typography
                  variant="overline"
                  sx={{
                    fontFamily: FONT_DISPLAY,
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    color: "primary.main",
                    fontSize: 11,
                    display: "block",
                  }}
                >
                  Onde estamos
                </Typography>
                <Typography
                  sx={{
                    fontFamily: FONT_BODY,
                    fontSize: 14,
                    color: "text.secondary",
                  }}
                >
                  Visite nossa loja ou solicite um orçamento
                </Typography>
              </Box>
            </Stack>
          </motion.div>

          <Grid container spacing={3} alignItems="stretch">
            <Grid item xs={12} md={4}>
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={fadeUp}
                style={{ height: "100%" }}
              >
                <Box
                  sx={{
                    height: "100%",
                    minHeight: { xs: "auto", md: 280 },
                    p: 3,
                    borderRadius: 3,
                    bgcolor: "background.paper",
                    border: 1,
                    borderColor: "divider",
                    boxShadow: "0 4px 20px rgba(0, 32, 74, 0.06)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    gap: 2,
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: FONT_DISPLAY,
                      fontWeight: 700,
                      fontSize: 18,
                      color: "primary.main",
                    }}
                  >
                    Telas do Sul
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: FONT_BODY,
                      fontSize: 14,
                      lineHeight: 1.6,
                      color: "text.secondary",
                    }}
                  >
                    {contactInfo.address}
                  </Typography>
                  <Button
                    component="a"
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contactInfo.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="outlined"
                    size="small"
                    startIcon={<LocationOnOutlinedIcon />}
                    sx={{
                      alignSelf: "flex-start",
                      textTransform: "none",
                      fontFamily: FONT_DISPLAY,
                      fontWeight: 600,
                      borderColor: "primary.main",
                      color: "primary.main",
                      borderRadius: 2,
                    }}
                  >
                    Abrir no Google Maps
                  </Button>
                </Box>
              </motion.div>
            </Grid>

            <Grid item xs={12} md={8}>
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.15 }}
                variants={fadeUp}
              >
                <Box
                  sx={{
                    position: "relative",
                    borderRadius: 3,
                    overflow: "hidden",
                    border: 1,
                    borderColor: "divider",
                    boxShadow: "0 8px 32px rgba(0, 32, 74, 0.1)",
                    bgcolor: "background.paper",
                    minHeight: { xs: 280, md: 320 },
                  }}
                >
                  <Box
                    component="iframe"
                    src={MAP_EMBED_URL}
                    title="Localização Telas do Sul no Google Maps"
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    sx={{
                      display: "block",
                      width: "100%",
                      height: { xs: 280, sm: 320, md: 360 },
                      border: 0,
                    }}
                  />
                </Box>
              </motion.div>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default AboutSection;
