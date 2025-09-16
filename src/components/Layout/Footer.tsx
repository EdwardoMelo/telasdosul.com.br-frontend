
import React, { useEffect } from 'react';
import { Box, Container, Grid, Typography, Link, IconButton } from '@mui/material';
import {  WhatsApp, Email, Phone, LocationOn, ContactPhone } from '@mui/icons-material';
import { styled } from '@mui/system';
import { Categoria } from '@/models/Categoria';
import { contactInfo } from '@/utils';

const FooterContainer = styled(Box)({
  borderTop: '1px solid white',
  color: "#ffffff",
  paddingTop: "3rem",
  paddingBottom: "2rem",
});

const SectionTitle = styled(Typography)({
  color: 'primary',
  marginBottom: '1rem',
  fontWeight: 'bold',
});

const FooterLink = styled(Link)({
  color: '#ffffff',
  display: 'block',
  marginBottom: '0.5rem',
  textDecoration: 'none',
  '&:hover': {
    color: 'primary.main',
    textDecoration: 'underline',
  },
});

const SocialIcon = styled(IconButton)({
  color: '#ffffff',
  marginRight: '0.5rem',
  '&:hover': {
    color: 'primary.main',
    backgroundColor: 'rgba(255, 165, 0, 0.1)',
  },
});

const ContactItem = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  marginBottom: '0.5rem',
});

const socialLinks = [
  {
    icon: <WhatsApp />,
    label: "whatsapp",
    href: `https://api.whatsapp.com/send?phone=${contactInfo.phone}&text=Olá, vim pelo site da Telas do Sul!`,
  },
];

const Footer = () => {
  const [categorias, setCategorias] = React.useState([]);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const categoriaData = await Categoria.getAll();
        setCategorias(categoriaData);
      } catch (error) {
        console.error("Erro ao buscar categorias:", error);
      }
    };
    fetchCategorias();
  }, []);

  return (
    <FooterContainer sx={{ backgroundColor: "primary.main" }}>
      <Container>
        <Grid container spacing={4}>
          {/* Logo e Descrição */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="body2" sx={{ mb: 2 }}>
              A melhor loja de telas do Rio Grande do Sul.
            </Typography>
            <Box display="flex" alignItems="center">
              {socialLinks.map((link) => (
                <ContactItem key={link.label}>
                  <SocialIcon
                    size="small"
                    aria-label={link.label}
                    onClick={() => window.open(link.href)}
                  >
                    {link.icon}
                  </SocialIcon>
                </ContactItem>
              ))}
            </Box>
          </Grid>

          {/* Links Rápidos */}
          <Grid item xs={12} sm={6} md={3}>
            <SectionTitle variant="h6">Links Rápidos</SectionTitle>
            <FooterLink href="/">Home</FooterLink>
            <FooterLink href="/produtos">Produtos</FooterLink>
            <FooterLink href="/servicos">Serviços</FooterLink>
            <FooterLink href="/login">Login</FooterLink>
          </Grid>

          {/* Produtos */}
          <Grid item xs={12} sm={6} md={3}>
            <SectionTitle variant="h6">Produtos</SectionTitle>
            {categorias.map((categoria) => (
              <FooterLink
                key={categoria.id}
                href={`/produtos?categoria=${categoria.id}`}
              >
                {categoria.nome}
              </FooterLink>
            ))}
          </Grid>

          {/* Contato */}
          <Grid item xs={12} sm={6} md={3}>
            <SectionTitle variant="h6">Contato</SectionTitle>
            <ContactItem>
              <LocationOn sx={{ mr: 1, color: "white" }} />
              <Typography variant="body2">{contactInfo.address}</Typography>
            </ContactItem>
            <ContactItem>
              <ContactPhone sx={{ mr: 1, color: "white" }} />
              <Typography variant="body2">{contactInfo.phone}</Typography>
            </ContactItem>
            <ContactItem>
              <WhatsApp sx={{ mr: 1, color: "white" }} />
              <Typography variant="body2">{contactInfo.phone}</Typography>
            </ContactItem>
            <ContactItem>
              <Email sx={{ mr: 1, color: "white" }} />
              <Typography variant="body2">{contactInfo.email}</Typography>
            </ContactItem>
          </Grid>
        </Grid>

        {/* Copyright */}
        <Box
          sx={{
            borderTop: "1px solid #444",
            pt: 2,
            mt: 4,
            textAlign: "center",
          }}
        >
          <Typography variant="body2">
            © {new Date().getFullYear()} Telas do Sul. Todos os direitos
            reservados.
          </Typography>
        </Box>
      </Container>
    </FooterContainer>
  );
};

export default Footer;
