import React, { useEffect } from "react";
import { Box, Container, Typography, Paper } from "@mui/material";
import ContactForm from "@/components/contact/ContactForm";
import hero from "../assets/hero.jpg";

const Contact = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <Box>
      <Box
        sx={{
          minHeight: "50vh",
          position: "relative",
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "white",
          padding: "60px 20px 40px 20px",
          textAlign: "left",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${hero})`,
        }}
      >
        <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
          Fale <strong style={{ color: "#005792" }}>Conosco</strong>
        </Typography>
        <Typography variant="h6" sx={{ mb: 1, maxWidth: 600, textAlign: "center" }}>
          Entre em contato para dúvidas, orçamentos ou sugestões. Nossa equipe
          responderá o mais breve possível!
        </Typography>
      </Box>
      <Container
        maxWidth="sm"
        sx={{
          mt: { xs: 0, md: -8 },
          mb: 8,
          position: "relative",
          zIndex: 2,
        }}
      >
        <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
          <ContactForm variant="page" />
        </Paper>
      </Container>
    </Box>
  );
};

export default Contact;
