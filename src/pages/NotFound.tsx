
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Container, Typography, Button, Box } from '@mui/material';
import { styled } from '@mui/system';
import { Home } from '@mui/icons-material';

const NotFoundContainer = styled(Container)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '70vh',
  textAlign: 'center',
  padding: '2rem',
});

const NotFound = () => {
  return (
    <NotFoundContainer>
      <Typography variant="h1" color="primary" sx={{ fontSize: { xs: '6rem', md: '8rem' }, fontWeight: 'bold' }}>
        404
      </Typography>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Página Não Encontrada
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: '600px' }}>
        A página que você está procurando não existe ou foi movida. 
        Por favor, verifique o endereço ou retorne à página inicial.
      </Typography>
      <Button
        variant="contained"
        component={RouterLink}
        to="/"
        startIcon={<Home />}
        sx={{ 
          bgcolor: 'primary.main', 
          '&:hover': { bgcolor: 'primary.main' } 
        }}
      >
        Voltar para o Início
      </Button>
    </NotFoundContainer>
  );
};

export default NotFound;
