import React from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Button,
  Chip,
  Container,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { motion } from "framer-motion";
import heroBg from "@/assets/hero.jpg";
import ContactForm from "@/components/contact/ContactForm";
import { contactInfo, openWhatsappWithConversion } from "@/utils";
import { FONT_BODY, FONT_DISPLAY } from "@/theme/typography";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const BENEFITS = [
  "Orçamento sem compromisso",
  "Atendimento especializado em cercamentos",
  "Resposta em até 24 horas úteis",
] as const;

const WHATSAPP_URL = `https://api.whatsapp.com/send?phone=${contactInfo.phone}&text=${encodeURIComponent(
  "Oi, vim pelo site e gostaria de um orçamento para telas e cercamentos!"
)}`;

const HomeContactSection = () => {
  return (
    <Box
      component="section"
      id="orcamento"
      aria-labelledby="home-contact-heading"
      sx={{
        width: "100%",
        position: "relative",
        overflow: "hidden",
        minHeight: { xs: "auto", md: "88vh" },
        display: "flex",
        alignItems: "center",
        py: { xs: 8, md: 10 },
      }}
    >
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
          objectPosition: { xs: "70% center", md: "center 40%" },
          transform: "scale(1.03)",
        }}
      />

      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background: {
            xs: "linear-gradient(180deg, rgba(0, 18, 42, 0.94) 0%, rgba(0, 18, 42, 0.82) 50%, rgba(0, 18, 42, 0.9) 100%)",
            md: "linear-gradient(100deg, rgba(0, 18, 42, 0.93) 0%, rgba(0, 18, 42, 0.78) 38%, rgba(0, 18, 42, 0.55) 58%, rgba(0, 18, 42, 0.72) 100%)",
          },
        }}
      />

      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 80% 60% at 85% 50%, rgba(0, 87, 146, 0.22) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 4,
          background:
            "linear-gradient(90deg, transparent, #ffc93c 30%, #005792 70%, transparent)",
          opacity: 0.85,
        }}
      />

      <Container
        maxWidth="lg"
        sx={{
          position: "relative",
          zIndex: 2,
          px: { xs: 2.5, sm: 3, md: 4 },
        }}
      >
        <Grid
          container
          spacing={{ xs: 4, md: 5, lg: 6 }}
          alignItems="center"
        >
          <Grid item xs={12} md={5} lg={5}>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.25 }}
              variants={fadeUp}
            >
              <Chip
                label="Fale com a Telas do Sul"
                size="small"
                sx={{
                  mb: 2,
                  fontWeight: 600,
                  fontFamily: FONT_BODY,
                  bgcolor: "rgba(255, 201, 60, 0.15)",
                  color: "secondary.main",
                  border: "1px solid rgba(255, 201, 60, 0.35)",
                }}
              />
              <Typography
                id="home-contact-heading"
                component="h2"
                sx={{
                  fontFamily: FONT_DISPLAY,
                  fontWeight: 800,
                  fontSize: { xs: "1.75rem", sm: "2.1rem", md: "2.35rem" },
                  lineHeight: 1.15,
                  letterSpacing: "-0.03em",
                  color: "#fff",
                  mb: 2,
                }}
              >
                Precisa de ajuda com{" "}
                <Box
                  component="span"
                  sx={{
                    color: "secondary.main",
                    display: "inline",
                  }}
                >
                  cercamentos
                </Box>{" "}
                para sua casa ou empresa?
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "rgba(255,255,255,0.82)",
                  lineHeight: 1.65,
                  mb: 3,
                  maxWidth: 440,
                  fontSize: { xs: "0.95rem", md: "1.05rem" },
                }}
              >
                Envie sua mensagem agora ou fale direto no WhatsApp. Nossa equipe
                orienta na escolha de telas, gradis e acessórios para o seu
                projeto.
              </Typography>

              <Stack spacing={1.25} sx={{ mb: 3.5 }}>
                {BENEFITS.map((item) => (
                  <Stack
                    key={item}
                    direction="row"
                    spacing={1.25}
                    alignItems="flex-start"
                  >
                    <CheckCircleOutlineIcon
                      sx={{
                        color: "secondary.main",
                        fontSize: 20,
                        mt: 0.15,
                        flexShrink: 0,
                      }}
                    />
                    <Typography
                      variant="body2"
                      sx={{
                        color: "rgba(255,255,255,0.88)",
                        fontWeight: 500,
                      }}
                    >
                      {item}
                    </Typography>
                  </Stack>
                ))}
              </Stack>

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1.5}
                alignItems={{ xs: "stretch", sm: "center" }}
              >
                <Button
                  variant="outlined"
                  startIcon={<WhatsAppIcon />}
                  onClick={(e) => {
                    e.preventDefault();
                    openWhatsappWithConversion(WHATSAPP_URL);
                  }}
                  sx={{
                    color: "#fff",
                    borderColor: "rgba(255,255,255,0.45)",
                    borderRadius: 2,
                    py: 1.1,
                    fontFamily: FONT_DISPLAY,
                    fontWeight: 600,
                    textTransform: "none",
                    "&:hover": {
                      borderColor: "#25D366",
                      bgcolor: "rgba(37, 211, 102, 0.12)",
                    },
                  }}
                >
                  WhatsApp direto
                </Button>
                <Button
                  component={RouterLink}
                  to="/contato"
                  endIcon={<ArrowForwardIcon sx={{ fontSize: 18 }} />}
                  sx={{
                    color: "rgba(255,255,255,0.75)",
                    textTransform: "none",
                    fontWeight: 500,
                    "&:hover": {
                      color: "secondary.main",
                      bgcolor: "transparent",
                    },
                  }}
                >
                  Página de contato completa
                </Button>
              </Stack>
            </motion.div>
          </Grid>

          <Grid item xs={12} md={7} lg={7}>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={{
                ...fadeUp,
                visible: {
                  ...fadeUp.visible,
                  transition: { ...fadeUp.visible.transition, delay: 0.12 },
                },
              }}
            >
              <ContactForm
                variant="hero"
                id="home-contact-form"
                title="Solicite seu orçamento"
                subtitle="Preencha em menos de um minuto — retornamos pelo canal informado."
                submitLabel="Enviar solicitação"
              />
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default HomeContactSection;
