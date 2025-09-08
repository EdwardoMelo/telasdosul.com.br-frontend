
import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { Box, CssBaseline } from '@mui/material';
import { useNav } from '@/contexts/navContext';
import { useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { navbarHeight } = useNav();

  const location = useLocation();


  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <CssBaseline />
      <Navbar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          marginTop: `calc(${navbarHeight}px )`,   
        }}
      >
        {children}
      </Box>
      <Footer />
    </Box>
  );
};

export default Layout;
